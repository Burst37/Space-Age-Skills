"""Put the sound under a rendered film: a music track, the film's own action sounds and real ambience, mixed and muxed.

    python tools/music.py --film simulator-out/airport-film.mp4 --score sims/airport-shared/score.py --out simulator-out/airport-final.mp4
        [--ambience apron.wav --ambience jets.wav] [--music track.mp3] [--plan docs/music_plan.json] [--style "..."] [--offset 0]

Where the music comes from, first match wins:
1. --music: a track you already have.
2. ELEVENLABS_API_KEY (environment, or a .env in the folder you run from): ElevenLabs Music writes one from a
   composition plan whose sections follow the film's script (intro up to the first click, the operation, the outro),
   every section told to keep playing with no silence or breaks. The track is checked with silencedetect.
3. Neither: the score renders its own bed in code (BED=1) and there is no separate track.

The action sounds come from --score (any cue sheet with score(mix, tl), rendered by run_sfx.py), brought to -23.4 LUFS
and lifted --fx-db over that. Ambience files (tools/sfx_fetch.py gets CC0 ones) loop under everything at --amb-lufs.
The video stream is copied as it is. The key is never printed.
"""
import argparse
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

from sfx.__main__ import load_cues  # noqa: E402

FF = os.environ.get("FFMPEG", "ffmpeg")
OUT = os.environ.get("SIMULATOR_OUT", "simulator-out")
STYLE = "modern minimal electronic, clean plucks, warm sub bass, steady four-on-the-floor, glassy pads, confident product film, 110 bpm"
NO_GAPS = ["silence", "pauses", "breaks", "stops", "fade out", "slow", "vocals", "sparse"]


def plan_from_timeline(tl, style):
    """Intro up to the first scripted beat, the operation up to the outro, the outro 1.5 s past the end."""
    dur = tl["duration"]
    acts = sorted(tl.get("script", []), key=lambda e: e["t"])
    first = next((e["t"] for e in acts if e["t"] > 0), min(5.0, dur / 4))
    outro = next((e["t"] for e in acts if e.get("act") == "outro"), dur - min(8.0, dur / 6))
    cuts = [0.0, first, outro, dur + 1.5]
    names = [
        ("Intro", ["rising", "drums already playing", "building"]),
        ("Operation", ["full steady groove", "punchy clean drums", "pulsing bass", "light arpeggios", "steady momentum"]),
        ("Outro", ["wide full groove", "soaring lead", "full energy to the last beat"]),
    ]
    secs = [{"section_name": n, "positive_local_styles": pos, "negative_local_styles": ["pause", "silence", "drop out", "fade out"],
             "duration_ms": int(round((b - a) * 1000)), "lines": []} for (n, pos), a, b in zip(names, cuts[:-1], cuts[1:])]
    # ElevenLabs takes no section under 3 s: a short one borrows the time from its neighbour
    for i in range(len(secs)):
        short = 3000 - secs[i]["duration_ms"]
        j = i + 1 if i == 0 else i - 1
        if short > 0 and secs[j]["duration_ms"] - short >= 3000:
            secs[j]["duration_ms"] -= short
            secs[i]["duration_ms"] = 3000
    return {"positive_global_styles": [s.strip() for s in style.split(",") if s.strip()] + ["instrumental"],
            "negative_global_styles": NO_GAPS, "sections": secs}


def api_key():
    if os.environ.get("ELEVENLABS_API_KEY"):
        return os.environ["ELEVENLABS_API_KEY"]
    for env in (os.path.join(os.getcwd(), ".env"), os.path.join(ROOT, ".env")):
        if os.path.exists(env):
            for line in open(env, encoding="utf-8-sig"):
                if line.strip().startswith("ELEVENLABS_API_KEY"):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None


def eleven(plan, out, key):
    import requests

    r = requests.post("https://api.elevenlabs.io/v1/music", headers={"xi-api-key": key, "Content-Type": "application/json"},
                      json={"composition_plan": plan}, timeout=600)
    if r.status_code != 200 or not r.headers.get("content-type", "").startswith("audio"):
        sys.exit(f"music: {r.status_code} {r.text[:400]}")
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    open(out, "wb").write(r.content)


