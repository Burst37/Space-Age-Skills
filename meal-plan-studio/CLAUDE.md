# CLAUDE.md
Meal-plan studio. Read README.md first. Token discipline: ponytail (smallest change) + caveman (terse chat); never compress client deliverables.
Quality bar: the Aleena deck (theme-aware) and Swapna's keto deck + 17-page PDF. Client PDFs: 3 days per page.
Rules that bit us: honour every diet statement from the client literally (if she is open to keto AND fasting, the plan needs real keto days and real fasting windows, not hints); carb caps are hard caps in the engine and in client.json `qa`; run `python studio.py qa <client>` before sending anything.
Every client gets a different theme (`themes/themes.json`). Check `python studio.py list` so a new client does not reuse one.
Photos: Higgsfield gpt_image_2_5, 4:3, 2k, batches of about 5 (6+ hits 429); describe only what is in the recipe and add "no ..." exclusions. Photos live in `clients/<name>/photos/KEY.jpg` at 1600 px so the deck rebuilds without regenerating them.
