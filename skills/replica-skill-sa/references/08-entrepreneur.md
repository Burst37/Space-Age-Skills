# 08 Entrepreneur: what users hate -> fixes + angle
A straight copy has no reason to exist. Find it in real reviews. Writes `replica/reviews.csv`, `replica/feedback.md`, `replica/fixes.md`, new `features.csv` rows.

## Rules (non-negotiable)
- **Never fabricate**: no invented reviews, quotes, ratings, counts, users, sources. Source unreachable -> say so, move on. 14 reviews -> say 14.
- **Verbatim + linked**: every quote copied exactly with its URL. `reviews.py` drops rows without a link.
- **Read, don't scrape**: read review pages like a person, copy rows by hand. No scraping libraries against sites whose terms forbid it. Official feeds/APIs within terms OK: Apple reviews RSS `https://itunes.apple.com/us/rss/customerreviews/id=<APP_ID>/sortBy=mostRecent/json`, HN Algolia `hn.algolia.com/api/v1/search?query=...`, Reddit official API.
- **No fake reviews**, for or against anyone (illegal in US under FTC 2024 rule, and elsewhere).
- **Reviewers are research, not testimonials.** Never on the landing page.

## 1. Collect (100+ across 3+ sources, recent first)
App Store (or RSS), Google Play (sort newest), G2/Capterra/Trustpilot (filter 1-3 stars too), Reddit + HN ("X alternative", "switched from X", "X sucks", "X vs"), the original's public feature board (with votes), its changelog (don't "fix" what's shipped). Row: `source,url,date,rating,text`. Read 3-4 star too: "love it, but..." hides the best fixes.

## 2. Rank
```bash
python3 $S/scripts/reviews.py replica/reviews.csv --out replica/feedback.md --today YYYY-MM-DD
```
Themes from `scripts/themes.json` (edit for the category; pass `--themes my.json`). Low ratings + recent weigh more; <3 reviews or 1 source = thin. Lists requests in users' words and low ratings matching no theme: read those by hand, often the best part. `--today` must be YYYY-MM-DD (bad value = exit 2).

## 3. Three lists (`fixes.md`)
Each item: problem in one line, review count, source count, 1-2 linked quotes.
1. **Hate**: complaints about what it does. 2. **Missing**: features asked for by name. 3. **Unsolved**: whole jobs/groups ignored ("not built for teams") -> positioning. Thin = labelled thin; 3 angry Reddit posts are not a trend.

## 4. Fix plan
Top 5-8 by evidence x cheapness: what to build, size S/M/L, which stage, evidence. Add each to `features.csv` with `original=no`. Pricing/billing complaints -> stage 10.

## 5. Angle (3 options, recommend 1)
```
For {{who}} who {{hate this about the original}}, {{your app}} {{does this instead}}.
Evidence: {{theme}}, {{n}} reviews across {{n}} sources.
```
Drives stage 9 name/voice and stage 10 hero. Original's name never in your name/ads/listing. Comparison pages = lawyer question.

Output states sample size. Next: `09-brand`.
