"""
Space Age AI Solutions — Music Video Engine v3.0
Full autonomous music video creation: beat sync, visuals, effects, export
Supports: standalone render / Canva upload / CapCut export

Usage:
  python music_video_engine.py --audio track.mp3 --style bars --theme orange --artist "ARTIST" --title "TRACK"
  python music_video_engine.py --audio track.mp3 --bg background.mp4 --style spectrum --export capcut
"""

import os, sys, argparse, json, subprocess, tempfile, math, shutil
from pathlib import Path

try:
    import numpy as np
    import librosa
    import cv2
except ImportError:
    subprocess.run([sys.executable, "-m", "pip", "install", "librosa", "opencv-python-headless", "numpy", "-q"])
    import numpy as np
    import librosa
    import cv2

# ─── CONFIG ────────────────────────────────────────────────────────────────

THEMES = {
    "orange":  {"primary": (255,140,0),   "secondary": (255,200,50),  "glow": (255,80,0),   "bg": (10,5,0)},
    "cyan":    {"primary": (0,220,255),   "secondary": (100,255,255), "glow": (0,180,220),  "bg": (0,5,10)},
    "purple":  {"primary": (160,0,255),   "secondary": (200,100,255), "glow": (120,0,200),  "bg": (5,0,15)},
    "green":   {"primary": (0,255,100),   "secondary": (50,255,150),  "glow": (0,200,80),   "bg": (0,10,2)},
    "white":   {"primary": (240,240,240), "secondary": (200,200,200), "glow": (255,255,255),"bg": (5,5,5)},
    "red":     {"primary": (255,30,30),   "secondary": (255,120,50),  "glow": (200,0,0),    "bg": (10,0,0)},
    "gold":    {"primary": (255,200,0),   "secondary": (255,230,100), "glow": (220,160,0),  "bg": (8,5,0)},
    "neon":    {"primary": (255,0,150),   "secondary": (0,255,200),   "glow": (150,0,255),  "bg": (0,0,8)},
}

STYLES = ["bars", "waveform", "spectrum", "ring", "particles", "dual", "cinema"]

W, H = 1080, 1920   # 9:16 vertical (Reels/TikTok/Shorts)
FPS  = 30


# ─── AUDIO ANALYSIS ─────────────────────────────────────────────────────────

def analyze_audio(audio_path: str):
    print(f"[ANALYZE] Loading {audio_path}...")
    y, sr = librosa.load(audio_path, sr=None, mono=True)
    duration = librosa.get_duration(y=y, sr=sr)

    # Beat tracking
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
    beat_times = librosa.frames_to_time(beat_frames, sr=sr)

    # Onset strength (energy per frame)
    hop = int(sr / FPS)
    onset_env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    onset_norm = onset_env / (onset_env.max() + 1e-6)

    # Frequency bands per frame
    stft = np.abs(librosa.stft(y, hop_length=hop, n_fft=2048))
    freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)

    # Sub-bass (0-80Hz), Bass (80-250Hz), Mid (250-4kHz), High (4k-20kHz)
    sub  = stft[(freqs < 80)].mean(axis=0)
    bass = stft[(freqs >= 80) & (freqs < 250)].mean(axis=0)
    mid  = stft[(freqs >= 250) & (freqs < 4000)].mean(axis=0)
    high = stft[(freqs >= 4000)].mean(axis=0)

    def norm(x): return x / (x.max() + 1e-6)

    n_frames = int(duration * FPS)
    def resamp(arr): return np.interp(np.linspace(0, len(arr)-1, n_frames), np.arange(len(arr)), arr)

    print(f"[ANALYZE] Duration: {duration:.1f}s | Tempo: {float(tempo):.0f} BPM | {len(beat_times)} beats")

    return {
        "y": y, "sr": sr, "duration": duration,
        "beat_times": beat_times, "tempo": float(tempo),
        "onset": resamp(onset_norm),
        "sub":   resamp(norm(sub)),
        "bass":  resamp(norm(bass)),
        "mid":   resamp(norm(mid)),
        "high":  resamp(norm(high)),
        "n_frames": n_frames,
    }


