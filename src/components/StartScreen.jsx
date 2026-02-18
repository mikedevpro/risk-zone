export default function StartScreen() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: "min(680px, 92%)",
          padding: "20px 22px",
          borderRadius: 16,
          background: "rgba(5,10,18,0.68)",
          border: "1px solid rgba(255,255,255,0.14)",
          color: "white",
          boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: -0.7 }}>Risk Zone</div>
        <div style={{ marginTop: 8, opacity: 0.9 }}>
          Survive the swarm, collect coins, and climb the leaderboard.
        </div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gap: 6,
            fontSize: 14,
            opacity: 0.86,
          }}
        >
          <div>Move: WASD / Arrow Keys</div>
          <div>Dash: Shift</div>
          <div>Start: Space / Enter</div>
        </div>

        <div style={{ marginTop: 14, fontWeight: 800, opacity: 0.95 }}>
          Tip: short, calm movement beats panic.
        </div>
      </div>
    </div>
  );
}
