export const currencies = { Ethereum: "ETH", Polygon: "POL", Solana: "SOL" };

export const isImagePath = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;
  try {
    return ["http:", "https:"].includes(new URL(value, "http://localhost/").protocol);
  } catch { return false; }
};

export const isNFT = (token) => token !== null && typeof token === "object"
  && typeof token.id === "string" && token.id.length > 0
  && typeof token.title === "string" && token.title.trim().length > 0
  && token.author && typeof token.author.name === "string"
  && isImagePath(token.author.avatar) && isImagePath(token.image)
  && Object.hasOwn(currencies, token.network)
  && Number.isFinite(token.price) && token.price > 0
  && Number.isSafeInteger(token.bids) && token.bids >= 0
  && typeof token.category === "string" && typeof token.isAuction === "boolean"
  && Array.isArray(token.tags);

export function validateNFTs(data) {
  if (!Array.isArray(data) || !data.every(isNFT)
    || new Set(data.map((item) => item.id)).size !== data.length) {
    throw new Error("Сервер вернул некорректный каталог NFT.");
  }
  return data;
}

export function parseAmount(value) {
  const text = String(value ?? "").trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,4})?$/.test(text)) throw new Error("Введите положительную сумму: до 4 знаков после запятой.");
  const amount = Number(text);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1e9) throw new Error("Сумма должна быть больше нуля и не более 1 000 000 000.");
  return amount;
}

