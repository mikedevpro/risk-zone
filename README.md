# Risk Zone

Risk Zone is a fast arcade survival game built with React and the HTML5 Canvas API.
You control a single player orb, avoid incoming hazards, and survive as long as possible while the game ramps difficulty over time.

## Gameplay 🎮

- Hazards spawn from outside the arena and move inward toward the player.
- Survival time increases score (`+1` point per second alive).
- Difficulty ramps automatically over time.
- Hazard movement speed increases over time.
- Hazard spawn interval decreases over time.
- High score is persisted in browser `localStorage`.

## Controls 🕹️

- Move: `W A S D` or Arrow Keys
- Dash: `Shift` (short burst in current movement direction, with cooldown)
- Start / Restart: `Space` or `Enter`

## Tech Stack ⚙️

- React 19
- Vite 7
- Canvas 2D rendering
- ESLint 9

## Run Locally 🚀

Requirements:
- Node.js 18+ (recommended: latest LTS)
- npm

Install and run:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Project Structure 🧱

```text
src/
  components/
    GameCanvas.jsx      # Canvas renderer (arena, hazards, player, effects)
    HUD.jsx             # Score and difficulty readout
    Overlay.jsx         # Ready/Game over overlays
  game/
    constants.js        # Tunable gameplay constants
    engine.js           # Core simulation (movement, spawn, collision, scoring)
    useGameEngine.js    # Input + requestAnimationFrame loop hook
  App.jsx               # Main game composition
```

## Notes 🧠

- Arena size is fixed at `900 x 540` world units and scales responsively in the UI.
- Game loop uses `requestAnimationFrame` with a capped delta time for stable updates.
- Difficulty tuning values live in `src/game/constants.js`.
