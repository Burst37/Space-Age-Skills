# Intro motion graphic (optional)

`intro.html` is a 9.5 second frame-driven animation (title and macro ring, five meal cards, 30-day calendar coloured by carb tier). `render.js` captures it frame by frame with Playwright.

1. Copy this folder to a work folder. Put the recipe photos and HERO.jpg in `../imgj/` (relative to the folder).
2. Edit the text in `intro.html` (client name, chips, the legend line, date range, macro numbers, donut `pcts`, kcal count-up) to match the plan.
3. Replace the `%%DATA%%` placeholder with JSON: `{"cards":[{key,name,kcal,p,c,f} x5], "tiers":[30 tier names]}` and save as `intro_data.html` (render.js loads that file). Pick cards whose meals have no add-ons so the macros match the dish.
4. `node render.js` writes `frames/`, then: `ffmpeg -framerate 30 -i frames/f%04d.jpg -vf scale=1920:1080 -c:v libx264 -crf 22 -pix_fmt yuv420p -movflags +faststart intro_1080p.mp4`.
   `node render.js 3.4` writes a still at 3.4 s, which makes a good poster image.
Keep the MP4 near 3 MB so it embeds comfortably in the page.
