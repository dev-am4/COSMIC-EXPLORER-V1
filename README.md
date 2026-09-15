# COSMIC EXPLORER V1

Interactive space exploration game prototype for exhibition / kiosk use.

## Current experience

- Touch-first kiosk UI
- 3 selectable spacecraft: ORBITER, RAPTOR, GUARDIAN
- 4 missions: Earth Orbit, Moon, Mars, Black Hole
- Canvas gameplay with asteroid avoidance, data collection, boost, energy and shields
- Science fact during each mission
- Science checkpoint quiz after the mission
- Local session leaderboard using browser localStorage
- 45-second idle Attract Mode
- Keyboard support: Arrow keys / A-D / Space
- Responsive layout for desktop, touch display and mobile
- No framework and no runtime dependency

## Run locally

Open `index.html` directly in a modern browser, or serve the folder with any static web server.

Example:

```bash
npx serve .
```

## Deploy

The repository is ready for a static Vercel deployment. No build command is required.

## Controls

- Left: `←` or `A`
- Right: `→` or `D`
- Boost: `Space`
- On touch screens, use the three large controls below the game area.

## Recommended next phase

1. Replace procedural ship/planet visuals with optimized exhibition-grade local assets.
2. Add SFX and Thai VO with an audio on/off control.
3. Add mission transition cinematics and impact feedback.
4. Add a real persistent leaderboard if multiple kiosks need shared scores.
5. Add operator settings for idle timeout, difficulty, volume and reset.
6. Test at the final screen resolution and touch hardware before exhibition deployment.
