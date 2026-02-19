# 🎮 Risk Zone

Risk Zone is a full-stack, real-time arcade survival game built with React (Canvas API) and FastAPI.

Players dodge dynamically spawning hazards inside a camera-follow arena, survive escalating levels, defeat boss waves, collect streak-based bonuses, and compete on a persistent global leaderboard.

## 🔗 Live Demo: https://risk-zone.vercel.app

## 🌐 Backend API: https://riskzone-api.onrender.com

## ✨ Features

- 🎯 Real-time collision detection

- 🌌 Camera-follow world rendering

- ✨ Parallax starfield

- 🧠 Dynamic difficulty ramp

- 👑 Boss waves every 5 levels

- 💥 Multiple hazard types (Normal, Charger, Spiral)

- ❤️ Extra lives + invincibility frames

- ⚡ Overdrive mode (streak-based power state)

- 📱 Mobile + desktop controls

- 🏆 Persistent global leaderboard (FastAPI + SQLite)

- 🚀 Deployed on Vercel + Render

# 🧠 Architecture

## Frontend:

React

Canvas API

Custom game engine loop

State-driven animation system

## Backend:

- FastAPI

- SQLAlchemy

- SQLite (persistent storage)

- RESTful leaderboard endpoints

## Deployment:

- Vercel (frontend)

- Render (backend)

## ⚙️ Technical Highlights

- World-space rendering with camera translation

- DevicePixelRatio scaling for crisp visuals

- Server-side score validation

- CORS-secured cross-origin API

- Modular hazard behavior system

- Stateful difficulty engine

- Deterministic spawn patterns

## 🏗 System Flow

React Game Engine
→ POST score → FastAPI
→ SQLite database
→ GET leaderboard
→ Display global rankings

## 📈 What I Focused On

- Clean separation of rendering and simulation logic

- Incremental feature layering without breaking core loop

- Responsive cross-device gameplay

- Production deployment pipeline

## 🔮 Future Enhancements

- Persistent user accounts

- WebSocket live leaderboard

- Audio engine

- Additional boss mechanics

- Replay system

## 🎥 Demo

(Coming Soon!)

## 🏁 Version

v1.0 — Full-Stack Release
