# RiskZone 🎮

A real-time survival / dodge game built with **React + HTML5 Canvas**.  
Survive as long as you can while hazards spawn faster and move quicker over time.

## Live Demo
- https://YOUR-LIVE-LINK-HERE

## Controls
- **Move:** WASD / Arrow Keys
- **Pause:** P or Esc
- **Mute:** M
- **Restart:** R
- **Start:** Space / Enter

## Features
- Real-time game loop (requestAnimationFrame)
- Dynamic hazard spawning + difficulty scaling
- Collision detection (circle math)
- Score/time survived tracking
- Pause + mute toggles

## Tech Stack
- React + Vite
- HTML5 Canvas
- JavaScript (or TypeScript if you migrate later)

## What I focused on
This project was built to practice **real-time systems thinking** beyond CRUD apps:
- game loop architecture (update → render)
- input handling
- collision math
- difficulty scaling
- performance-friendly patterns

## Local Development
```bash
npm install
npm run dev


---

### 2) PLAY.md (quick guide)

```md
# How to Play RiskZone

**Goal:** Survive as long as possible. Hazards become more intense over time.

## Controls
- Move: WASD / Arrow Keys
- Pause: P or Esc
- Mute: M
- Restart: R
- Start: Space / Enter

## Tips
- Small movements beat big panic moves.
- Watch spawn patterns; don’t get cornered.
- Near-misses are safer than wide dodges (once you get comfortable).

![RiskZone gameplay](docs/riskzone.gif)
