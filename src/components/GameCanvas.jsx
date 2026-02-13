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

    // dash trail
if (state.player._dashLeft > 0) {
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#44d7b6";
  ctx.beginPath();
  ctx.arc(
    state.player.x - state.player._dashDir.x * 14,
    state.player.y - state.player._dashDir.y * 14,
    state.player.r + 4,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.globalAlpha = 1;
}


    // player
    const p = state.player;
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
