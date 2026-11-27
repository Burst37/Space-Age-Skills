"""The parts counter over the Japanese house film: a still card top-left while the house is built from the sketch.

It reads timeline.json (every landing with its stage and the counter's rows), draws one RGBA frame per film frame and
lays them over the rendered frames with ffmpeg. The card never moves: only the numbers and the bars change.

    python houses/courtyard/hud.py --frames blueprint-out/courtyard/film --out blueprint-out/courtyard/film_hud.mp4
"""
import argparse
import json
import os
import subprocess

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
FONT = next((f for f in (r"C:\Windows\Fonts\segoeui.ttf", "/System/Library/Fonts/SFNS.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf") if os.path.exists(f)), None)
FONT_B = next((f for f in (r"C:\Windows\Fonts\seguisb.ttf", "/System/Library/Fonts/SFNS.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf") if os.path.exists(f)), FONT)
W, H = 1920, 1080


def smooth(x):
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def rgb(c, a=255):
    return tuple(int(round(255 * max(0.0, min(1.0, v)) ** (1 / 2.2))) for v in c) + (a,)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--frames", required=True, help="the rendered film frames f_0001.png ...")
    ap.add_argument("--out", required=True)
    ap.add_argument("--hud-dir", default=os.path.join(os.environ.get("BLUEPRINT_OUT", "blueprint-out"), "courtyard", "hud"))
    ap.add_argument("--crf", default="16")
    ap.add_argument("--test", help="'seconds,background.png,out.png': draw one frame over an image and stop")
    a = ap.parse_args()
    tl = json.load(open(os.path.join(HERE, "timeline.json")))
    fps, dur = tl["fps"], tl["duration"]
    nf = int(round(dur * fps))
    rows = tl["rows"]
    stage_row = {st: i for i, r in enumerate(rows) for st in r["stages"]}
    lands = [(p["t"], stage_row.get(p["stage"], None)) for p in tl["parts"]]
    lands = [(t, r) for t, r in lands if r is not None]
    totals = [sum(1 for _, r in lands if r == i) for i in range(len(rows))]
    total = sum(totals)
    t_in, t_out = 1.0, tl["T"]["wave"] + 0.2
    os.makedirs(a.hud_dir, exist_ok=True)
    f_title = ImageFont.truetype(FONT_B, 21)
    f_sub = ImageFont.truetype(FONT, 18)
    f_big = ImageFont.truetype(FONT_B, 72)
    f_row = ImageFont.truetype(FONT, 19)
    f_num = ImageFont.truetype(FONT_B, 18)
    X, Y, CW = 56, 52, 452
    CH = 196 + 31 * len(rows) + 18
    blank = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    only = None
    if a.test:
        ts_, bg_, out_ = a.test.split(",")
        only = int(round(float(ts_) * fps)) + 1
    for f in range(1, nf + 1):
        if only and f != only:
            continue
        t = (f - 1) / fps
        alpha = smooth((t - t_in) / 0.5) * (1 - smooth((t - t_out) / 0.8))
        path = os.path.join(a.hud_dir, f"h_{f:04d}.png")
        if alpha <= 0.002:
            blank.save(path)
            continue
        im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        A = lambda v: int(v * alpha)  # noqa: E731
        d.rounded_rectangle((X, Y, X + CW, Y + CH), 20, fill=(14, 16, 20, A(168)))
        d.text((X + 28, Y + 24), "COURTYARD HOUSE", font=f_title, fill=(255, 255, 255, A(235)))
        d.text((X + 28, Y + 54), "14.0 × 14.0 m  ·  from one pen sketch", font=f_sub, fill=(255, 255, 255, A(150)))
        done = [sum(1 for tt, r in lands if r == i and tt <= t) for i in range(len(rows))]
        n = sum(done)
        d.text((X + 26, Y + 84), f"{n:,}", font=f_big, fill=(255, 255, 255, A(255)))
        d.text((X + 30, Y + 166), f"of {total:,} parts placed", font=f_sub, fill=(255, 255, 255, A(150)))
        y = Y + 210
        for i, r in enumerate(rows):
            col = r["color"]
            full = done[i] >= totals[i] and totals[i] > 0
            d.ellipse((X + 30, y + 7, X + 42, y + 19), fill=rgb(col, A(255)))
            d.text((X + 54, y), r["label"], font=f_row, fill=(255, 255, 255, A(230 if done[i] else 120)))
            num = f"{done[i]:,}"
            tw = d.textlength(num, font=f_num)
            d.text((X + 300 - tw, y + 1), num, font=f_num, fill=(255, 255, 255, A(255 if full else 200)))
            bx0, bx1 = X + 318, X + CW - 28
            d.rounded_rectangle((bx0, y + 10, bx1, y + 15), 3, fill=(255, 255, 255, A(26)))
            k = done[i] / totals[i] if totals[i] else 0.0
            if k > 0:
                d.rounded_rectangle((bx0, y + 10, bx0 + max(6, (bx1 - bx0) * k), y + 15), 3, fill=rgb(col, A(255)))
            y += 31
        if only:
            Image.alpha_composite(Image.open(bg_).convert("RGBA"), im).convert("RGB").save(out_)
            print("test frame", out_)
            return
        im.save(path)
    print(f"hud: {nf} frames, {total} parts")
    cmd = [FFMPEG, "-y", "-hide_banner", "-loglevel", "error", "-framerate", str(fps), "-i", os.path.join(a.frames, "f_%04d.png"),
           "-framerate", str(fps), "-i", os.path.join(a.hud_dir, "h_%04d.png"), "-filter_complex", "[0][1]overlay=0:0:format=auto:shortest=1,format=yuv420p",
           "-c:v", "libx264", "-crf", a.crf, "-preset", "slow", "-movflags", "+faststart", a.out]
    subprocess.run(cmd, check=True)
    print("wrote", a.out)


if __name__ == "__main__":
    main()
