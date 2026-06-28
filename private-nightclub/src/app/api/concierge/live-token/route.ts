import { NextResponse } from "next/server";
import { GoogleGenAI, Modality } from "@google/genai";
import { liveSystemPrompt } from "@/lib/concierge-knowledge";

/**
 * Mints a short-lived ephemeral token so the browser can open a Gemini Live
 * (native audio) session for Tory WITHOUT ever seeing the real API key.
 *
 * Security: the persona, voice, model, and grounding are locked into the token
 * via `liveConnectConstraints`, so a tampered client cannot change who Tory is
 * or what model/voice it uses. The token is single-use and expires in 30 min,
 * with a 1-min window to open the session. Ephemeral tokens require v1alpha.
 */

export const runtime = "nodejs";

const LIVE_MODEL = process.env.GEMINI_LIVE_MODEL ?? "gemini-3.1-flash-live-preview";
const VOICE = process.env.GEMINI_VOICE ?? "Charon";

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Voice concierge is not configured." },
      { status: 503 },
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1alpha" } });
    const now = Date.now();

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(now + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(now + 60 * 1000).toISOString(),
        liveConnectConstraints: {
          model: LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            temperature: 0.8,
            systemInstruction: { parts: [{ text: liveSystemPrompt() }] },
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } },
              languageCode: "en-US",
            },
            // Surface text of both sides so the convo also renders in the chat.
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            // Resilience across the 15-min audio session cap / brief drops.
            sessionResumption: {},
          },
        },
      },
    });

    if (!token?.name) {
      return NextResponse.json({ error: "Could not start voice session." }, { status: 502 });
    }

    return NextResponse.json({ token: token.name, model: LIVE_MODEL });
  } catch {
    return NextResponse.json({ error: "Could not start voice session." }, { status: 502 });
  }
}
