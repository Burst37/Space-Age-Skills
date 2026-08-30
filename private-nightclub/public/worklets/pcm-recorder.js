/**
 * Mic capture worklet for Tory's live voice. The AudioContext is created at
 * 16 kHz, so the frames we receive here are already the rate Gemini Live wants
 * (raw 16-bit PCM, 16 kHz, little-endian). We buffer the 128-sample render
 * quanta into ~125 ms chunks, convert Float32 [-1,1] to Int16, and post the
 * bytes to the main thread, which base64-encodes and streams them.
 */
class PCMRecorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buf = new Int16Array(2048);
    this._n = 0;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const channel = input[0];
    if (!channel) return true;

    for (let i = 0; i < channel.length; i++) {
      let s = channel[i];
      if (s > 1) s = 1;
      else if (s < -1) s = -1;
      this._buf[this._n++] = s < 0 ? s * 0x8000 : s * 0x7fff;
      if (this._n === this._buf.length) {
        // Transfer a copy so the buffer can keep filling.
        this.port.postMessage(this._buf.slice(0, this._n));
        this._n = 0;
      }
    }
    return true;
  }
}

registerProcessor("pcm-recorder", PCMRecorder);
