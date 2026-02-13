export default function Overlay({ title, subtitle, cta }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        padding: 18,
      }}
    >
      <div
        style={{
          width: "min(520px, 92vw)",
          padding: 18,
          borderRadius: 18,
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(6px)",
          color: "white",
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.5 }}>{title}</div>
        <div style={{ marginTop: 8, opacity: 0.85, lineHeight: 1.45 }}>{subtitle}</div>
        <div style={{ marginTop: 14, opacity: 0.8, fontSize: 13 }}>{cta}</div>
      </div>
    </div>
  );
}
