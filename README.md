# ChoreQuest 🦄🚀

A magical multiplayer RPG game to help manage household work and chores for rewards, competition and unique prizes.

ChoreQuest is a browser game with a 16-bit, dark-cosmic look — black skies, pink and teal neon, rainbows, unicorns, space elves and space heroes. Each family member is a hero with weekly quests (chores). Completing quests earns points into a personal bank that can be saved up or cashed in for real-world prizes at any time.

## Quick start

```bash
npm install
npm run dev        # dev server
npm run build      # production build into dist/ (plain static site)
npm run preview    # serve the production build locally
```

The game ships with a sample family (Nova, Zane and Luna), six chores and eight prizes so it is instantly playable. Replace them with your own family in the Parent Zone.

> **Default parent PIN: `1234`** — change it in Settings after first launch.

## How it plays

1. **Title screen** → *Press Start* → pick your hero.
2. **Dashboard** shows this week's quests. Tap one when it's done — it waits for parent approval.
3. **Parent Zone** (⚙ on the title screen, PIN-gated): approve or reject completed quests. Approval pays the points.
4. **Prize Shop**: save points or cash them in anytime. Redemptions appear in the Parent Zone as "prizes to deliver" (cancelling refunds the points).
5. **Leaderboard** ranks the family by points earned this week. Crown included.

Weeks roll over automatically (default: Monday, configurable). Assignments are weekly recurring — every new week each hero's quest list resets to "to do" while history and points are kept forever.

## Parent Zone

- **Approvals** — pending quests (grouped by week) and prizes to deliver
- **Players** — name, age, gender, avatar
- **Chores** — name, description, pixel icon, points value
- **Prizes** — name, description, pixel icon, points cost
- **Assignments** — the weekly duty roster per player
- **Settings** — week start day, sound, PIN, backup export/import, reset

## Data & backups

All data lives in the browser's `localStorage` (no accounts, no server, works offline). Use **Settings → Export backup** to download a JSON save; import it on another device to move the family. The save format is versioned with a migration path for future updates.

## Pixel art pipeline

Every sprite is generated from small palette-indexed character grids:

```bash
npm run gen:art
```

renders `scripts/sprites/*.mjs` (32×32 grids drawn with a tiny deterministic kit) into committed 128×128 PNGs under `src/assets/`, plus the logo, favicon and a `contact-sheet.png` preview at the repo root. To add a new chore/prize icon or avatar: add a draw function to the matching sprite module, run `gen:art`, done — the icon pickers find new PNGs automatically by filename.

## Tests

```bash
npm run test   # vitest: week math, game rules (reducer), save migrations
npm run e2e    # Playwright: full flow — claim → approve → redeem → leaderboard → export
```

The e2e run also drops responsive screenshots of every screen (phone/tablet/desktop) into `e2e/screenshots/`.

## Tech

React 19 + Vite + TypeScript, CSS Modules — no router, no state library, no UI kit. State is a single pure reducer behind a storage-adapter seam, so a future cloud-sync backend can plug in without touching the game. Sound effects are synthesized live with the Web Audio API (no audio files). Self-hosted "Press Start 2P" font (OFL).

## Roadmap ideas

- In-game prizes: outfits, hair, items and spaceships for your hero
- Cloud sync so every device shares one family
- Multi-per-week chores (`timesPerWeek` on assignments)
