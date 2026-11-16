/**
 * Gemini Live token endpoint for the voice-gemini module (Vercel function: copy to api/voice-token.mjs,
 * `npm i @google/genai`). Hands the browser a ONE-USE ephemeral token; the API key never leaves the server.
 * Model, voice and system prompt are locked into the token, so a visitor can't repurpose it.
 *
 * Env: GEMINI_API_KEY (required) · GEMINI_LIVE_MODEL (required, the Live model ID you use) ·
 *      VOICE_SYSTEM_PROMPT (client script) · GEMINI_VOICE (optional voice name) ·
 *      ALLOWED_ORIGIN (required in production, e.g. https://client.com)
 */
import { GoogleGenAI, Modality } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { apiVersion: 'v1alpha' } });

export async function POST(request) {
  const origin = request.headers.get('origin');
  const allowed = process.env.ALLOWED_ORIGIN;
  // shortcut: origin check + 1-use, 60 s tokens only; add per-IP rate limiting if a site sees abuse.
  if (allowed && origin !== allowed) return Response.json({ error: 'forbidden' }, { status: 403 });
  const model = process.env.GEMINI_LIVE_MODEL;
  if (!process.env.GEMINI_API_KEY || !model) return Response.json({ error: 'voice not configured' }, { status: 503 });

  const voice = process.env.GEMINI_VOICE;
  const now = Date.now();
  const token = await ai.authTokens.create({
    config: {
      uses: 1,
      newSessionExpireTime: new Date(now + 60_000).toISOString(),
      expireTime: new Date(now + 15 * 60_000).toISOString(), // hard cap on call length
      liveConnectConstraints: {
        model,
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: process.env.VOICE_SYSTEM_PROMPT || 'You are the friendly voice assistant for this business website. Be brief.',
          ...(voice && { speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } }),
        },
      },
      lockAdditionalFields: [],
    },
  });
  return Response.json({ token: token.name, model }, { headers: { 'cache-control': 'no-store' } });
}
