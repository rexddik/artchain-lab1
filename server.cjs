// Учебный локальный сервер на json-server 0.17.4.
const jsonServer = require("json-server");
const path = require("node:path");
const crypto = require("node:crypto");
const server = jsonServer.create();
const router = jsonServer.router(process.env.DB_FILE || path.join(__dirname, "db.json"));
const currencies = { Ethereum: "ETH", Polygon: "POL", Solana: "SOL" };
server.use(jsonServer.defaults({ logger: true }));
server.use(jsonServer.bodyParser);
server.use((req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });

const fail = (res, code, error) => res.status(code).json({ error });
const parseAmount = (value) => {
  if (!["number", "string"].includes(typeof value)) return null;
  const text = String(value).trim().replace(",", ".");
  if (!/^\d+(?:\.\d{1,4})?$/.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) && number > 0 && number <= 1e9 ? number : null;
};
const imagePath = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;
  try { return ["http:", "https:"].includes(new URL(value, "http://localhost/").protocol); }
  catch { return false; }
};

server.post("/bids", (req, res) => {
  const body = req.body || {};
  const amount = parseAmount(body.amount);
  const bidder = typeof body.bidder === "string" ? body.bidder.trim() : "";
  const id = String(body.nftId || "");
  if (!id || !amount || !bidder || bidder.length > 100) return fail(res, 400, "Укажите NFT, имя и корректную положительную сумму (до 4 знаков после запятой).");
  const state = router.db.getState();
  const token = state.nfts.find((item) => String(item.id) === id);
  if (!token) return fail(res, 404, "Выбранный NFT не найден.");
  if (!token.isAuction) return fail(res, 409, "Этот NFT не участвует в аукционе.");
  if (amount <= token.price) return fail(res, 409, `Ставка должна быть больше ${token.price} ${currencies[token.network]}.`);
  const bid = { id: crypto.randomUUID(), nftId: id, bidder, amount, currency: currencies[token.network], createdAt: new Date().toISOString() };
  // Один синхронный обработчик: проверка актуальной цены и одна запись обоих массивов.
  const nfts = state.nfts.map((item) => String(item.id) === id ? { ...item, price: amount, bids: item.bids + 1 } : item);
  const bids = [...(state.bids || []), bid];
  try {
    router.db.setState({ ...state, nfts, bids }).write();
  } catch {
    router.db.setState(state);
    return fail(res, 500, "Не удалось сохранить ставку в db.json.");
  }
  res.status(201).json(bid);
});

// Сохранена публикация NFT из ЛР5, теперь также через сервер.
server.post("/nfts", (req, res) => {
  const body = req.body || {};
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const author = typeof body.author?.name === "string" ? body.author.name.trim() : "";
  const price = parseAmount(body.price);
  const category = body.category;
  if (!title || title.length > 120 || !author || author.length > 100 || !price
    || !Object.hasOwn(currencies, body.network) || !imagePath(body.image)
    || !["Живопись и графика", "Генеративное искусство"].includes(category)) {
    return fail(res, 400, "Проверьте название, автора, цену, сеть, категорию и путь к изображению.");
  }
  const token = { id: crypto.randomUUID(), title, author: { name: author, avatar: "images/avatar-maria.svg" }, network: body.network, price, bids: 0, category, image: body.image.trim(), isAuction: true, tags: ["пользовательская работа"] };
  const state = router.db.getState();
  try { router.db.setState({ ...state, nfts: [token, ...state.nfts] }).write(); }
  catch { router.db.setState(state); return fail(res, 500, "Не удалось сохранить NFT в db.json."); }
  res.status(201).json(token);
});
server.use(router);
server.use((error, req, res, next) => {
  console.error(error.message);
  fail(res, error.status || 500, "Ошибка обработки запроса. Проверьте формат JSON.");
});
const port = Number(process.env.PORT || 3000);
const listener = server.listen(port, "127.0.0.1", () => console.log(`ArtChain API: http://127.0.0.1:${listener.address().port}`));
listener.on("error", (error) => { console.error(`Не удалось запустить API: ${error.message}`); process.exitCode = 1; });
