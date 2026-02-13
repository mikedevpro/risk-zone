import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import Overlay from "./components/Overlay";
import { useGameEngine } from "./game/useGameEngine";

export default function App() {
  const { state, start } = useGameEngine();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 20% 10%, #162c5a 0%, #070b14 55%, #05060a 100%)",
        display: "grid",
        placeItems: "center",
        padding: 18,
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

          <button
            onClick={start}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.16)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Start
          </button>
        </div>

        <div style={{ marginTop: 14 }}>
          <HUD state={state} />
        </div>

        <div style={{ position: "relative", marginTop: 14 }}>
          <GameCanvas state={state} />

          {state.status === "ready" && (
            <Overlay
              title="Press Space to Start"
              subtitle="Dodge incoming hazards. Difficulty ramps quickly — stay calm."
              cta="Tip: small movements beat panicking. Space / Enter starts."
            />
          )}

          {state.status === "gameover" && (
            <Overlay
              title="Game Over"
              subtitle={`Final score: ${state.score} • High score: ${state.highScore}`}
              cta="Press Space / Enter to play again."
            />
          )}
        </div>
      </div>
    </div>
  );
}
