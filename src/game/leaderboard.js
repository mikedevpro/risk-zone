const KEY = "riskzone_leaderboard_v1";

export function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRun(entry) {
  const board = loadLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const trimmed = board.slice(0, 10);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearLeaderboard() {
  localStorage.removeItem(KEY);
}
