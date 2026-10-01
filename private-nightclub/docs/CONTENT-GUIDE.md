# Private Nightclub — Content Update Manual

How to change the gallery photos, events, menu items, prices, and venue info — then push
the changes live. Written for whoever maintains the site (you or a developer).

---

## The golden rule

**Almost all wording, prices, events, hours, and contact info live in ONE file:**

```
private-nightclub/src/lib/site.ts
```

Edit the value there, save, redeploy (Section 7), and the whole site updates. You rarely
need to touch anything else.

Images live under `private-nightclub/public/` and are swapped by replacing files.

---

## 1. Images: the one rule that matters

Every photo on the site is a **`.webp`** file (small + fast). Phone photos are `.jpg`/
`.png`, so they must be **converted to `.webp` first**.

**Convert any image to webp** (pick one):
- Easiest: drag it into **https://squoosh.app** → choose **WebP** on the right →
  set quality ~80 → **Download**.
- Or any "JPG to WebP" online converter.

**Aim for:**
- Gallery photos: **landscape, 3:2 ratio** (e.g. 1500×1000), under ~300 KB.
- Menu item photos: **portrait/square**, under ~250 KB.

Then rename the converted file to the exact name shown below and drop it in the right
folder, replacing the old one.

---

## 2. Gallery ("The room" spinning photo sphere)

**Folder:** `private-nightclub/public/gallery/`
**Files:** `g-01.webp` through `g-10.webp` (10 photos).

### Swap a photo
Convert your new photo to webp, name it the slot you want (e.g. `g-04.webp`), and drop it
in the folder, overwriting the old one. Done.

### Add MORE than 10 photos (or fewer)
1. Add the files: `g-11.webp`, `g-12.webp`, …
2. Open `private-nightclub/src/components/SphereGallery.tsx` and find this line near the top:
   ```js
   const IMAGES = Array.from({ length: 10 }, (_, i) => `/gallery/g-${String(i + 1).padStart(2, "0")}.webp`);
   ```
   Change `length: 10` to your new total (e.g. `length: 14`).

Tip: keep them named in an unbroken sequence (`g-01`…`g-14`) with no gaps.

---

## 3. Events ("What's on" calendar)

**File:** `private-nightclub/src/lib/site.ts` → the `events` array.

Each event is one block. Copy an existing block and edit it:
```js
{
  date: "JUL 25",            // short date shown on the card
  weekday: "Friday",
  name: "Gold Room Fridays", // event title
  host: "DJ Marcel Vaughn",  // who's on
  blurb: "One or two sentences describing the night.",
  tag: "Resident",           // must be exactly: "Resident" | "Special" | "Holiday"
},
```
- **Add** an event: paste a new block between the `[` and `]`, separated by commas.
- **Remove** one: delete its whole `{ … },` block.
- **Reorder**: cut/paste blocks — they show in list order.

⚠️ `tag` must be one of those three exact words (controls the colored label).

---

## 4. Menu items & prices

The menu appears two ways, both in `site.ts`:

**A) The tappable photo cards** (what guests browse) — `foodSelectItems` and
`drinkSelectItems` arrays. Each looks like:
```js
{ name: "Cheeseburger", category: "From the Grill", price: "12",
  note: "Char-grilled, American cheese.", img: "/menu/food/food-16.webp" },
```
| Field | What to change |
|-------|----------------|
| `name` | Item name. |
| `category` | Group heading (e.g. "Wings", "Pizza", "Tequila"). Keep spelling consistent to keep items grouped. |
| `price` | A **text** string. Can be `"12"`, `"12 / 14"` (two sizes), or `"8 / 16 / 24"`. Just type it as it should read. **No dollar sign needed.** |
| `note` | Small description under the name (optional). |
| `img` | Path to the photo (see below). |

**B) The printed-style price lists** — `foodMenu` and `bottleMenu` arrays (simple
`{ name, price }` rows grouped by `title`). Update these too so the text list matches the
cards.

