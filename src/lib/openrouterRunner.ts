import { config, ApiAgentId } from "./config";

export interface ApiRunResult {
  ok: boolean;
  content: string;
  model: string;
  durationMs: number;
  error?: string;
}

export async function runApiAgent(
  agentId: ApiAgentId,
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  opts: { timeoutMs?: number } = {}
): Promise<ApiRunResult> {
  const agent = config.apiAgents[agentId];
  const apiKey = process.env[agent.keyEnv] || "";
  const start = Date.now();

  if (!apiKey) {
    return {
      ok: false,
      content: "",
      model: agent.model,
      durationMs: 0,
      error: `Missing API key: ${agent.keyEnv}`,
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 60_000);

  try {
    const res = await fetch(`${agent.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://space-age-ai.com",
        "X-Title": "Space Age Agent OS",
      },
      body: JSON.stringify({
        model: agent.model,
        messages,
        max_tokens: 4096,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, content: "", model: agent.model, durationMs: Date.now() - start, error: err };
    }

    const data = await res.json() as {
      choices: { message: { content: string } }[];
    };
    const content = data.choices?.[0]?.message?.content || "";

    return { ok: true, content, model: agent.model, durationMs: Date.now() - start };
  } catch (e) {
    clearTimeout(timer);
    return {
      ok: false,
      content: "",
      model: agent.model,
      durationMs: Date.now() - start,
      error: e instanceof Error ? e.message : "unknown error",
    };
  }
}
