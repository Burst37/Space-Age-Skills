# 10 Launch: landing page, pricing, store listing
Reads `fixes.md`, `brand.md`, `brand.json`. Writes `replica/launch/`: `landing.md`, `pricing.md`, `listing.json` (start from `templates/listing.example.json`), `launch-plan.md`.

## Rules
- **No fake proof**: no invented testimonials, user counts, ratings, press logos, "trusted by". Empty proof section beats a fake one. Real beta users with permission OK.
- Reviewer quotes are research, never testimonials.
- Original's name out of app name, listing, keywords, ads (store rejection + takedown risk).

## 1. Landing page (`landing.md`, then build it)
1. Hero: angle as headline (what, for whom), one sub-line, one button, real product screenshot.
2. Problem: top 2 "hate" themes, paraphrased.
3. How it works: 3 steps from the core flow.
4. Features: each tied to a fix; lead with fixes, parity is entry price.
5. Pricing table (step 2). 6. FAQ: real objections (importer?). 7. Final CTA.
Brand voice. Run `contrast.py` on page colours.

## 2. Pricing (`pricing.md`)
Original's public pricing + 2-3 alternatives in one table, each with URL + date read. Reviewer price/billing complaints with counts. Model: free plan or trial; per seat or flat; monthly + annual (~2 months free). Max 3 tiers, named for who they serve. Fix billing complaints in product: one-click cancel, clear renewal email, no surprise seat jumps. List Stripe products/prices for the user to create.

## 3. Store listing
```bash
python3 $S/scripts/listing.py replica/launch/listing.json --config replica/brand.json
```
Checks App Store (name 30, subtitle 30, promo 170, keywords 100, description 4000) and Play (title 30, short 80, full 4000), human char counts, ranking/price claims + emoji + all-caps in short fields, wasted keyword chars, and every `avoid` name (listing's own + `--avoid` + `--config`, merged). Exit 1 on error.
Apple Guideline 4.1 (Copycats) rejects near-copies: make fixes + own brand visible in screenshots and first description lines. Also prep: screenshots at current required sizes (check consoles at upload), privacy labels / data safety form, privacy + support URLs, age rating, review notes with demo account.

## 4. Launch plan (`launch-plan.md`)
Waitlist/beta before launch; analytics + error tracking live; where unhappy users of the original talk (threads from stage 8); Product Hunt / HN post leading with the fix; first 10 users talked to by hand.

Done: `launch/` complete, page built, `listing.py` exit 0. Next: `11-deploy`.
