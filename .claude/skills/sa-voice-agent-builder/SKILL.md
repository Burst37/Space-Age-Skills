---
name: sa-voice-agent-builder
description: >
  Space Age voice agent builder. Deploys Gemini 3.1 Flash TTS + Live API voice agents for
  outbound calls, appointment booking, and AI receptionist use cases. Includes 30-voice roster,
  audio tag system, full JS widget code, WebSocket backend, and ephemeral token pattern.
  Load when building VAPI configs, voice agents, or client phone/chat bots.
---

# SA Voice Agent Builder OS

## Stack

```
TTS Engine: Gemini 3.1 Flash (gemini-flash-tts)
Live API: Gemini Live API (WebSocket)
Voice Delivery: VAPI (outbound calls) or direct WebSocket (web widget)
Backend: Node.js / Express on VPS (146.190.78.120)
Auth: Ephemeral token pattern (never expose API key to client)
```

## 30-Voice Roster

| ID | Name | Gender | Tone | Best For |
|---|---|---|---|---|
| Puck | Puck | M | Energetic, playful | Sales, events |
| Charon | Charon | M | Deep, authoritative | Finance, legal |
| Kore | Kore | F | Warm, conversational | Healthcare, support |
| Fenrir | Fenrir | M | Bold, confident | Fitness, sports |
| Aoede | Aoede | F | Smooth, professional | General business |
| Leda | Leda | F | Friendly, approachable | Appointments |
| Orus | Orus | M | Calm, measured | Legal, medical |
| Zephyr | Zephyr | M | Bright, upbeat | E-commerce, retail |
| Schedar | Schedar | M | Serious, formal | B2B, enterprise |
| Gacrux | Gacrux | M | Gruff, no-nonsense | Construction, trades |
| Pulcherrima | Pulcherrima | F | Elegant, refined | Luxury, fashion |
| Achird | Achird | M | Friendly, casual | Hospitality |
| Zubenelgenubi | Zubenelgenubi | M | Soft, thoughtful | Mental health, coaching |
| Vindemiatrix | Vindemiatrix | F | Sharp, quick | Tech, SaaS |
| Sadachbia | Sadachbia | M | Warm, earnest | Non-profit, community |

## Audio Tag System (Gemini TTS)

Control voice delivery with these inline tags:

```
[speak slowly] — reduces pace by ~30%
[speak faster] — increases pace by ~25%
[pause] — 300ms pause
[long pause] — 600ms pause
[emphasize] word or phrase [/emphasize]
[whisper] sensitive info [/whisper]
[excited] — energy boost
[calm] — soft landing
```

## Full JS Widget Code (Web Voice Agent)

```javascript
// Space Age Voice Widget v1
// Ephemeral token pattern — API key never exposed to client

class SpaceAgeVoiceWidget {
  constructor(config) {
    this.serverUrl = config.serverUrl; // your VPS endpoint
    this.voice = config.voice || 'Kore';
    this.systemPrompt = config.systemPrompt;
    this.ws = null;
    this.mediaRecorder = null;
    this.audioContext = null;
    this.isListening = false;
  }

  async getEphemeralToken() {
    const res = await fetch(`${this.serverUrl}/api/voice-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voice: this.voice })
    });
    const data = await res.json();
    return data.token;
  }

  async start() {
    const token = await this.getEphemeralToken();
    
    this.ws = new WebSocket(
      `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${token}`
    );

    this.ws.onopen = () => {
      // Send setup message
      this.ws.send(JSON.stringify({
        setup: {
          model: 'models/gemini-2.0-flash-live-001',
          generation_config: {
            response_modalities: ['AUDIO'],
            speech_config: {
              voice_config: {
                prebuilt_voice_config: { voice_name: this.voice }
              }
            }
          },
          system_instruction: {
            parts: [{ text: this.systemPrompt }]
          }
        }
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.serverContent?.modelTurn?.parts) {
        for (const part of data.serverContent.modelTurn.parts) {
          if (part.inlineData?.mimeType === 'audio/pcm') {
            this.playAudio(part.inlineData.data);
          }
        }
      }
    };

    await this.startMicrophone();
  }

  async startMicrophone() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioContext = new AudioContext({ sampleRate: 16000 });
    const source = this.audioContext.createMediaStreamSource(stream);
    const processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    
    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = this.float32ToPCM16(inputData);
      const b64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
      
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          realtime_input: {
            media_chunks: [{ mime_type: 'audio/pcm;rate=16000', data: b64 }]
          }
        }));
      }
    };
    
    source.connect(processor);
    processor.connect(this.audioContext.destination);
    this.isListening = true;
  }

  float32ToPCM16(float32Array) {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcm16;
  }

  playAudio(base64PCM) {
    const binary = atob(base64PCM);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768;
    
    const audioCtx = new AudioContext({ sampleRate: 24000 });
    const buffer = audioCtx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start();
  }

  stop() {
    this.ws?.close();
    this.audioContext?.close();
    this.isListening = false;
  }
}
```

## WebSocket Backend (Node.js — VPS)

```javascript
// /api/voice-token endpoint
// Generates ephemeral token — never exposes GEMINI_API_KEY to client

app.post('/api/voice-token', async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/ephemeral-tokens`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          model: 'models/gemini-2.0-flash-live-001',
          config: {
            response_modalities: ['AUDIO'],
            speech_config: {
              voice_config: {
                prebuilt_voice_config: { voice_name: req.body.voice || 'Kore' }
              }
            }
          }
        })
      }
    );
    const data = await response.json();
    res.json({ token: data.token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

## VAPI Config Template

```json
{
  "assistant": {
    "name": "Grace",
    "voice": {
      "provider": "google",
      "voiceId": "Kore"
    },
    "model": {
      "provider": "google",
      "model": "gemini-2.0-flash-live-001",
      "systemPrompt": "[PASTE SYSTEM PROMPT HERE]",
      "temperature": 0.7
    },
    "firstMessage": "Hey, this is Grace with [CLIENT NAME]. How can I help you today?",
    "endCallFunctionEnabled": true,
    "silenceTimeoutSeconds": 30,
    "maxDurationSeconds": 600
  }
}
```

## Voice Agent Use Cases + Prompts

### Appointment Booking Bot
```
You are Grace, the AI receptionist for [BUSINESS NAME].
Your only job: book appointments.
Current availability: [PASTE SLOTS]
Services offered: [PASTE SERVICES]

Rules:
- Ask for name, phone, preferred time
- Confirm the appointment before ending
- If no availability matches, offer the next closest slot
- Never discuss pricing — say "The team will share details at your appointment"
- Keep responses under 30 words
- Sound human, not robotic
```

### Lead Qualification Bot
```
You are calling on behalf of [BUSINESS NAME].
Goal: qualify inbound leads for a website build.

Ask exactly 3 questions in order:
1. "What's the main thing you want your website to do for you?"
2. "What's your timeline — are you looking to launch within 30 days or longer?"
3. "Budget-wise, are you thinking under $1,500, $1,500-$5,000, or higher?"

After answers: "Perfect — I'm going to pass this to the team. 
They'll reach out within 24 hours to get you started."

Log: name, phone, answers to all 3 questions.
```
