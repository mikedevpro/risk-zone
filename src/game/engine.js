import { playCoin, playDash } from "./sound";
import { loadLeaderboard } from "./leaderboard";
import { CHARACTERS } from "./characters";

import {
  CANVAS_W,
  CANVAS_H,
  WORLD_W,
  WORLD_H,
  PLAYER_RADIUS,
  PLAYER_SPEED,
  HAZARD_RADIUS_MIN,
  HAZARD_RADIUS_MAX,
  HAZARD_BASE_SPEED,
  HAZARD_SPAWN_START,
  HAZARD_SPAWN_MIN,
  DIFFICULTY_RAMP_EVERY,
  SPEED_RAMP_MULT,
  SPAWN_RAMP_MULT,
  NEAR_MISS_DIST,
  NEAR_MISS_COOLDOWN,
  NEAR_MISS_POINTS,
  COIN_RADIUS,
  COIN_SCORE,
  COIN_SPAWN_EVERY,
  COIN_MAX,
  STREAK_WINDOW,
  STREAK_BONUS_STEP,
  STREAK_BONUS_CAP,
  LEVEL_UP_EVERY,
  LEVEL_MAX,
  LEVEL_SPEED_BOOST,
  LEVEL_SPAWN_BOOST,
  BOSS_LEVEL_INTERVAL,
  BOSS_RADIUS,
  BOSS_HEALTH,
  BOSS_SPEED,
  BOSS_REWARD,
  CHARGER_UNLOCK_LEVEL,
  CHARGER_CHANCE,
  CHARGER_ARM_TIME,
  CHARGER_SPEED_MULT,
  SPIRAL_UNLOCK_LEVEL,
  SPIRAL_CHANCE,
  SPIRAL_TURN_RATE,
  START_LIVES,
  IFRAME_TIME,
  OVERDRIVE_STREAK,
  OVERDRIVE_TIME,
  OVERDRIVE_SPEED_MULT,
  OVERDRIVE_SCORE_MULT,
} from "./constants";

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function rand(min, max) {
  return min + Math.random() * (max - min);
}

export function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

export function circleHit(a, b) {
  const r = a.r + b.r;
  return dist2(a.x, a.y, b.x, b.y) <= r * r;
}

function getSavedHighScore() {
  try {
    return Number(localStorage.getItem("riskzone_highscore") || 0);
  } catch {
    return 0;
  }
}

export function makeInitialState() {
  const state = {
    status: "ready", // ready | playing | gameover
    timeAlive: 0,
    score: 0,
    highScore: getSavedHighScore(),
    characterId: localStorage.getItem("riskzone_char") || "skater",
    overdrive: 0,
    timeScale: 1,
    hitFlash: 0,
    screenShake: 0,
    nearMisses: 0,
    lives: START_LIVES,
    _iframes: 0,

    // difficulty
    hazardSpeedMult: 1,
    hazardSpawnEvery: HAZARD_SPAWN_START,
    level: 1,
    _spawnTimer: 0,
    _rampTimer: 0,
    _levelTimer: 0,
    boss: null,
    bossActive: false,

    player: {
      x: CANVAS_W / 2,
      y: CANVAS_H / 2,
      r: PLAYER_RADIUS,
      speed: PLAYER_SPEED,

      dashSpeed: 900,
      dashTime: 0.12,
      dashCooldown: 0.6,

      _dashLeft: 0,
      _dashCdLeft: 0,
      _dashDir: { x: 0, y: 0 },
    },

    hazards: [],
    coins: [],
    _coinTimer: 0,

    popups: [],
    coinStreak: 0,
    _streakTimer: 0,
    leaderboard: loadLeaderboard(),

    paused: false,
    muted: JSON.parse(localStorage.getItem("riskzone_muted") || "false"),
  };

  state.nearMisses += 1;
  return state;
}

