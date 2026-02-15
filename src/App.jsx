import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import Overlay from "./components/Overlay";
import { useGameEngine } from "./game/useGameEngine";
import TouchControls from "./components/TouchControls";


export default function App() {
  const { state, start, toggleMute, togglePause, setInput } = useGameEngine();
  const btnStyle = {
    height: 36,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
    lineHeight: "36px",       // <- key: consistent vertical alignment
    display: "inline-flex",   // <- key
    alignItems: "center",     // <- key
    justifyContent: "center", // <- key
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  };

  const btnPrimary = {
    ...btnStyle,
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.22)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 20% 10%, #162c5a 0%, #070b14 55%, #05060a 100%)",
        display: "grid",
        placeItems: "center",
        padding: "clamp(12px, 3vw, 20px)",
        overscrollBehavior: "none",
      }}
    >
      <div style={{ width: "min(980px, 96vw)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
          <div style={{ color: "white" }}>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.6 }}>Risk Zone</div>
            <div style={{ opacity: 0.75, marginTop: 2, fontSize: 13 }}>
              Move with <b>WASD</b> / <b>Arrow keys</b>. Avoid red hazards. Survive.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button onClick={start} style={btnPrimary}>
              {state.status === "playing" ? "Restart" : "Start"}
            </button>

            {state.status === "playing" && (
              <button onClick={togglePause} style={btnStyle}>
                {state.paused ? "Resume" : "Pause"}
              </button>
            )}

            <button onClick={toggleMute} style={btnStyle}>
              {state.muted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <HUD state={state} />
        </div>

        <div style={{ position: "relative", marginTop: 14, touchAction: "none" }}>
          <GameCanvas state={state} />

          {state.status === "ready" && (
            <Overlay
              title="Press Space to Start"
              subtitle="Dodge incoming hazards. Difficulty ramps quickly — stay calm."
              cta="Tip: small movements beat panicking. Space / Enter starts."
            />
          )}

          {state.status === "playing" && state.paused && (
            <Overlay title="Paused" subtitle="Tap Resume or press P." cta="Stay sharp." />
          )}

          {state.status === "gameover" && (
            <Overlay
              title="Game Over"
              subtitle={`Final score: ${state.score} • High score: ${state.highScore}`}
              cta="Press Space / Enter to play again."
            />
          )}
        </div>

        <TouchControls setInput={(patch) => setInput(patch)} />

        <div style={{
          marginTop: 12,
          opacity: 0.5,
          fontSize: 12,
          textAlign: "center",
          color: "white"
        }}>
          Built with React + Canvas · Risk Zone
        </div>
      </div>
    </div>
  );
}
