Drop the concierge avatar here as:

  tory.webp   (square, ~256x256 or larger, face centered)

The concierge widget loads /brand/tory.webp automatically. Until the file is
present it falls back to the "P" monogram, so the site never shows a broken
image. A .jpg/.png also works if you update the path in
src/components/Concierge.tsx (ToryAvatar).
