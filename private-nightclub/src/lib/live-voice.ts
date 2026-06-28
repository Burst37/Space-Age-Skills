import {
  GoogleGenAI,
  Modality,
  type LiveServerMessage,
  type Session,
} from "@google/genai";

/**
 * Browser-side controller for Tory's live voice. Opens a Gemini Live (native
 * audio) session with a short-lived ephemeral token minted by our backend,
 * streams the mic up as 16 kHz PCM, plays Tory's 24 kHz PCM back gaplessly, and
 * cuts him off the instant the guest talks over him. Persona, voice, and model
 * are locked server-side in the token — this file only moves audio + transcript.
 */

export type LiveStatus = "idle" | "connecting" | "listening" | "speaking" | "error";

export type LiveCallbacks = {
  onStatus?: (s: LiveStatus) => void;
  /** Running transcript for the current turn. `final` when the turn closed. */
  onTranscript?: (role: "user" | "assistant", text: string, final: boolean) => void;
  onError?: (message: string) => void;
};

const INPUT_RATE = 16000;
const OUTPUT_RATE = 24000;

function base64FromBytes(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export class LiveVoiceSession {
  private cb: LiveCallbacks;
  private session: Session | null = null;
  private stream: MediaStream | null = null;
  private inCtx: AudioContext | null = null;
  private outCtx: AudioContext | null = null;
  private worklet: AudioWorkletNode | null = null;
  private legacyNode: ScriptProcessorNode | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;

  // Playback scheduling
  private nextStart = 0;
  private playing = new Set<AudioBufferSourceNode>();

  // Per-turn transcript accumulation
  private userText = "";
  private toryText = "";

  private status: LiveStatus = "idle";
  private closed = false;

  constructor(cb: LiveCallbacks) {
    this.cb = cb;
  }

  private setStatus(s: LiveStatus) {
    if (this.status === s) return;
    this.status = s;
    this.cb.onStatus?.(s);
  }

  async start() {
    this.setStatus("connecting");
    try {
      // 1) Mint an ephemeral token from our backend (never exposes the real key).
      const res = await fetch("/api/concierge/live-token", { method: "POST" });
      if (!res.ok) throw new Error("token");
      const { token, model } = (await res.json()) as { token: string; model: string };

      // 2) Mic first, so a permission denial fails before we open the socket.
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });

      // 3) Connect the Live session using the token as the key.
      const ai = new GoogleGenAI({ apiKey: token, httpOptions: { apiVersion: "v1alpha" } });
      this.session = await ai.live.connect({
        model,
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => this.setStatus("listening"),
          onmessage: (m: LiveServerMessage) => this.onMessage(m),
          onerror: () => this.fail("The voice line dropped. Try again in a moment."),
          onclose: () => {
            if (!this.closed) this.stop();
          },
        },
      });

      // 4) Wire up audio capture + playback.
      await this.startCapture();
      this.outCtx = new AudioContext({ sampleRate: OUTPUT_RATE });
      await this.outCtx.resume();
      this.setStatus("listening");
    } catch (e) {
      const denied = e instanceof DOMException && e.name === "NotAllowedError";
      this.fail(
        denied
          ? "I need mic access to chat by voice — enable it and tap again."
          : "I couldn't start the voice line. You can still type to me.",
      );
      this.stop();
    }
  }

  private async startCapture() {
    this.inCtx = new AudioContext({ sampleRate: INPUT_RATE });
    await this.inCtx.resume();
    this.micSource = this.inCtx.createMediaStreamSource(this.stream!);

    const send = (pcm: Int16Array) => {
      if (!this.session) return;
      const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
      this.session.sendRealtimeInput({
        audio: { data: base64FromBytes(bytes), mimeType: `audio/pcm;rate=${INPUT_RATE}` },
      });
    };

    // Preferred path: AudioWorklet. Fall back to ScriptProcessor on old Safari.
    if (this.inCtx.audioWorklet) {
      try {
        await this.inCtx.audioWorklet.addModule("/worklets/pcm-recorder.js");
        this.worklet = new AudioWorkletNode(this.inCtx, "pcm-recorder");
        this.worklet.port.onmessage = (ev) => send(ev.data as Int16Array);
        this.micSource.connect(this.worklet);
        return;
      } catch {
        // fall through to legacy
      }
    }

    const node = this.inCtx.createScriptProcessor(2048, 1, 1);
    node.onaudioprocess = (ev) => {
      const ch = ev.inputBuffer.getChannelData(0);
      const pcm = new Int16Array(ch.length);
      for (let i = 0; i < ch.length; i++) {
        let s = ch[i];
        s = s > 1 ? 1 : s < -1 ? -1 : s;
        pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      send(pcm);
    };
    this.micSource.connect(node);
    node.connect(this.inCtx.destination); // keep the graph alive
    this.legacyNode = node;
  }

  private onMessage(m: LiveServerMessage) {
    const sc = m.serverContent;

    // Guest started talking over Tory — stop him immediately.
    if (sc?.interrupted) this.clearPlayback();

    // Inbound audio (base64 PCM, concatenated across parts by the SDK getter).
    const audio = m.data;
    if (audio) this.enqueueAudio(audio);

    // Live transcripts of both sides → running text for the chat bubbles.
    const inT = sc?.inputTranscription?.text;
    if (inT) {
      this.userText += inT;
      this.cb.onTranscript?.("user", this.userText, false);
    }
    const outT = sc?.outputTranscription?.text;
    if (outT) {
      this.toryText += outT;
      this.cb.onTranscript?.("assistant", this.toryText, false);
    }

    if (sc?.turnComplete) {
      if (this.userText.trim()) this.cb.onTranscript?.("user", this.userText.trim(), true);
      if (this.toryText.trim()) this.cb.onTranscript?.("assistant", this.toryText.trim(), true);
      this.userText = "";
      this.toryText = "";
    }
  }

  private enqueueAudio(b64: string) {
    if (!this.outCtx) return;
    const bytes = bytesFromBase64(b64);
    const samples = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    if (samples.length === 0) return;

    const buf = this.outCtx.createBuffer(1, samples.length, OUTPUT_RATE);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < samples.length; i++) ch[i] = samples[i] / 0x8000;

    const src = this.outCtx.createBufferSource();
    src.buffer = buf;
    src.connect(this.outCtx.destination);

    const now = this.outCtx.currentTime;
    const startAt = Math.max(now, this.nextStart);
    src.start(startAt);
    this.nextStart = startAt + buf.duration;

    this.playing.add(src);
    this.setStatus("speaking");
    src.onended = () => {
      this.playing.delete(src);
      if (this.playing.size === 0 && !this.closed) this.setStatus("listening");
    };
  }

  private clearPlayback() {
    for (const s of this.playing) {
      try {
        s.onended = null;
        s.stop();
        s.disconnect();
      } catch {
        /* already stopped */
      }
    }
    this.playing.clear();
    this.nextStart = 0;
    if (!this.closed) this.setStatus("listening");
  }

  private fail(message: string) {
    this.cb.onError?.(message);
    this.setStatus("error");
  }

  stop() {
    this.closed = true;
    this.clearPlayback();
    try {
      this.session?.close();
    } catch {
      /* noop */
    }
    this.session = null;
    this.worklet?.port.close();
    this.worklet?.disconnect();
    this.legacyNode?.disconnect();
    this.micSource?.disconnect();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.inCtx?.close().catch(() => {});
    this.outCtx?.close().catch(() => {});
    this.worklet = null;
    this.legacyNode = null;
    this.micSource = null;
    this.stream = null;
    this.inCtx = null;
    this.outCtx = null;
    this.setStatus("idle");
  }
}