def gaps(path, start, dur):
    err = subprocess.run([FF, "-hide_banner", "-ss", f"{start}", "-t", f"{dur}", "-i", path, "-af", "silencedetect=noise=-35dB:d=0.25",
                          "-f", "null", "-"], capture_output=True, text=True).stderr
    return re.findall(r"silence_start: ([\d.]+)", err)


def lufs(path):
    err = subprocess.run([FF, "-hide_banner", "-i", path, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", err)
    return float(m[-1]) if m else None


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--film", required=True, help="the rendered video (no sound needed)")
    ap.add_argument("--score", required=True, help="the cue sheet with score(mix, tl)")
    ap.add_argument("--out", required=True)
    ap.add_argument("--timeline", help="default: the cue sheet's TIMELINE")
    ap.add_argument("--music", help="an existing track instead of a new one")
    ap.add_argument("--style", default=STYLE, help="comma-separated styles for ElevenLabs")
    ap.add_argument("--plan", help="a composition plan JSON instead of the one built from the timeline")
    ap.add_argument("--offset", type=float, default=0.0, help="start the track this many seconds in")
    ap.add_argument("--ambience", action="append", default=[], help="a recording looped under everything (repeat for more)")
    ap.add_argument("--amb-lufs", type=float, default=-30.0, help="each ambience file's level (default -30)")
    ap.add_argument("--music-lufs", type=float, default=-15.0, help="the music's level in the mix (default -15)")
    ap.add_argument("--fx-db", type=float, default=4.0, help="the action sounds over -23.4 LUFS (default +4 dB)")
    ap.add_argument("--fade", type=float, default=0.6, help="fade-out length in seconds")
    a = ap.parse_args()

    cues = load_cues(a.score)
    timeline = a.timeline or os.path.join(os.path.dirname(os.path.abspath(a.score)), getattr(cues, "TIMELINE", "timeline.json"))
    tl = json.load(open(timeline, encoding="utf-8"))
    dur = tl["duration"]
    stem = os.path.splitext(os.path.basename(a.out))[0]
    os.makedirs(OUT, exist_ok=True)

    music = a.music
    if not music:
        key = api_key()
        if key:
            music = os.path.join(OUT, f"{stem}_music.mp3")
            eleven(json.load(open(a.plan, encoding="utf-8")) if a.plan else plan_from_timeline(tl, a.style), music, key)
            print("music:", music)
        else:
            print("no --music and no ELEVENLABS_API_KEY: the score plays its own bed (BED=1)")
    if music:
        g = gaps(music, a.offset, dur)
        if g:
            print("WARNING: silence in the track at", ", ".join(g), "s from the offset; make a new one before posting")

    fx = os.path.join(OUT, f"{stem}_fx.wav")
    env = dict(os.environ, BED="" if music else "1")
    subprocess.run([sys.executable, os.path.join(ROOT, "run_sfx.py"), a.score, "--timeline", timeline, "--out", fx], check=True, env=env)
    level = lufs(fx)
    fx_gain = (-23.4 - level + a.fx_db) if (music and level is not None) else 0.0

    args, chains, labels = [FF, "-y", "-hide_banner", "-loglevel", "error", "-i", a.film], [], []
    n = 1
    if music:
        args += ["-i", music]
        chains.append(f"[{n}:a]atrim={a.offset}:{a.offset + dur},asetpts=PTS-STARTPTS,aresample=48000,loudnorm=I={a.music_lufs}:TP=-2:LRA=11[m]")
        labels.append("[m]")
        n += 1
    args += ["-i", fx]
    chains.append(f"[{n}:a]aresample=48000,volume={fx_gain:.1f}dB[f]")
    labels.append("[f]")
    n += 1
    for k, amb in enumerate(a.ambience):
        args += ["-stream_loop", "-1", "-i", amb]
        chains.append(f"[{n}:a]atrim=0:{dur},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,loudnorm=I={a.amb_lufs}:TP=-6[a{k}]")
        labels.append(f"[a{k}]")
        n += 1
    fade = max(0.0, dur - a.fade)
    chains.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,alimiter=limit=0.9:level=false,afade=t=out:st={fade:.2f}:d={a.fade}[a]")
    args += ["-filter_complex", ";".join(chains), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-ar", "48000", "-ac", "2",
             "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", f"{dur}", a.out]
    subprocess.run(args, check=True)
    os.remove(fx)
    print("wrote", a.out)


if __name__ == "__main__":
    main()
