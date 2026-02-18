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
          width: "min(680px, 92%)",
          padding: "20px 22px",
          borderRadius: 16,
          background: "rgba(18,6,10,0.72)",
          border: "1px solid rgba(255,255,255,0.16)",
          color: "white",
          boxShadow: "0 14px 30px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -0.7 }}>Game Over</div>
        <div style={{ marginTop: 8, opacity: 0.9 }}>You lasted until Level {level}.</div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gap: 6,
            fontSize: 15,
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
