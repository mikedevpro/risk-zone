export default function HUD({ state }) {
  const score = state.status === "playing" ? Math.floor(state.score) : state.score;

  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
      <Pill label="Score" value={score} />
      <Pill label="High" value={state.highScore} />
      <Pill label="Spawn" value={`${state.hazardSpawnEvery.toFixed(2)}s`} />
      <Pill label="Speed" value={`${state.hazardSpeedMult.toFixed(2)}x`} />
    </div>
  );
}

function Pill({ label, value }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.92)",
        display: "flex",
        gap: 10,
        alignItems: "center",
        fontFamily: "ui-sans-serif, system-ui",
      }}
    >
      <span style={{ opacity: 0.7, fontSize: 12 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}
