export const CANVAS_W = 900;
export const CANVAS_H = 540;

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

export const LEVEL_UP_EVERY = 18; // seconds survived per level
export const LEVEL_MAX = 20;
export const LEVEL_SPEED_BOOST = 1.07; // per level
export const LEVEL_SPAWN_BOOST = 0.92; // per level (lower = faster spawns)

export const BOSS_LEVEL_INTERVAL = 5;

export const BOSS_RADIUS = 48;
export const BOSS_SPEED = 120;
export const BOSS_HEALTH = 20;
export const BOSS_REWARD = 250;
