import { useEffect, useMemo, useRef, useState } from "react";
import { makeInitialState, startGame, step } from "./engine";

function makeInput() {
  return { up: false, down: false, left: false, right: false, dash: false };
}

export function useGameEngine() {
  const [state, setState] = useState(() => makeInitialState());
  const inputRef = useRef(makeInput());
  const rafRef = useRef(null);
  const lastRef = useRef(0);

  const api = useMemo(() => {
    return {
      state,
      start: () => setState((s) => startGame(s)),
      reset: () => setState(() => makeInitialState()),
      setInput: (patch) => {
        inputRef.current = { ...inputRef.current, ...patch };
      },
    };
  }, [state]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (k === "shift") inputRef.current.dash = true;
      if (k === "arrowup" || k === "w") inputRef.current.up = true;
      if (k === "arrowdown" || k === "s") inputRef.current.down = true;
      if (k === "arrowleft" || k === "a") inputRef.current.left = true;
      if (k === "arrowright" || k === "d") inputRef.current.right = true;

      if ((k === " " || k === "enter") && (state.status === "ready" || state.status === "gameover")) {
        setState((s) => startGame(s));
      }
    }

    function onKeyUp(e) {
      const k = e.key.toLowerCase();
      if (k === "shift") inputRef.current.dash = false;
      if (k === "arrowup" || k === "w") inputRef.current.up = false;
      if (k === "arrowdown" || k === "s") inputRef.current.down = false;
      if (k === "arrowleft" || k === "a") inputRef.current.left = false;
      if (k === "arrowright" || k === "d") inputRef.current.right = false;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [state.status]);

  useEffect(() => {
    function loop(ts) {
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min(0.033, (ts - lastRef.current) / 1000);
      lastRef.current = ts;

      setState((s) => step({ ...s }, inputRef.current, dt));
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return api;
}