> Changing a price = edit the `price` text in both places for that item. That's it.

### Menu item photos
- Food photos: `private-nightclub/public/menu/food/` named `food-01.webp`…
- Drink photos: `private-nightclub/public/menu/drinks/` named `drink-01.webp`…

To change an item's photo: convert your image to webp, name it the file the item points
to in its `img:` line, and drop it in that folder. (Or add a new `food-23.webp` and point
a new item's `img` at it.)

### Add a brand-new menu item
1. Add its photo to the right folder (e.g. `food-23.webp`).
2. In `site.ts`, copy an existing line in `foodSelectItems` (or `drinkSelectItems`),
   paste it in the spot you want it to appear, and edit `name`, `category`, `price`,
   `note`, and `img: "/menu/food/food-23.webp"`.
3. Optionally add a matching row to `foodMenu`/`bottleMenu`.

---

## 5. Venue info — address, phone, email, hours, social

**File:** `private-nightclub/src/lib/site.ts` → the `venue` object at the top.
```js
address: {
  line1: "1142 Washington Ave",
  line2: "St. Louis, MO 63101",
  mapsQuery: "1142 Washington Ave, St. Louis, MO 63101", // ← the Google Map points HERE
},
hours: [ { day: "Thursday", time: "10:00 PM - 3:00 AM" }, … ],
social: [ { label: "@privatenightclubstl", slug: "instagram", href: "https://instagram.com/…" } ],
```
- **The map** on the Contact section is driven by **`mapsQuery`**. To move the map pin,
  set `mapsQuery` to the venue's exact street address (the same thing you'd type into
  Google Maps to land on the front door). Keep `line1`/`line2` matching for the printed
  address.
- **Phone/email** can also be set without code via the `NEXT_PUBLIC_VENUE_PHONE` and
  `NEXT_PUBLIC_VENUE_EMAIL` settings in Vercel; otherwise edit the defaults in `site.ts`.

---

## 6. The concierge ("Tory")

Tory answers from the venue + full menu data above, so **most updates happen
automatically** when you edit `site.ts` (prices, hours, address). The persona and the
deeper knowledge live in `private-nightclub/src/lib/concierge-knowledge.ts` if you ever
want to adjust how Tory talks.

---

## 7. Publishing your changes (go live)

This site is deployed with the **Vercel CLI** — it does **not** auto-publish from GitHub.
After editing files, from inside the `private-nightclub` folder:

```bash
npm run build          # 1. make sure it builds with no errors
npx vercel deploy --prod --yes   # 2. push it live
```

Then hard-refresh **https://private-nightclub.vercel.app** (on phone: pull to refresh, or
clear the tab) to see it.

> First time only: `npx vercel login` to connect the account, and run commands from the
> `private-nightclub` directory.

**Save your work in git too** (so nothing is lost):
```bash
git add -A && git commit -m "Update menu prices and July events"
git push
```

---

## 8. Cheat sheet

| I want to change… | File / folder |
|-------------------|----------------|
| A gallery photo | `public/gallery/g-0X.webp` (replace file) |
| Number of gallery photos | `src/components/SphereGallery.tsx` (`length: 10`) |
| Events list | `src/lib/site.ts` → `events` |
| A menu price | `src/lib/site.ts` → `foodSelectItems`/`drinkSelectItems` (+ `foodMenu`/`bottleMenu`) |
| A menu photo | `public/menu/food/food-XX.webp` or `public/menu/drinks/drink-XX.webp` |
| Address / map pin | `src/lib/site.ts` → `venue.address` (`mapsQuery`) |
| Hours | `src/lib/site.ts` → `venue.hours` |
| Instagram link | `src/lib/site.ts` → `venue.social` |
| Owner dashboard passcode | Vercel setting `OWNER_PASSCODE` |
| Publish changes | `npm run build` → `npx vercel deploy --prod --yes` |

Every photo must be **`.webp`**. Every change goes live only after a **deploy**.
