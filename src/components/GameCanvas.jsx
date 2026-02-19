import { useEffect, useRef } from "react";
import { CANVAS_W, CANVAS_H, WORLD_W, WORLD_H, BOSS_HEALTH, STAR_COUNT, STAR_PARALLAX } from "../game/constants";

const COLORS = {
  skater: "#44d7b6",
  tank: "#8ab4ff",
  spark: "#ffd54a",
  ghost: "#e9a8ff",
};

export default function GameCanvas({ state, fullscreen = false }) {
  const canvasRef = useRef(null);
  const starsRef = useRef(null);
  const camRef = useRef({ x: 0, y: 0 });
  const playerColor = COLORS[state.characterId] || "#44d7b6";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    // Keep a stable backing buffer (prevents blur + size glitches)
    const targetW = Math.round(CANVAS_W * dpr);
    const targetH = Math.round(CANVAS_H * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    // From here on: draw using logical units (CANVAS_W x CANVAS_H)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);


    // generate stars once (stable positions, no flicker)
    if (!starsRef.current) {
      const stars = [];
      for (let i = 0; i < (STAR_COUNT || 140); i++) {
        stars.push({
          x: Math.random() * WORLD_W,
          y: Math.random() * WORLD_H,
          r: 0.6 + Math.random() * 1.4,      // radius
          a: 0.25 + Math.random() * 0.45,    // alpha
        });
      }
      starsRef.current = stars;
    }

    const p = state.player;
    const targetCamX = Math.max(0, Math.min(WORLD_W - CANVAS_W, p.x - CANVAS_W / 2));
    const targetCamY = Math.max(0, Math.min(WORLD_H - CANVAS_H, p.y - CANVAS_H / 2));

    // Smooth camera follow during active play for less jittery tracking.
    if (state.status === "playing") {
      camRef.current.x += (targetCamX - camRef.current.x) * 0.14;
      camRef.current.y += (targetCamY - camRef.current.y) * 0.14;
    } else {
      camRef.current.x = targetCamX;
      camRef.current.y = targetCamY;
    }

    const camX = camRef.current.x;
    const camY = camRef.current.y;
    const camXi = Math.round(camX);
    const camYi = Math.round(camY);
    const shake = state.screenShake ?? 0;
    const sx = shake ? (Math.random() * 2 - 1) * shake : 0;
    const sy = shake ? (Math.random() * 2 - 1) * shake : 0;
    const tw = (state.timeAlive || 0) * 0.9;

    // background in screen space (doesn't cover stars)
    ctx.save();
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();

    // parallax starfield (moves slower than world)
    const par = STAR_PARALLAX ?? 0.35;
    const starOffsetX = Math.round(camXi * (1 - par));
    const starOffsetY = Math.round(camYi * (1 - par));

    ctx.save();
    ctx.translate(starOffsetX, starOffsetY);
    ctx.fillStyle = "#ffffff";

    for (const s of starsRef.current) {
      // cull to visible-ish area for perf
      if (
        s.x < camX - 200 || s.x > camX + CANVAS_W + 200 ||
        s.y < camY - 200 || s.y > camY + CANVAS_H + 200
      ) continue;

      const a = s.a + 0.08 * Math.sin(tw + s.x * 0.01 + s.y * 0.01);
      ctx.globalAlpha = Math.max(0.05, Math.min(0.9, a));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // camera transform: world -> screen
    ctx.save();
    ctx.translate(-camXi + sx, -camYi + sy);

    // subtle grid in world space
    const GRID = 60;
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;

    // draw only the visible slice (performance-friendly)
    const startX = Math.floor(camXi / GRID) * GRID;
    const endX = Math.min(WORLD_W, camXi + CANVAS_W + GRID);
    for (let x = startX; x <= endX; x += GRID) {
      ctx.beginPath();
      ctx.moveTo(x, camYi);
      ctx.lineTo(x, camYi + CANVAS_H);
      ctx.stroke();
   }

   const startY = Math.floor(camYi / GRID) * GRID;
   const endY = Math.min(WORLD_H, camYi + CANVAS_H + GRID);
   for (let y = startY; y <= endY; y += GRID) {
     ctx.beginPath();
     ctx.moveTo(camXi, y);
     ctx.lineTo(camXi + CANVAS_W, y);
     ctx.stroke();
   }
   ctx.globalAlpha = 1;


    // hazards
    for (const h of state.hazards) {
      const isCharger = h.type === "charger";
      const isSpiral = h.type === "spiral";

      if (isCharger && h.phase === "arm") {
        // telegraph color
        ctx.fillStyle = "rgba(255, 80, 80, 0.55)";
      } else if (isCharger) {
        // charging color
        ctx.fillStyle = "#ff2f2f";
      } else if (isSpiral) {
        ctx.fillStyle = "#ff6bd6"; // pink-ish danger (or keep red but add ring)
      } else {
        ctx.fillStyle = "#ff4d4d";
      }

      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.fill();

      // optional: ring indicator for chargers
      if (isCharger) {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      if (isSpiral) {
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // boss
    if (state.bossActive && state.boss) {
      const b = state.boss;

      ctx.fillStyle = "#ff4d4d";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();

      // health bar
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(b.x - b.r, b.y - b.r - 14, b.r * 2, 6);

      ctx.fillStyle = "#44ff88";
      const hpRatio = b.hp / BOSS_HEALTH;
      ctx.fillRect(b.x - b.r, b.y - b.r - 14, b.r * 2 * hpRatio, 6);
    }

    // dash trail
    if (p._dashLeft > 0) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = playerColor;
      ctx.beginPath();
      ctx.arc(
        p.x - p._dashDir.x * 14,
        p.y - p._dashDir.y * 14,
        p.r + 4,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // coins
    ctx.fillStyle = "#ffd54a";
    for (const c of state.coins) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();

      // little shine
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(c.x - c.r * 0.25, c.y - c.r * 0.25, c.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffd54a";
    }

    // popups
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "700 16px ui-sans-serif, system-ui";
    for (const pz of state.popups) {
      const alpha = Math.max(0, Math.min(1, pz.life / 0.75));
      ctx.globalAlpha = alpha;

      // subtle shadow
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillText(pz.text, pz.x + 1, pz.y + 1);

      // main text
      ctx.fillStyle = "#ffffff";
      ctx.fillText(pz.text, pz.x, pz.y);
    }
    ctx.globalAlpha = 1;

    // streak glow (intensifies with streak)
    const streak = state.coinStreak || 0;
    if (streak > 0) {
      const glow = Math.min(20, 6 + streak * 3); // cap glow
      ctx.save();
      ctx.globalAlpha = 0.18 + Math.min(0.35, streak * 0.06);
      ctx.fillStyle = playerColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (state.overdrive > 0) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#00ffff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const inv = (state._iframes ?? 0) > 0;
    if (inv && Math.floor((state.timeAlive || 0) * 18) % 2 === 0) {
      // skip drawing player every other frame (blink)
    } else {
      // draw player as normal
      ctx.fillStyle = playerColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "16px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const badge = { skater: "🛼", tank: "🛡️", spark: "⚡", ghost: "👻" }[state.characterId];
      if (badge) ctx.fillText(badge, p.x, p.y - 22);

      // outline
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    // hit flash overlay
    const flash = state.hitFlash || 0;
    if (flash > 0) {
      ctx.globalAlpha = Math.min(0.55, flash * 0.55);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.globalAlpha = 1;
    }
  }, [state, playerColor]);

    
  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        width: fullscreen ? "min(100vw, calc(100vh * 1.6667))" : "min(100%, 900px)",
        maxWidth: fullscreen ? "100vw" : CANVAS_W,
        height: "auto",
        maxHeight: fullscreen ? "100vh" : "70vh",
        aspectRatio: `${CANVAS_W} / ${CANVAS_H}`,
        borderRadius: fullscreen ? 0 : 16,
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        display: "block",
        margin: "0 auto",
        touchAction: "none",
      }}
    />
  );
}
