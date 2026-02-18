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
      {/* Left move zone */}
      <div
        ref={stickRef}
        style={{
          position: "absolute",
          left: 0,
          bottom: "max(0px, env(safe-area-inset-bottom))",
          width: "50vw",
          height: "58%",
          pointerEvents: "auto",
          touchAction: "none",
          background: "transparent",
        }}
      />

      {/* Right dash zone */}
      <div
        onPointerDown={(e) => {
          e.preventDefault();
          setInput({ dash: true });
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          setInput({ dash: false });
        }}
        onPointerCancel={() => setInput({ dash: false })}
        style={{
          position: "absolute",
          right: 0,
          bottom: "max(0px, env(safe-area-inset-bottom))",
          width: "50vw",
          height: "58%",
          pointerEvents: "auto",
          touchAction: "none",
          background: "transparent",
        }}
      />
    </div>
  );
}
