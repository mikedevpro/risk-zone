import { useEffect, useState } from "react";
import GameCanvas from "./components/GameCanvas";
import HUD from "./components/HUD";
import Overlay from "./components/Overlay";
import StartScreen from "./components/StartScreen";
import GameOverScreen from "./components/GameOverScreen";
import { useGameEngine } from "./game/useGameEngine";
import TouchControls from "./components/TouchControls";
import Leaderboard from "./components/Leaderboard";
import { CHARACTERS } from "./game/characters";
import { fetchLeaderboard, submitScore } from "./game/api";


export default function App() {
  const { state, start, toggleMute, togglePause, setInput, setCharacter } = useGameEngine();
  const isTouch = typeof window !== "undefined" && (
    "ontouchstart" in window || navigator.maxTouchPoints > 0
  );
  const [viewportW, setViewportW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const isSmall = viewportW < 760;
  const isTiny = viewportW < 430;
  const [playerName, setPlayerName] = useState(
    () => localStorage.getItem("riskzone_name") || "Mike"
  );
  const [serverBoard, setServerBoard] = useState([]);
  const [apiStatus, setApiStatus] = useState("idle"); // idle | ok | down
  const isPlaying = state.status === "playing";

  useEffect(() => {
    localStorage.setItem("riskzone_name", playerName);
  }, [playerName]);

  useEffect(() => {
    function onResize() {
      setViewportW(window.innerWidth);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    fetchLeaderboard(10)
      .then((b) => {
        setServerBoard(b);
        setApiStatus("ok");
      })
      .catch(() => setApiStatus("down"));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (state.status !== "gameover") return;

      try {
        const updated = await submitScore(
          {
            name: (playerName || "Player").slice(0, 16),
            score: state.score,
            level: state.level ?? 1,
            character: state.characterId ?? null,
          },
          10
        );

        if (!cancelled) {
          setServerBoard(updated);
          setApiStatus("ok");
        }
      } catch (e) {
        if (!cancelled) setApiStatus("down");
        // local fallback still works
        console.warn("Score submit failed:", e);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [state.status, state.score, state.level, state.characterId, playerName]);

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
        padding: "max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))",
        overscrollBehavior: "none",
      }}
    >
      <div style={{ width: "min(980px, 100vw)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: isSmall ? "flex-start" : "center", flexWrap: "wrap" }}>
          <div style={{ color: "white" }}>
            <div style={{ fontSize: isTiny ? 22 : 26, fontWeight: 900, letterSpacing: -0.6 }}>Risk Zone</div>
            <div style={{ opacity: 0.75, marginTop: 2, fontSize: 13 }}>
              Move with <b>WASD</b> / <b>Arrow keys</b>. Avoid red hazards. Survive.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end", width: isSmall ? "100%" : "auto" }}>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Name"
              maxLength={16}
              style={{
                height: 36,
                padding: "0 10px",
                width: isSmall ? "100%" : 170,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(0,0,0,0.18)",
                color: "white",
                fontWeight: 800,
                outline: "none",
              }}
            />
          </div>
        </div>

        {!isPlaying && (
          <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={start} style={btnPrimary}>
            {state.status === "playing" ? "Restart" : "Start"}
          </button>

          <button onClick={toggleMute} style={btnStyle}>
            {state.muted ? "Unmute" : "Mute"}
          </button>
          </div>
        )}

        {!isPlaying && (
          <div style={{ marginTop: 14 }}>
          <HUD state={state} compact={isTiny} />
          </div>
        )}

        {!isPlaying && (
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: isTiny ? "space-between" : "flex-start" }}>
          {CHARACTERS.map((c) => {
            const active = (state.characterId || "skater") === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCharacter(c.id)}
                style={{
                  ...btnStyle,
                  height: 34,
                  minWidth: isTiny ? "calc(50% - 4px)" : "auto",
                  padding: isTiny ? "0 8px" : "0 12px",
                  background: active ? c.color : "rgba(255,255,255,0.08)",
                  border: active ? "1px solid rgba(255,255,255,0.55)" : "1px solid rgba(255,255,255,0.16)",
                  color: active ? "#07111f" : "white",
                }}
              >
                {c.badge} {c.name}
              </button>
            );
          })}
          </div>
        )}

        <div
          style={
            isPlaying
              ? {
                  position: "fixed",
                  inset: 0,
                  width: "100vw",
                  display: "grid",
                  placeItems: "center",
                  zIndex: 20,
                  touchAction: "none",
                  background: "radial-gradient(1200px 700px at 50% 20%, #102448 0%, #080e1a 65%, #05060a 100%)",
                }
              : { position: "relative", marginTop: 14, touchAction: "none", width: "100%" }
          }
        >
          <GameCanvas state={state} fullscreen={isPlaying} />

          {isPlaying && (
            <div
              style={{
                position: "absolute",
                top: "max(10px, env(safe-area-inset-top))",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "center",
                zIndex: 30,
                pointerEvents: "auto",
              }}
            >
              <button onClick={togglePause} style={btnStyle}>
                {state.paused ? "Resume" : "Pause"}
              </button>
              <button onClick={toggleMute} style={btnStyle}>
                {state.muted ? "Unmute" : "Mute"}
              </button>
              <button onClick={start} style={btnPrimary}>
                Restart
              </button>
            </div>
          )}

          {state.status === "ready" && <StartScreen />}

          {state.status === "playing" && state.paused && (
            <Overlay title="Paused" subtitle="Tap Resume or press P." cta="Stay sharp." />
          )}

          {state.status === "gameover" && (
            <GameOverScreen
              score={state.score}
              highScore={state.highScore}
              lives={state.lives}
              level={state.level}
            />
          )}

          {isTouch && state.status === "playing" && <TouchControls setInput={setInput} />}
        </div>

        {state.status === "gameover" && (
          <>
            <Leaderboard items={serverBoard.length ? serverBoard : state.leaderboard} />
            <div style={{ marginTop: 8, opacity: 0.7, color: "white", fontSize: 12 }}>
              {apiStatus === "ok" ? "Global leaderboard connected ✅" : "Global leaderboard offline — showing local results"}
            </div>
          </>
        )}

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
