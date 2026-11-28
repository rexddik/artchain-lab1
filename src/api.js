const API_URL = (import.meta.env?.VITE_API_URL || "/api").replace(/\/$/, "");

// HTTP-ошибки, отсутствие сети, тайм-аут и некорректный JSON обрабатываются явно.
export async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { Accept: "application/json", ...options.headers },
      cache: "no-store",
      signal: controller.signal
    });
    if (!response.ok) {
      let message = `Ошибка сервера: HTTP ${response.status}`;
      try { message = (await response.json()).error || message; } catch { /* Нет JSON-тела. */ }
      throw new Error(message);
    }
    try {
      return await response.json();
    } catch {
      throw new Error("Сервер вернул некорректный JSON.");
    }
  } catch (error) {
    if (error.name === "AbortError") throw new Error("Сервер не ответил за 10 секунд. Повторите попытку.");
    if (error instanceof TypeError) throw new Error("Не удалось подключиться к серверу. Проверьте запуск npm run dev и соединение.");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export const getNFTs = () => request("/nfts");
export const getNFT = (id) => request(`/nfts/${encodeURIComponent(id)}`);
export const createBid = (bid) => request("/bids", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(bid)
});
export const createNFT = (token) => request("/nfts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(token)
});