function spawnHazard(state) {
  // Spawn just outside one edge and move inward with slight angle variance
  const r = rand(HAZARD_RADIUS_MIN, HAZARD_RADIUS_MAX);

  const edge = Math.floor(rand(0, 4)); // 0 top, 1 right, 2 bottom, 3 left
  let x, y;

  if (edge === 0) {
    x = rand(0, CANVAS_W);
    y = -r - 4;
  } else if (edge === 1) {
    x = CANVAS_W + r + 4;
    y = rand(0, CANVAS_H);
  } else if (edge === 2) {
    x = rand(0, CANVAS_W);
    y = CANVAS_H + r + 4;
  } else {
    x = -r - 4;
    y = rand(0, CANVAS_H);
  }

  // Aim generally toward player, with a bit of randomness so it feels “alive”
  const px = state.player.x;
  const py = state.player.y;

  let dx = px - x;
  let dy = py - y;

  const len = Math.hypot(dx, dy) || 1;
  dx /= len;
  dy /= len;

  // Angle jitter
  const jitter = rand(-0.35, 0.35);
  const cos = Math.cos(jitter);
  const sin = Math.sin(jitter);
  const jx = dx * cos - dy * sin;
  const jy = dx * sin + dy * cos;

  const speed = HAZARD_BASE_SPEED * state.hazardSpeedMult * rand(0.9, 1.1);
  const lvl = state.level ?? 1;
  const canSpiral = lvl >= SPIRAL_UNLOCK_LEVEL;
  const canCharger = lvl >= CHARGER_UNLOCK_LEVEL;

  let type = "normal";

  if (canSpiral && Math.random() < SPIRAL_CHANCE) type = "spiral";
  else if (canCharger && Math.random() < CHARGER_CHANCE) type = "charger";
  const base = { x, y, r, vx: jx * speed, vy: jy * speed, nearCd: 0, type };

  if (type === "spiral") {
    state.hazards.push({
      ...base,
      turn: Math.random() < 0.5 ? -1 : 1, // clockwise / counter
    });
  } else if (type === "charger") {
    // your charger object as-is
    state.hazards.push({
      ...base,
      phase: "arm",       // arm -> charge
      armLeft: CHARGER_ARM_TIME,
      dir: { x: jx, y: jy },
    });
  } else {
    state.hazards.push(base);
  }
}

function spawnCoin(state) {
  for (let attempt = 0; attempt < 12; attempt++) {
    let x = rand(COIN_RADIUS, WORLD_W - COIN_RADIUS);
    let y = rand(COIN_RADIUS, WORLD_H - COIN_RADIUS);

    // Risk bias: half the time, spawn near a random hazard (if any)
    if (state.hazards.length > 0 && Math.random() < 0.5) {
      const h = state.hazards[Math.floor(rand(0, state.hazards.length))];
      const angle = rand(0, Math.PI * 2);
      const d = rand(h.r + 26, h.r + 90);
      x = clamp(h.x + Math.cos(angle) * d, COIN_RADIUS, WORLD_W - COIN_RADIUS);
      y = clamp(h.y + Math.sin(angle) * d, COIN_RADIUS, WORLD_H - COIN_RADIUS);
    }

    const coin = { x, y, r: COIN_RADIUS };

    // Don’t spawn on player
    if (circleHit(state.player, coin)) continue;

    // Don’t spawn overlapping a hazard
    let overlapsHazard = false;
    for (const hz of state.hazards) {
      if (circleHit(hz, coin)) {
        overlapsHazard = true;
        break;
      }
    }
    if (overlapsHazard) continue;

    // Don’t spawn on another coin
    let overlapsCoin = false;
    for (const c of state.coins) {
      if (circleHit(c, coin)) {
        overlapsCoin = true;
        break;
      }
    }
    if (overlapsCoin) continue;

    state.coins.push(coin);
    return;
  }
}

function addPopup(state, x, y, text) {
  state.popups.push({
    x,
    y,
    text,
    life: 0.75,   // seconds remaining
    vy: -40,      // float upward px/sec
  });
}

export function startGame(state) {
  const next = makeInitialState();
  next.status = "playing";
  next.highScore = state.highScore ?? next.highScore;

  const char = CHARACTERS.find(c => c.id === (state.characterId || next.characterId)) || CHARACTERS[0];
  next.characterId = char.id;

  next.player.speed = char.speed ?? next.player.speed;
  next.player.dashCooldown = char.dashCooldown ?? next.player.dashCooldown;
  next.player.r = char.radius ?? next.player.r;

  // small bonuses stored for scoring logic
  next.coinBonus = char.coinBonus ?? 0;
  next.nearMissBonus = char.nearMissBonus ?? 0;

  return next;
}

