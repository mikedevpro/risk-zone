import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import Overlay from "./components/Overlay";
import { useGameEngine } from "./game/useGameEngine";
import TouchControls from "./components/TouchControls";


export default function App() {
  const { state, start, toggleMute, togglePause, setInput } = useGameEngine();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 20% 10%, #162c5a 0%, #070b14 55%, #05060a 100%)",
        display: "grid",
        placeItems: "center",
        padding: 18,
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

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={start}>{state.status === "playing" ? "Restart" : "Start"}</button>
            <button onClick={toggleMute}>{state.muted ? "Unmute" : "Mute"}</button>
            {state.status === "playing" && (
              <button onClick={togglePause}>{state.paused ? "Resume" : "Pause"}</button>
            )}
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
      </div>
    </div>
  );
}
