const API_URL = "http://localhost:8080/api";

export async function fetchGameConfig() {
  const res = await fetch(`${API_URL}/config`);
  if (!res.ok) throw new Error("서버 응답 오류");
  return await res.json();
}

export async function fetchRanking() {
  const res = await fetch(`${API_URL}/ranking`);
  if (!res.ok) throw new Error("랭킹 조회 오류");
  return await res.json();
}

export async function postScore(name, score) {
  const res = await fetch(`${API_URL}/ranking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score })
  });
  if (!res.ok) throw new Error("점수 등록 오류");
  return await res.json();
}
