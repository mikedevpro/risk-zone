import { useEffect, useRef } from "react";
import { CANVAS_W, CANVAS_H } from "../game/constants";

export default function GameCanvas({ state }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // background
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // arena background
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // subtle grid
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#ffffff";
    for (let x = 0; x <= CANVAS_W; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_H);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_H; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_W, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // hazards
    ctx.fillStyle = "#ff3b3b";
    for (const h of state.hazards) {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.fill();
    }

    const p = state.player;

    // dash trail
    if (p._dashLeft > 0) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#44d7b6";
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
      ctx.fillStyle = "#44d7b6";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // player
    ctx.fillStyle = "#44d7b6";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    // outline
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + 2, 0, Math.PI * 2);
    ctx.stroke();
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      style={{
        width: "100%",
        maxWidth: CANVAS_W,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        display: "block",
      }}
    />
  );
}
