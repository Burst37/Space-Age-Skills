"""Put the transparent dollhouse render (with its caught shadow) on a warm paper backdrop.
Run: python houses/apartment/composite.py in.png out.png"""
import sys

import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
w, h = im.size
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
r = np.sqrt(((xx - w * 0.5) / w) ** 2 + ((yy - h * 0.45) / h) ** 2)
top = np.array([0.955, 0.948, 0.932])
edge = np.array([0.885, 0.875, 0.855])
k = np.clip(r / 0.75, 0, 1)[..., None] ** 1.6
bg = (top * (1 - k) + edge * k) * 255
bg = Image.fromarray(bg.astype(np.uint8), "RGB").convert("RGBA")
Image.alpha_composite(bg, im).convert("RGB").save(out, quality=95)
