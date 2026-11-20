# Space Age Fitness — client tracker

Single-file web app (`index.html`) for running a personal-training business:
clients, workouts, attendance, calendar and body-composition assessments.

Live version: https://claude.ai/artifact/4YuWxGtENeY7YDBYk2Nu6M

## What it does

- **Clients** — swipeable client row; profile with gender, date of birth, height, weight, activity level, goal, plan and notes.
- **Calendar** — week time-grid (one day at a time on phones) and month view; tap an empty slot to sign a client in.
- **Workouts** — quick add (type or dictate a line such as
  `Romanian deadlift, dumbbells, 25 lb, 15 reps, tempo 2 down 3 up, 4 sets`),
  a workout-planner grid (Exercise · Equipment · Tempo · Set 1–8 weight/reps; `0` = bodyweight)
  and a weekly exercise chart.
- **Assessments** — weight and body fat first; optional tape measurements (inches)
  and calipers with a choice of 7-site Jackson-Pollock or 9-site Parrillo, which calculate body fat.
  Body-composition sheet with a labelled male/female figure.
- **Metabolism & heart rate** — BMR (Mifflin-St Jeor, Katch-McArdle when body fat is known),
  daily calories (BMR × activity), max HR (220 − age) and fat-burning zone (60–70% of max HR).
- **Talk** — dictate an update with the phone keyboard's mic; Claude turns it into sessions and check-ins.

## How it runs

The page is a claude.ai Artifact. Client records live in the artifact's database
(`db` capability, owner-only read/write rules), not in this file, so no client data is in the repo.
Talk and the quick-add fallback use the `sample` capability. Opened outside claude.ai, the page
shows a notice that records are only available there.

Capabilities declared on publish:

```json
{ "db": { "rules": [{ "path": "", "read": "owner", "write": "owner" }] }, "user": {}, "sample": {} }
```

Collections: `clients`, `sessions`, `measurements`.
