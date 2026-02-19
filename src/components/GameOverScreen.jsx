export default function GameOverScreen({ score = 0, highScore = 0, lives = 0, level = 1 }) {
  const isNewHigh = score >= highScore;

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
          width: "min(680px, 94%)",
          padding: "clamp(14px, 3vw, 20px) clamp(14px, 3.2vw, 22px)",
          maxHeight: "85%",
          overflowY: "auto",
          borderRadius: 16,
          background: "rgba(18,6,10,0.72)",
          border: "1px solid rgba(255,255,255,0.16)",
          color: "white",
          boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "clamp(24px, 5vw, 34px)", fontWeight: 900, letterSpacing: -0.7 }}>Game Over</div>
        <div style={{ marginTop: 8, opacity: 0.9 }}>You lasted until Level {level}.</div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gap: 6,
            fontSize: "clamp(12px, 2.5vw, 15px)",
          }}
        >
          <div>
            Final Score: <b>{score}</b>
          </div>
          <div>
            High Score: <b>{highScore}</b>
          </div>
          <div>
            Lives Left: <b>{lives}</b>
          </div>
        </div>

        <div style={{ marginTop: 14, fontWeight: 800, opacity: 0.95 }}>
          {isNewHigh ? "New High Score. Nice run." : "Press Space / Enter to try again."}
        </div>
      </div>
    </div>
  );
}
