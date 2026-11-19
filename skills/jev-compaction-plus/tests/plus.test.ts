import { describe, expect, it } from 'vitest';
import {
  compactSession,
  drawerPath,
  OPENROUTER_MODEL,
  OPENROUTER_URL,
  resolveEndpoint,
  resolveHookConfig,
  toSessionMessages,
} from '../hooks/fast-jev.ts';
import { collectToolCalls, compact, questionsFor, type JevAsker, type Message } from '../src/index.js';
import { previewOf } from '../src/state.js';

type SessionMessage = Message & { handle?: string };

function message(role: Message['role'], text: string, extra: Partial<SessionMessage> = {}): SessionMessage {
  return { role, text, toolUses: [], ...extra };
}
function call(id: string, tool: string, input: Record<string, unknown>, text: string): SessionMessage {
  return message('assistant', '', { toolUses: [{ tool_use_id: id, tool, input, text }], handle: `h-${id}` });
}
function result(id: string, text: string, isError = false): SessionMessage {
  return message('user', '', { toolResults: [{ tool_use_id: id, text, isError }], handle: `r-${id}` });
}

const bigLog = Array.from({ length: 400 }, (_, i) => `line ${i} INFO ok`).join('\n');
const env = 'APP_NAME=inventory\nWAREHOUSE_SHARD_COUNT=13\n';

function transcript(): SessionMessage[] {
  return [
    message('user', 'Audit the service.', { handle: 'h-0' }),
    call('tool-1', 'Read', { file_path: 'logs/app.log' }, bigLog),
    result('tool-1', bigLog),
    call('tool-2', 'Read', { file_path: 'config/app.env' }, env),
    result('tool-2', env),
    message('assistant', 'Done reading.', { handle: 'h-5' }),
    message('user', 'thanks', { handle: 'h-6' }),
  ];
}

function jev(answer: (name: string) => number): JevAsker {
  return {
    async ask(_state, questions) {
      return {
        answers: Object.fromEntries(Object.keys(questions).map((k) => [k, { type: 'noul', noul: answer(k) }])),
      } as never;
    },
  };
}

function okFetch(urls: string[], bodies: string[]) {
  return async (url: string, init?: { body?: string }) => {
    urls.push(url);
    bodies.push(init?.body ?? '');
    const { questions } = JSON.parse(init?.body ?? '{}') as { questions: Record<string, unknown> };
    const answers = Object.fromEntries(Object.keys(questions).map((k) => [k, { type: 'noul', noul: 1 }]));
    return { status: 200, ok: true, text: JSON.stringify({ answers }) };
  };
}

describe('jev-compaction-plus: Jev sees what it judges', () => {
  it('quotes the start and end of each result in its question', () => {
    const [logCall, envCall] = collectToolCalls(transcript(), 0, 120);
    expect(previewOf(env, 120)).toBe(env);
    expect(envCall!.resultPreview).toContain('WAREHOUSE_SHARD_COUNT=13');
    expect(logCall!.resultPreview).toContain('line 0 INFO ok');
    expect(logCall!.resultPreview).toContain('line 399 INFO ok');
    expect(logCall!.resultPreview).toMatch(/chars omitted/);
    expect(questionsFor(envCall!)['result_t2']!.instructions).toContain('WAREHOUSE_SHARD_COUNT=13');
  });
});

describe('jev-compaction-plus: small results stay', () => {
  it('keeps results under minDropChars whatever Jev says', async () => {
    const out = await compact(transcript(), jev(() => 0), { preserveRecentMessages: 1 });
    expect(out.decisions.map((d) => [d.id, d.action, d.reason])).toEqual([
      ['t1', 'drop_call', 'call_dropped'],
      ['t2', 'keep', 'small'],
    ]);
  });
});

describe('jev-compaction-plus: dropped results move to a drawer', () => {
  it('writes the full output to a file, labels it, and keeps the call', async () => {
    const input = transcript();
    const out = await compact(input, jev(() => 0), { preserveRecentMessages: 1, drawerDir: '/proj/.jev-drawer' });
    const paths = out.drawer.map((f) => f.path);
    expect(paths).toHaveLength(3);
    expect(paths[0]).toMatch(/^\/proj\/\.jev-drawer\/[^/]+\/t1-Read\.txt$/);
    expect(paths[1]).toMatch(/\/INDEX\.md$/);
    expect(paths[2]).toBe('/proj/.jev-drawer/.gitignore');
    expect(out.drawer[2]!.text).toBe('*\n');
    expect(out.drawer[0]!.text).toContain('line 399 INFO ok');
    expect(out.drawer[0]!.text.startsWith('Read {"file_path":"logs/app.log"}')).toBe(true);

    // The assistant's tool_use message stays the engine's own: rebuilding it orphans sibling calls.
    expect(out.messages[1]).toBe(input[1]);
    const label = out.messages[2]!.toolResults![0]!.text;
    expect(label).toBe(
      `[Jev compaction moved this ${bigLog.length}-char output to ${paths[0]}. Read that file if you need it again.]`,
    );
    expect(out.messages).toHaveLength(input.length);

    const session = toSessionMessages(input, out.messages);
    expect(session[1]!.handle).toBe('h-tool-1');
    expect(session[2]!.handle).toBeUndefined();
  });

  it('writes nothing when nothing is dropped, and deletes like the original when drawerDir is empty', async () => {
    expect((await compact(transcript(), jev(() => 1), { preserveRecentMessages: 1 })).drawer).toEqual([]);
    const legacy = await compact(transcript(), jev(() => 0), { preserveRecentMessages: 1, drawerDir: '' });
    expect(legacy.drawer).toEqual([]);
    expect(legacy.messages).toHaveLength(transcript().length - 2);
  });
});

describe('jev-compaction-plus: hook helpers', () => {
  it('picks the endpoint from the key', () => {
    const cfg = resolveHookConfig({});
    expect(resolveEndpoint(cfg, 'ts-key')).toEqual({ model: 'jev-latest' });
    expect(resolveEndpoint(cfg, 'sk-or-v1-x')).toEqual({ baseUrl: OPENROUTER_URL, model: OPENROUTER_MODEL });
    expect(resolveEndpoint({ ...cfg, model: 'typesafe/jev-2' }, 'sk-or-v1-x').model).toBe('typesafe/jev-2');
    expect(resolveEndpoint({ ...cfg, baseUrl: 'https://x' }, 'sk-or-v1-x')).toEqual({
      baseUrl: 'https://x',
      model: 'jev-latest',
    });
  });

  it('resolves a relative drawer folder against the session directory', () => {
    expect(drawerPath('.jev-drawer', 'C:\\proj\\')).toBe('C:\\proj/.jev-drawer');
    expect(drawerPath('.jev-drawer', '/home/me/proj')).toBe('/home/me/proj/.jev-drawer');
    expect(drawerPath('D:\\drawers', '/x')).toBe('D:\\drawers');
    expect(drawerPath('/tmp/d', '/x')).toBe('/tmp/d');
    expect(drawerPath('', '/x')).toBe('');
  });

  it('sends OpenRouter keys to OpenRouter end to end', async () => {
    const urls: string[] = [];
    const bodies: string[] = [];
    const config = { ...resolveHookConfig({ preserveRecentMessages: 1 }), apiKey: 'sk-or-v1-x' };
    await compactSession(transcript(), config, okFetch(urls, bodies));
    expect(urls).toEqual([OPENROUTER_URL]);
    expect(JSON.parse(bodies[0]!).model).toBe(OPENROUTER_MODEL);
  });
});
