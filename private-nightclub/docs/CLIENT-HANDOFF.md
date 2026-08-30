# Private Nightclub — Owner Dashboard Hand-Off

A plain-English guide to your website's back office. No technical knowledge needed.

---

## 1. What the website does for you

Your site (live at **https://private-nightclub.vercel.app**) is always working in the
background:

- **Collects emails** — every guestlist signup and "join the list" form drops the
  guest's email into your list.
- **Tracks interest** — every time a visitor opens a food or bottle card, taps a
  "Reserve" / "Book a Table" / "Inquire" button, it's quietly counted.
- **Answers questions** — "Tory," the on-site concierge, answers guests by text or
  live voice (hours, dress code, menu prices, booking) so you're not fielding every DM.

The **Owner Dashboard** is where you see all of that in one place.

---

## 2. Logging in

1. Go to **https://private-nightclub.vercel.app/owner**
2. Enter your **passcode** (set separately — see "Your passcode" below).
3. You're in for **12 hours**, then it asks again. Tap **Sign out** anytime to end early.

**Your passcode:** stored as a setting called `OWNER_PASSCODE`. It is *not* written in
this document on purpose. If you don't have it or want it changed, ask your site
manager — it's a 30-second change.

> The dashboard is private: search engines are blocked from it and it's locked behind
> the passcode. Don't share the link + passcode with anyone you don't trust.

---

## 3. What each part of the dashboard means

### Top row — the four big numbers
| Tile | What it means |
|------|----------------|
| **Email signups** | Total people who joined your list through the site. |
| **Menu opens** | How many times guests opened a food/bottle card. A pulse of interest. |
| **Most-viewed item** | The single dish or bottle guests open most. |
| **Busiest category** | Which group (Wings, Pizza, Champagne…) gets the most attention. |

### Menu engagement
A ranked bar chart of which menu items get opened the most. Toggle **Food** vs
**Bottles** with the buttons on the right. Great for deciding specials, what to feature,
or what to push on a slow night.

### CTA clicks
How often each call-to-action button ("Reserve a Table," "Inquire Now," "Join
Guestlist," etc.) was clicked. Tells you what guests actually want to act on.

### Email list  (+ **Export CSV**)
Every signup with its email, where it came from (source), and the date. Hit
**Export CSV** to download the whole list as a spreadsheet you can import into
Mailchimp, a text-blast tool, or hand to whoever runs your promo.

### Refresh / Sign out
**Refresh** pulls the latest numbers (the dashboard doesn't auto-update while you stare
at it). **Sign out** ends your session.

---

## 4. One important thing to understand

> **These are *engagement* numbers, not sales.**
> "Menu opens" means a guest tapped to look at an item on the website — it is a proxy
> for interest, **not** a point-of-sale figure. It does not know what was actually
> bought at the bar. Use it to read demand and guide marketing, not to reconcile the
> register.

---

## 5. Where your leads actually go

- **Guestlist signups & "join the list"** → saved to your database **and** shown in the
  dashboard's Email list. Always retrievable via Export CSV.
- **VIP / table reservation requests** → forwarded to wherever you choose (an email
  inbox, a CRM, a Zapier/Make webhook). If no destination is set up, they're logged on
  the server. *Tell your site manager which inbox or tool you want these to land in and
  it gets wired in once.*

---

## 6. Quick troubleshooting

| You see… | Do this |
|----------|---------|
| "Wrong passcode." | Re-type carefully; it's case-sensitive. Still stuck → ask for a reset. |
| A blank/error screen | Sign out, sign back in. If it persists, the database setting may need attention — flag your site manager. |
| Numbers look frozen | Hit **Refresh**. The dashboard is a snapshot, not a live ticker. |
| All zeros | Normal on a brand-new site or before any traffic. Numbers grow as guests visit. |

---

## 7. Who to call

Content changes (menu, prices, events, photos), passcode resets, and "send my
reservations to X inbox" are all quick jobs for whoever maintains the site. The
companion guide **CONTENT-GUIDE.md** covers exactly how those edits are made.
