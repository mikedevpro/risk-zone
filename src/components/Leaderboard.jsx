export default function Leaderboard({ items = [] }) {
  return (
    <div
      style={{
        marginTop: 14,
        padding: 14,
        borderRadius: 16,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        color: "rgba(255,255,255,0.92)",
      }}
    >
      <div style={{ fontWeight: 900, marginBottom: 10 }}>Leaderboard (Top 10)</div>
      {items.length === 0 ? (
        <div style={{ opacity: 0.75 }}>No runs yet — go set a score.</div>
      ) : (
        <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
          {items.map((r, idx) => (
            <li key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span style={{ opacity: 0.9 }}>
                #{idx + 1} — L{r.level ?? 1}
              </span>
              <span style={{ fontWeight: 900 }}>{r.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
