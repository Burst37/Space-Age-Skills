# How a plan is structured

## Day types and week pattern
- HIGH / training day: carbs fuel the session, hard cap per client. Meals at the client's normal times.
- LOW / low-carb day: about 40 to 50 g carbs, small fruit at most.
- KETO day: net carbs 20 g or less, fat-forward dishes, usually on the fasting window (for example 12:00, 3:30, 7:30 PM for 16:8).
- REFEED (only when the condition calls for it, e.g. thyroid): about 55 g net, once a week.
Map the client's training days to HIGH. Split the other days between LOW and KETO by how often she wants keto (for example 2 keto, 2 low-carb). Keep keto days apart or after higher-carb days. Fasting is optional on LOW days and built in on KETO days if she accepts it.

## Meals
3 meals a day by default (times from her schedule), 30 days, start on a Monday, 90 meals, about 24 rotating dishes. Meal 2 is usually the biggest plate.

## Rules the engine follows
- A dish does not repeat within 3 days (relax to 2, then 1 only if the pool is small). Do not repeat the exact same day twice.
- Lunch and dinner use different main proteins. Fish at least 2 to 3 times a week if allowed. Eggs capped per day.
- Every day meets the calorie target, the protein floor and the carb cap. Fat top-ups come last; protein powder only if a day is short.
- Hard exclusions apply to every ingredient, recipe, swap and supplement.

## Pages and slides
- Plan PDF: 3 days per page, 2 shopping weeks per page (17 pages for 30 days). Never one page per day.
- Deck, in order: intro, title, snapshot, targets, food rules, protein sources, supplements, keto and fasting options, daily rhythm, carb cycling, month calendar, then per week: calendar, shopping list, 7 day slides; swap guide (rules and one slide per food group), monitoring, notes for dietitian review.
- Every day slide: macro ring, Nutrition Facts panel, three meal cards with photo, macros, ingredients, a one-line note for the day type.
- Swap guide: like for like, same column only, macros per portion.

## Photos
One 4:3 overhead photo per dish (white plate, light oak table, soft daylight), 2K, plus a 16:9 hero. Describe only what is in the dish, add "no ..." exclusions, check every photo against its recipe.

## Quality checks before sending
Caps and floors for every day, forbidden-food scan of meal names and ingredient lines, a photo for every meal, page count, file size, and a look at one day page and one shopping page for clipped text.

## Interactive web experience (the premium deliverable)
Built from the same plan data as the deck, in the client's theme, by `python studio.py web <client>`: shader background that shifts tone by section, scroll-driven motion, two short motion-graphic films (welcome, how your week works), animated macro ring, week bars that light up by day type, a fasting clock (training, low-carb, keto, with a 16:8 toggle), a liquid-glass dish carousel, a 30-day browser with a day sheet, tickable shopping lists, a like-for-like swap finder and a weight tracker with a plan line. Delivered as a hosted installable app (works offline after the first visit) and as one offline HTML file for email. It runs on current Chrome, Edge, Safari and Firefox on phones, tablets and desktops; videos are muted H.264 720p so iOS plays them inline.
