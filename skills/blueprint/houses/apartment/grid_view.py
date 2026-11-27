"""The plan with a metre grid over it, to read openings and furniture off in metres (x right, y down, origin at
the 2x image's corner). Run: python houses/apartment/grid_view.py x0 y0 x1 y1 out.png [scale]   (all in metres)"""
import sys

import cv2

SRC = os.environ.get("BLUEPRINT_PLAN", os.path.join(os.path.dirname(os.path.abspath(__file__)), "plan.png"))
PX = 86.0
x0, y0, x1, y1 = map(float, sys.argv[1:5])
out = sys.argv[5]
k = float(sys.argv[6]) if len(sys.argv) > 6 else 1.0
im = cv2.imread(SRC)[int(y0 * PX):int(y1 * PX), int(x0 * PX):int(x1 * PX)]
im = cv2.resize(im, None, fx=k, fy=k, interpolation=cv2.INTER_AREA if k < 1 else cv2.INTER_CUBIC)
step = 0.1
v = x0 - (x0 % step) + step
while v < x1:
    X = int((v - x0) * PX * k)
    major = abs(round(v * 2) - v * 2) < 1e-6
    c = (0, 0, 255) if abs(round(v) - v) < 1e-6 else ((80, 80, 255) if major else (200, 200, 255))
    cv2.line(im, (X, 0), (X, im.shape[0]), c, 1)
    if major:
        cv2.putText(im, f"{v:.1f}", (X + 2, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (0, 0, 200), 1)
    v += step
v = y0 - (y0 % step) + step
while v < y1:
    Y = int((v - y0) * PX * k)
    major = abs(round(v * 2) - v * 2) < 1e-6
    c = (255, 0, 0) if abs(round(v) - v) < 1e-6 else ((255, 120, 80) if major else (255, 210, 200))
    cv2.line(im, (0, Y), (im.shape[1], Y), c, 1)
    if major:
        cv2.putText(im, f"{v:.1f}", (2, Y - 2), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (200, 0, 0), 1)
    v += step
cv2.imwrite(out, im)
