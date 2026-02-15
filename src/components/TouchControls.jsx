import { useEffect, useRef, useState } from "react";

export default function TouchControls({ setInput }) {
  const stickRef = useRef(null);
  const [active, setActive] = useState(false);
  const origin = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = stickRef.current;
    if (!el) return;

    const max = 42;     // max thumb distance
    const dead = 10;    // deadzone

    function setFromVec(dx, dy) {
      const mag = Math.hypot(dx, dy);
      const nx = mag ? dx / mag : 0;
      const ny = mag ? dy / mag : 0;

      // map to booleans
      setInput({
        left: dx < -dead,
        right: dx > dead,
        up: dy < -dead,
        down: dy > dead,
      });
    }

    function onPointerDown(e) {
      setActive(true);
      el.setPointerCapture(e.pointerId);
      origin.current = { x: e.clientX, y: e.clientY };
      setFromVec(0, 0);
    }

    function onPointerMove(e) {
      if (!active) return;
      const dx = e.clientX - origin.current.x;
      const dy = e.clientY - origin.current.y;

      const clampedDx = Math.max(-max, Math.min(max, dx));
      const clampedDy = Math.max(-max, Math.min(max, dy));
      setFromVec(clampedDx, clampedDy);
    }

    function onPointerUp(e) {
      setActive(false);
      setInput({ left: false, right: false, up: false, down: false });
    }

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [active, setInput]);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Left joystick zone */}
      <div
        ref={stickRef}
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          width: 140,
          height: 140,
          borderRadius: 24,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          pointerEvents: "auto",
          touchAction: "none",
        }}
      />

      {/* Dash button */}
      <button
        onTouchStart={() => setInput({ dash: true })}
        onTouchEnd={() => setInput({ dash: false })}
        onMouseDown={() => setInput({ dash: true })}
        onMouseUp={() => setInput({ dash: false })}
        style={{
          position: "absolute",
          right: 12,
          bottom: 22,
          width: 92,
          height: 92,
          borderRadius: 999,
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.16)",
          color: "white",
          fontWeight: 900,
          letterSpacing: 0.5,
          pointerEvents: "auto",
        }}
      >
        DASH
      </button>
    </div>
  );
}