export function step(state, input, dt) {
  // allow flash/slowmo easing even after gameover
  if (state.status !== "playing") {
    state.hitFlash = Math.max(0, (state.hitFlash ?? 0) - dt * 0.5);
    const ts = state.timeScale ?? 1;
    state.timeScale = ts + (1 - ts) * Math.min(1, dt * 8);
    return state;
  }

  state.hitFlash = Math.max(0, (state.hitFlash ?? 0) - dt * 0.5);
  const t = dt * (state.timeScale ?? 1);

  if (state.paused) return state;

  // timers
  state.timeAlive += t;
  const mult = state.overdrive > 0 ? OVERDRIVE_SCORE_MULT : 1;
  state.score += t * mult;
  state._spawnTimer += t;
  state._rampTimer += t;
  state._levelTimer += t;
  state.overdrive = Math.max(0, state.overdrive - t);
  state._iframes = Math.max(0, (state._iframes ?? 0) - t);
  state.screenShake = Math.max(0, (state.screenShake ?? 0) - 30 * t);

  if (state._levelTimer >= LEVEL_UP_EVERY) {
    state._levelTimer = 0;
    state.level = Math.min(LEVEL_MAX, (state.level ?? 1) + 1);

    if (state.level % BOSS_LEVEL_INTERVAL === 0) {
    state.bossActive = true;
    state.boss = {
    x: CANVAS_W / 2,
    y: -BOSS_RADIUS - 20,
    r: BOSS_RADIUS,
    hp: BOSS_HEALTH,
    };

    if (typeof addPopup === "function") {
    addPopup(state, CANVAS_W / 2, CANVAS_H / 2, "BOSS INCOMING");
    }
}


    // make it tougher
    state.hazardSpeedMult *= LEVEL_SPEED_BOOST;
    state.hazardSpawnEvery = Math.max(
      HAZARD_SPAWN_MIN,
      state.hazardSpawnEvery * LEVEL_SPAWN_BOOST
    );

    // optional: tiny score bonus on level up
    if (typeof addPopup === "function") {
      addPopup(state, state.player.x, state.player.y - 30, `LEVEL ${state.level}!`);
    }
  }

  // difficulty ramp
  if (state._rampTimer >= DIFFICULTY_RAMP_EVERY) {
    state._rampTimer = 0;
    state.hazardSpeedMult *= SPEED_RAMP_MULT;
    state.hazardSpawnEvery = Math.max(
      HAZARD_SPAWN_MIN,
      state.hazardSpawnEvery * SPAWN_RAMP_MULT
    );
  }

  // spawn hazards
  if (!state.bossActive) {
    while (state._spawnTimer >= state.hazardSpawnEvery) {
      state._spawnTimer -= state.hazardSpawnEvery;
      spawnHazard(state);
    }
  }

  // spawn coins
  state._coinTimer += t;
  while (state._coinTimer >= COIN_SPAWN_EVERY) {
    state._coinTimer -= COIN_SPAWN_EVERY;
    if (state.coins.length < COIN_MAX) spawnCoin(state);
  }

  // streak timer (resets streak if you wait too long)
  if (state.coinStreak > 0) {
    state._streakTimer += t;
    if (state._streakTimer > STREAK_WINDOW) {
      state.coinStreak = 0;
      state._streakTimer = 0;
    }
  }

  // move player
  const p = state.player;
  let ix = 0;
  let iy = 0;

  if (input.left) ix -= 1;
  if (input.right) ix += 1;
  if (input.up) iy -= 1;
  if (input.down) iy += 1;

  // normalize diagonal
  if (ix !== 0 || iy !== 0) {
    const l = Math.hypot(ix, iy) || 1;
    ix /= l;
    iy /= l;
  }

  // DASH timers
  p._dashCdLeft = Math.max(0, p._dashCdLeft - t);
  p._dashLeft = Math.max(0, p._dashLeft - t);

  // Start dash (only if moving)
  if (input.dash && p._dashCdLeft === 0 && (ix !== 0 || iy !== 0)) {
    p._dashLeft = p.dashTime;
    p._dashCdLeft = p.dashCooldown;
    p._dashDir = { x: ix, y: iy };
    playDash();
  }

  // Move player
  if (p._dashLeft > 0) {
    p.x += p._dashDir.x * p.dashSpeed * t;
    p.y += p._dashDir.y * p.dashSpeed * t;
  } else {
    const speedBoost = state.overdrive > 0 ? OVERDRIVE_SPEED_MULT : 1;
    p.x += ix * p.speed * speedBoost * t;
    p.y += iy * p.speed * speedBoost * t;
  }

  // clamp to arena
  p.x = clamp(p.x, p.r, WORLD_W - p.r);
  p.y = clamp(p.y, p.r, WORLD_H - p.r);

  // move hazards
  for (const h of state.hazards) {
    if (h.type === "spiral") {
      const ang = (SPIRAL_TURN_RATE * (h.turn ?? 1)) * t;
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);

      const vx = h.vx;
      const vy = h.vy;

      // rotate velocity vector
      h.vx = vx * cos - vy * sin;
      h.vy = vx * sin + vy * cos;

      h.x += h.vx * t;
      h.y += h.vy * t;
    } else if (h.type === "charger") {
      if (h.phase === "arm") {
        // track player while arming
        const dx = p.x - h.x;
        const dy = p.y - h.y;
        const len = Math.hypot(dx, dy) || 1;
        h.dir = { x: dx / len, y: dy / len };

        // subtle drift (keeps it feeling alive)
        const drift = 0.35;
        h.x += h.dir.x * (h.vx * drift) * t;
        h.y += h.dir.y * (h.vy * drift) * t;

        h.armLeft -= t;
        if (h.armLeft <= 0) {
          h.phase = "charge";
          // lock in lunge velocity
          h.vx = h.dir.x * Math.hypot(h.vx, h.vy) * CHARGER_SPEED_MULT;
          h.vy = h.dir.y * Math.hypot(h.vx, h.vy) * CHARGER_SPEED_MULT;
        }
      } else {
        // charging
        h.x += h.vx * t;
        h.y += h.vy * t;
      }
    } else {
      // normal hazard
      h.x += h.vx * t;
      h.y += h.vy * t;
    }
  }

  if (state.bossActive && state.boss) {
    state.boss.hp -= 1;
    const b = state.boss;

    // move toward player
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    const len = Math.hypot(dx, dy) || 1;

    b.x += (dx / len) * BOSS_SPEED * t;
    b.y += (dy / len) * BOSS_SPEED * t;

    // collision = game over
    if (circleHit(p, b)) {
      state.timeScale = 0.2;
      state.hitFlash = 1;
      state.screenShake = Math.max(state.screenShake ?? 0, 2);
      return {
        ...state,
        status: "gameover",
        score: Math.floor(state.score),
      };
    }
  }

  if (state.bossActive && state.boss && state.boss.hp <= 0) {
    state.score += BOSS_REWARD;
    state.bossActive = false;
    state.boss = null;

    if (typeof addPopup === "function") {
      addPopup(state, p.x, p.y - 40, `BOSS DEFEATED +${BOSS_REWARD}`);
    }
  }

    // near-miss detection
  for (const h of state.hazards) {
    h.nearCd = Math.max(0, (h.nearCd ?? 0) - t);

    // distance threshold: (player.r + hazard.r + NEAR_MISS_DIST)
    const thresh = p.r + h.r + NEAR_MISS_DIST;
    const d2 = dist2(p.x, p.y, h.x, h.y);

    if (h.nearCd === 0 && d2 <= thresh * thresh && !circleHit(p, h)) {
      h.nearCd = NEAR_MISS_COOLDOWN;
      state.score += NEAR_MISS_POINTS + (state.nearMissBonus ?? 0);

      // popup + optional sound tick (reuse coin tone or add a small one later)
      if (typeof addPopup === "function") {
        addPopup(state, p.x, p.y - 18, `NEAR +${NEAR_MISS_POINTS}`);
      }
    }
  }

  // cull hazards that are far out
  state.hazards = state.hazards.filter(
    (h) => h.x > -120 && h.x < WORLD_W + 120 && h.y > -120 && h.y < WORLD_H + 120
  );

    // collect coins (streak scoring)
  for (let i = state.coins.length - 1; i >= 0; i--) {
    const c = state.coins[i];
    if (circleHit(p, c)) {
      state.coins.splice(i, 1);

      // streak logic
      state.coinStreak += 1;
      if (state.coinStreak >= OVERDRIVE_STREAK) {
        state.overdrive = OVERDRIVE_TIME;
      }
      state._streakTimer = 0;
      playCoin(state.coinStreak);

      const bonus = Math.min(
        STREAK_BONUS_CAP,
        (state.coinStreak - 1) * STREAK_BONUS_STEP
      );

      const earned = COIN_SCORE + bonus + (state.coinBonus ?? 0);
      state.score += earned;

      addPopup(state, c.x, c.y, `+${earned}`);
    }
  }

    // update popups
  for (const pz of state.popups) {
    pz.y += pz.vy * t;
    pz.life -= dt;
  }
  state.popups = state.popups.filter((pz) => pz.life > 0);

  // collisions
  for (const h of state.hazards) {
    if (circleHit(p, h)) {
      // if invincible, ignore
      if ((state._iframes ?? 0) > 0) continue;

      state.lives = (state.lives ?? START_LIVES) - 1;
      state._iframes = IFRAME_TIME;

      // little feedback
      state.hitFlash = 1;
      state.screenShake = Math.max(state.screenShake ?? 0, 10);
      if (typeof addPopup === "function") addPopup(state, p.x, p.y - 24, "HIT!");

      // still alive
      if (state.lives > 0) {
        // optional: clear nearby hazards so it feels fair
        state.hazards = state.hazards.filter(
          (hz) => dist2(p.x, p.y, hz.x, hz.y) > (p.r + hz.r + 40) ** 2
        );
        break;
      }

      // out of lives -> gameover
      const finalScore = Math.floor(state.score);
      const newHigh = Math.max(state.highScore, finalScore);
      if (newHigh !== state.highScore) localStorage.setItem("riskzone_highscore", String(newHigh));

      return { ...state, status: "gameover", score: finalScore, highScore: newHigh };
    }
  }

  return state;
}