# ─── FRAME RENDERERS ────────────────────────────────────────────────────────

def draw_glow(frame, x, y, radius, color, intensity=0.8):
    """Draw a glowing circle"""
    overlay = frame.copy()
    for r in range(radius, 0, -max(1, radius//8)):
        alpha = intensity * (1 - r/radius) ** 1.5
        c = tuple(int(ch * alpha) for ch in color)
        cv2.circle(overlay, (x, y), r, c, -1)
    cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)


def draw_bars(frame, data, frame_idx, theme, n_bars=64):
    """Frequency bar visualizer at bottom with glow"""
    onset = data["onset"][frame_idx]
    bass  = data["bass"][frame_idx]
    primary   = theme["primary"]
    secondary = theme["secondary"]
    glow_col  = theme["glow"]

    bar_w  = W // n_bars
    max_h  = H // 3
    base_y = int(H * 0.85)

    hop    = int(data["sr"] / FPS)
    t_samp = int(frame_idx * hop)
    chunk  = data["y"][t_samp : t_samp + hop * 4]
    if len(chunk) < 64:
        chunk = np.zeros(64)
    fft   = np.abs(np.fft.rfft(chunk, n=n_bars * 4))
    freqs = fft[:n_bars]
    freqs = freqs / (freqs.max() + 1e-6)

    for i, amp in enumerate(freqs):
        h  = int(amp * max_h * (1 + onset * 0.4))
        h  = max(4, h)
        x1 = i * bar_w + 2
        x2 = (i + 1) * bar_w - 2
        color = tuple(int(primary[c] * amp + secondary[c] * (1 - amp)) for c in range(3))
        cv2.rectangle(frame, (x1, base_y - h), (x2, base_y), color, -1)
        if amp > 0.6:
            draw_glow(frame, (x1 + x2)//2, base_y - h, bar_w, glow_col, amp * 0.3)

    if onset > 0.7:
        vignette_overlay = np.zeros_like(frame)
        cv2.circle(vignette_overlay, (W//2, H//2), int(W * 0.8 * onset), glow_col, 3)
        cv2.addWeighted(vignette_overlay, 0.15 * onset, frame, 1, 0, frame)


def draw_waveform(frame, data, frame_idx, theme):
    """Centered waveform with mirror reflection"""
    onset   = data["onset"][frame_idx]
    primary = theme["primary"]
    glow_c  = theme["glow"]

    hop    = int(data["sr"] / FPS)
    t_samp = int(frame_idx * hop)
    chunk  = data["y"][t_samp : t_samp + hop]
    if len(chunk) == 0:
        chunk = np.zeros(W)
    wave = np.interp(np.linspace(0, len(chunk)-1, W), np.arange(len(chunk)), chunk)
    wave = wave / (np.abs(wave).max() + 1e-6)

    center_y = H // 2
    amp      = int(H * 0.15 * (1 + onset * 0.5))
    pts_top  = [(x, int(center_y - wave[x] * amp)) for x in range(W)]
    pts_bot  = [(x, int(center_y + wave[x] * amp)) for x in range(W)]

    for thickness, alpha in [(5, 0.3), (3, 0.6), (1, 1.0)]:
        cv2.polylines(frame, [np.array(pts_top)], False, primary, thickness)
        cv2.polylines(frame, [np.array(pts_bot)], False,
                      tuple(int(c * 0.5) for c in primary), thickness)


def draw_ring(frame, data, frame_idx, theme):
    """Circular ring equalizer with beat pulse"""
    onset   = data["onset"][frame_idx]
    bass    = data["bass"][frame_idx]
    primary = theme["primary"]
    glow_c  = theme["glow"]

    cx, cy = W // 2, H // 2
    n_pts  = 128
    base_r = int(min(W, H) * 0.22)
    max_ext = int(min(W, H) * 0.12)

    hop    = int(data["sr"] / FPS)
    t_samp = int(frame_idx * hop)
    chunk  = data["y"][t_samp : t_samp + hop * 4]
    if len(chunk) < n_pts:
        chunk = np.zeros(n_pts)
    fft    = np.abs(np.fft.rfft(chunk, n=n_pts * 4))
    freqs  = fft[:n_pts]
    freqs  = freqs / (freqs.max() + 1e-6)

    angles = np.linspace(0, 2 * math.pi, n_pts, endpoint=False)
    outer  = [(int(cx + (base_r + freqs[i] * max_ext * (1 + onset * 0.4)) * math.cos(a)),
               int(cy + (base_r + freqs[i] * max_ext * (1 + onset * 0.4)) * math.sin(a)))
              for i, a in enumerate(angles)]
    inner  = [(int(cx + (base_r - 4) * math.cos(a)),
               int(cy + (base_r - 4) * math.sin(a))) for a in angles]

    for i in range(n_pts):
        amp   = freqs[i]
        color = tuple(int(primary[c] * amp + 80 * (1 - amp)) for c in range(3))
        cv2.line(frame, inner[i], outer[i], color, 2)

    if onset > 0.5:
        pulse_r = int(base_r + onset * max_ext * 1.5)
        cv2.circle(frame, (cx, cy), pulse_r, glow_c, 2)
        draw_glow(frame, cx, cy, pulse_r + 10, glow_c, onset * 0.2)

    cv2.circle(frame, (cx, cy), 8, primary, -1)


def draw_spectrum(frame, data, frame_idx, theme):
    """Full frequency spectrum waterfall display"""
    onset   = data["onset"][frame_idx]
    primary = theme["primary"]

    hop    = int(data["sr"] / FPS)
    t_samp = int(frame_idx * hop)
    chunk  = data["y"][t_samp : t_samp + hop * 8]
    if len(chunk) < 128:
        chunk = np.zeros(128)
    fft   = np.abs(np.fft.rfft(chunk, n=1024))[:512]
    fft   = fft / (fft.max() + 1e-6)
    fft   = np.interp(np.linspace(0, len(fft)-1, W), np.arange(len(fft)), fft)

    for x in range(W):
        amp  = fft[x] * (1 + onset * 0.3)
        h    = int(amp * H * 0.4)
        h    = max(2, h)
        grad = amp
        color = (int(primary[0] * grad), int(primary[1] * grad), int(primary[2] * grad))
        cv2.line(frame, (x, H - 50), (x, H - 50 - h), color, 1)


def draw_particles(frame, data, frame_idx, theme, state):
    """Beat-reactive floating particles"""
    onset   = data["onset"][frame_idx]
    bass    = data["bass"][frame_idx]
    primary = theme["primary"]
    glow_c  = theme["glow"]

    if onset > 0.65 and len(state["particles"]) < 200:
        for _ in range(int(onset * 15)):
            angle = np.random.uniform(0, 2 * math.pi)
            speed = np.random.uniform(2, 8) * (1 + onset)
            state["particles"].append({
                "x": W // 2 + np.random.randint(-100, 100),
                "y": H // 2 + np.random.randint(-100, 100),
                "vx": math.cos(angle) * speed,
                "vy": math.sin(angle) * speed,
                "life": 1.0,
                "size": np.random.randint(2, 8),
            })

    alive = []
    for p in state["particles"]:
        p["x"] += p["vx"]
        p["y"] += p["vy"]
        p["vy"] -= 0.1
        p["life"] -= 0.02
        if p["life"] > 0:
            alpha = p["life"]
            color = tuple(int(c * alpha) for c in primary)
            cv2.circle(frame, (int(p["x"]), int(p["y"])), p["size"], color, -1)
            alive.append(p)
    state["particles"] = alive


def draw_text_overlay(frame, artist: str, title: str, theme, frame_idx: int, n_frames: int):
    """Animated text overlay — artist name + track title"""
    primary = theme["primary"]
    white   = (240, 240, 240)

    alpha = min(1.0, frame_idx / 30)

    artist_y = int(H * 0.12)
    cv2.putText(frame, artist.upper(), (W // 2 - len(artist) * 18, artist_y),
                cv2.FONT_HERSHEY_DUPLEX, 2.2, tuple(int(c * alpha) for c in primary), 3)

    title_y = int(H * 0.19)
    cv2.putText(frame, title, (W // 2 - len(title) * 10, title_y),
                cv2.FONT_HERSHEY_SIMPLEX, 1.4, tuple(int(c * alpha) for c in white), 2)

    if frame_idx > 30:
        cta_y = int(H * 0.93)
        cv2.putText(frame, "STREAM NOW", (W // 2 - 120, cta_y),
                    cv2.FONT_HERSHEY_DUPLEX, 1.6, tuple(int(c * alpha) for c in primary), 2)


def draw_background_effects(frame, data, frame_idx, theme):
    """Ambient background pulse + vignette"""
    onset = data["onset"][frame_idx]
    sub   = data["sub"][frame_idx]
    bg    = theme["bg"]

    if sub > 0.3:
        cx, cy = W // 2, H // 2
        r = int(W * 0.4 * sub)
        glow_overlay = np.zeros_like(frame)
        cv2.circle(glow_overlay, (cx, cy), r, theme["glow"], -1)
        cv2.addWeighted(glow_overlay, 0.05 * sub, frame, 1, 0, frame)

    vig = np.ones_like(frame, dtype=np.float32)
    for y in range(H):
        for x in range(0, W, max(1, W//80)):
            dist = math.sqrt(((x - W//2) / (W/2))**2 + ((y - H//2) / (H/2))**2)
            v    = max(0, 1 - dist * 0.6)
            vig[y, x] = v
    frame_f = frame.astype(np.float32)
    frame_f[:, :, 0] *= vig[:, :, 0]
    frame_f[:, :, 1] *= vig[:, :, 1]
    frame_f[:, :, 2] *= vig[:, :, 2]
    np.clip(frame_f, 0, 255, out=frame_f)
    np.copyto(frame, frame_f.astype(np.uint8))


# ─── MAIN RENDERER ──────────────────────────────────────────────────────────

def render_video(audio_path: str, bg_path, style: str, theme_name: str,
                 artist: str, title: str, output_path: str):
    data  = analyze_audio(audio_path)
    theme = THEMES[theme_name]
    n_frames = data["n_frames"]

    bg_cap = None
    bg_frame_count = 0
    if bg_path and os.path.exists(bg_path):
        bg_cap = cv2.VideoCapture(bg_path)
        bg_frame_count = int(bg_cap.get(cv2.CAP_PROP_FRAME_COUNT))
        print(f"[RENDER] Background video: {bg_frame_count} frames")

    tmp_raw = output_path.replace(".mp4", "_raw.mp4")
    fourcc  = cv2.VideoWriter_fourcc(*"mp4v")
    writer  = cv2.VideoWriter(tmp_raw, fourcc, FPS, (W, H))

    state = {"particles": []}

    print(f"[RENDER] Rendering {n_frames} frames at {W}x{H} @ {FPS}fps...")
    for i in range(n_frames):
        if i % 100 == 0:
            print(f"  Frame {i}/{n_frames} ({100*i//n_frames}%)")

        if bg_cap and bg_frame_count > 0:
            bg_cap.set(cv2.CAP_PROP_POS_FRAMES, i % bg_frame_count)
            ret, frame = bg_cap.read()
            if not ret:
                frame = np.zeros((H, W, 3), dtype=np.uint8)
            else:
                frame = cv2.resize(frame, (W, H))
                frame = (frame * 0.4).astype(np.uint8)
        else:
            frame = np.zeros((H, W, 3), dtype=np.uint8)
            for y in range(H):
                v = int(15 * (1 - y / H))
                frame[y] = [theme["bg"][0] + v, theme["bg"][1] + v, theme["bg"][2] + v]

        draw_background_effects(frame, data, i, theme)

        if style == "bars":
            draw_bars(frame, data, i, theme)
        elif style == "waveform":
            draw_waveform(frame, data, i, theme)
        elif style == "ring":
            draw_ring(frame, data, i, theme)
        elif style == "spectrum":
            draw_spectrum(frame, data, i, theme)
        elif style == "particles":
            draw_particles(frame, data, i, theme, state)
        elif style == "dual":
            draw_bars(frame, data, i, theme, n_bars=32)
            draw_ring(frame, data, i, theme)
        elif style == "cinema":
            draw_bars(frame, data, i, theme, n_bars=48)
            draw_particles(frame, data, i, theme, state)

        draw_text_overlay(frame, artist, title, theme, i, n_frames)
        writer.write(frame)

    writer.release()
    if bg_cap:
        bg_cap.release()

    print(f"[ENCODE] Merging video + audio...")
    cmd = [
        "ffmpeg", "-y",
        "-i", tmp_raw,
        "-i", audio_path,
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest", "-movflags", "+faststart",
        output_path
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    os.remove(tmp_raw)
    print(f"[DONE] Output: {output_path}")
    return output_path


# ─── CAPCUT EXPORT ──────────────────────────────────────────────────────────

def export_capcut_package(audio_path: str, video_path: str, data: dict,
                          artist: str, title: str, output_dir: str):
    os.makedirs(output_dir, exist_ok=True)
    shutil.copy(video_path, os.path.join(output_dir, "visualizer.mp4"))

    srt_path = os.path.join(output_dir, "beat_markers.srt")
    with open(srt_path, "w") as f:
        for i, t in enumerate(data["beat_times"]):
            h, rem = divmod(t, 3600)
            m, s   = divmod(rem, 60)
            ms     = int((s % 1) * 1000)
            s      = int(s)
            t_end  = t + 0.1
            he, reme = divmod(t_end, 3600)
            me, se   = divmod(reme, 60)
            mse      = int((se % 1) * 1000)
            se       = int(se)
            f.write(f"{i+1}\n")
            f.write(f"{int(h):02d}:{int(m):02d}:{s:02d},{ms:03d} --> {int(he):02d}:{int(me):02d}:{se:02d},{mse:03d}\n")
            f.write(f"BEAT {i+1}\n\n")

    timeline = {
        "project": {"artist": artist, "title": title, "tempo": data["tempo"]},
        "beats": [round(t, 3) for t in data["beat_times"].tolist()],
        "sections": {
            "intro":   [0, float(data["beat_times"][min(8, len(data["beat_times"])-1)])],
            "verse1":  [float(data["beat_times"][min(8, len(data["beat_times"])-1)]),
                        float(data["beat_times"][min(32, len(data["beat_times"])-1)])],
        }
    }
    with open(os.path.join(output_dir, "timeline.json"), "w") as f:
        json.dump(timeline, f, indent=2)

    readme = f"""# CapCut Import Guide — {artist} - {title}

## Files
- `visualizer.mp4` — Your rendered music visualizer (import as main clip)
- `beat_markers.srt` — Beat timestamps (import as subtitles for timing reference)
- `timeline.json` — Beat data for custom automation

## Import Steps (CapCut Web / Mobile)
1. Open CapCut → New Project
2. Import `visualizer.mp4` as main track
3. Add `beat_markers.srt` as subtitle track (use as timing guide)
4. Add text animations at beat marker timestamps
5. Apply filters/effects at section boundaries from timeline.json

## Beat Count: {len(data["beat_times"])} beats | Tempo: {data["tempo"]:.0f} BPM
## Duration: {data["duration"]:.1f}s
"""
    with open(os.path.join(output_dir, "README.md"), "w") as f:
        f.write(readme)

    print(f"[CAPCUT] Package exported to: {output_dir}")
    return output_dir


# ─── TRANSFER.SH UPLOAD ─────────────────────────────────────────────────────

def upload_to_transfer(file_path: str) -> str:
    import urllib.request
    filename = os.path.basename(file_path)
    url = f"https://transfer.sh/{filename}"
    try:
        with open(file_path, "rb") as f:
            req = urllib.request.Request(url, data=f.read(), method="PUT")
            req.add_header("Max-Days", "7")
            with urllib.request.urlopen(req, timeout=120) as resp:
                public_url = resp.read().decode().strip()
        print(f"[UPLOAD] Uploaded to: {public_url}")
        return public_url
    except Exception as e:
        print(f"[UPLOAD] transfer.sh failed: {e}")
        try:
            import urllib.parse
            with open(file_path, "rb") as f:
                data = f.read()
            boundary = b"---boundary---"
            body = (b"--" + boundary + b"\r\n"
                    b'Content-Disposition: form-data; name="file"; filename="' +
                    filename.encode() + b'"\r\n'
                    b"Content-Type: video/mp4\r\n\r\n" + data +
                    b"\r\n--" + boundary + b"--\r\n")
            req2 = urllib.request.Request("https://file.io/", data=body, method="POST")
            req2.add_header("Content-Type", f"multipart/form-data; boundary={boundary.decode()}")
            with urllib.request.urlopen(req2, timeout=120) as resp:
                result = json.loads(resp.read())
                print(f"[UPLOAD] file.io: {result['link']}")
                return result["link"]
        except Exception as e2:
            print(f"[UPLOAD] Both uploads failed: {e2}")
            return ""


# ─── CLI ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Space Age Music Video Engine")
    parser.add_argument("--audio",   required=True, help="Path to audio file (mp3/wav/flac)")
    parser.add_argument("--bg",      default=None,   help="Optional background video path")
    parser.add_argument("--style",   default="bars",  choices=STYLES, help="Visualizer style")
    parser.add_argument("--theme",   default="orange", choices=list(THEMES.keys()), help="Color theme")
    parser.add_argument("--artist",  default="ARTIST", help="Artist name")
    parser.add_argument("--title",   default="TRACK",  help="Track title")
    parser.add_argument("--output",  default="output.mp4", help="Output video path")
    parser.add_argument("--export",  default="local", choices=["local","canva","capcut"],
                        help="Export mode: local / canva (upload) / capcut (package)")
    args = parser.parse_args()

    output_path = args.output
    if not output_path.endswith(".mp4"):
        output_path += ".mp4"

    render_video(
        audio_path=args.audio,
        bg_path=args.bg,
        style=args.style,
        theme_name=args.theme,
        artist=args.artist,
        title=args.title,
        output_path=output_path,
    )

    if args.export == "canva":
        public_url = upload_to_transfer(output_path)
        if public_url:
            print(f"\n[CANVA HANDOFF]")
            print(f"Paste this into Claude:\n")
            print(f"  Upload this video to Canva and create a 9:16 Instagram story/Reel:")
            print(f"  Video URL: {public_url}")
            print(f"  Artist: {args.artist}")
            print(f"  Track: {args.title}")
            print(f"  Style: Dark, premium, minimal with artist name large at top")
            with open("canva_handoff.txt", "w") as f:
                f.write(f"Upload this video to Canva and create a branded 9:16 music visual:\n")
                f.write(f"Video URL: {public_url}\nArtist: {args.artist}\nTrack: {args.title}\n")
            print(f"\n  (Also saved to canva_handoff.txt)")

    elif args.export == "capcut":
        data = analyze_audio(args.audio)
        pkg_dir = output_path.replace(".mp4", "_capcut")
        export_capcut_package(args.audio, output_path, data, args.artist, args.title, pkg_dir)

    print(f"\nComplete! Output: {output_path}")


if __name__ == "__main__":
    main()
