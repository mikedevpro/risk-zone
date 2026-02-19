export const CANVAS_W = 900;
export const CANVAS_H = 540;
export const WORLD_W = CANVAS_W * 2;
export const WORLD_H = CANVAS_H * 2;
export const STAR_COUNT = 140;
export const STAR_PARALLAX = 0.35; // 0..1 (smaller = slower)

export const PLAYER_RADIUS = 12;
export const PLAYER_SPEED = 340; // px/sec

export const HAZARD_RADIUS_MIN = 10;
export const HAZARD_RADIUS_MAX = 22;

export const HAZARD_BASE_SPEED = 160; // px/sec
export const HAZARD_SPAWN_START = 1.05; // seconds
export const HAZARD_SPAWN_MIN = 0.35; // seconds

export const DIFFICULTY_RAMP_EVERY = 6.0; // seconds
export const SPEED_RAMP_MULT = 1.08; // hazard speed multiplier per ramp
export const SPAWN_RAMP_MULT = 0.90; // spawn interval multiplier per ramp

export const COIN_RADIUS = 9;
export const COIN_SCORE = 10;

export const COIN_SPAWN_EVERY = 1.25; // seconds
export const COIN_MAX = 3;

export const STREAK_WINDOW = 2.5; // seconds to keep streak alive
export const STREAK_BONUS_STEP = 5; // extra points per streak level
export const STREAK_BONUS_CAP = 15; // max bonus points (so coin max = 10 + 15 = 25)

export const NEAR_MISS_DIST = 12;      // extra pixels beyond collision radius
export const NEAR_MISS_COOLDOWN = 0.35; // seconds per hazard to avoid spam
export const NEAR_MISS_POINTS = 3;

export const LEVEL_UP_EVERY = 20; // seconds survived per level
export const LEVEL_MAX = 20;
export const LEVEL_SPEED_BOOST = 1.07; // per level
export const LEVEL_SPAWN_BOOST = 0.92; // per level (lower = faster spawns)

export const BOSS_LEVEL_INTERVAL = 5;

export const BOSS_RADIUS = 48;
export const BOSS_SPEED = 120;
export const BOSS_HEALTH = 20;
export const BOSS_REWARD = 250;

export const CHARGER_UNLOCK_LEVEL = 3;   // starts appearing at level 3+
export const CHARGER_CHANCE = 0.22;      // probability when unlocked
export const CHARGER_ARM_TIME = 0.45;    // seconds of tracking/telegraph
export const CHARGER_SPEED_MULT = 2.6;   // how fast the lunge is vs normal

export const SPIRAL_UNLOCK_LEVEL = 6;
export const SPIRAL_CHANCE = 0.18;
export const SPIRAL_TURN_RATE = 1.35; // radians/sec (try 1.0–1.8)

export const START_LIVES = 4;     // try 2 or 3
export const IFRAME_TIME = 5;  // seconds of invulnerability after hit
