const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchLeaderboard(limit = 10) {
  const res = await fetch(`${API_BASE}/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}

export async function submitScore({ name, score, level, character }, limit = 10) {
  const res = await fetch(`${API_BASE}/score?limit=${limit}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score, level, character }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to submit score");
  }
  return res.json();
}
