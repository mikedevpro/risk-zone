let ctx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) {
    ctx = new AudioCtor();
  }
  return ctx;
}

export async function unlockAudio() {
  const audio = getCtx();
  if (!audio || audio.state !== "suspended") return;
  try {
    await audio.resume();
  } catch {
    // Ignore resume failures; playback helpers are already no-op safe.
  }
}

function playTone(freq, duration = 0.08, type = "sine", volume = 0.15) {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") {
    void audio.resume().catch(() => {});
    return;
  }

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + duration);
}

// ---- Public sounds ----

export function playCoin(streak = 0) {
  const base = 600;
  const pitch = base + streak * 40;
  playTone(pitch, 0.08, "triangle", 0.12);
}

export function playDash() {
  playTone(180, 0.07, "sawtooth", 0.18);
}

export function playGameOver() {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === "suspended") {
    void audio.resume().catch(() => {});
    return;
  }

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.4);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  osc.connect(gain);
  gain.connect(audio.destination);

  osc.start(now);
  osc.stop(now + 0.4);
}
