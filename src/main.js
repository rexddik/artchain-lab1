import "./styles.scss";
import { getNFTs, createBid, createNFT } from "./api.js";
import { validateNFTs, isNFT, parseAmount, currencies, isImagePath } from "./model.js";
import { renderCatalog, NFT, fillTokenSelect, setMessage } from "./ui.js";

const catalog = document.querySelector("#catalog-container");
const detail = document.querySelector("#detail-container");
const bidForms = [...document.querySelectorAll("[data-bid-form]")];
const publishForm = document.querySelector("#publish-form");
const loadStatus = document.querySelector("#load-status");
const retry = document.querySelector("#retry-load");
const dialog = document.querySelector("#bid-dialog");
let tokens = [];
let loading = false;
let posting = false;
let openerId = null;

function refreshView(preferredId) {
  if (catalog) renderCatalog(tokens, catalog);
  if (detail) {
    detail.replaceChildren();
    const id = new URLSearchParams(window.location.search).get("id");
    const token = id ? tokens.find((item) => item.id === id) : tokens[0];
    if (token) detail.append(new NFT(token).render());
    else setMessage(loadStatus, "NFT не найден в галерее.", true);
  }
  for (const form of bidForms) {
    fillTokenSelect(form.elements.nftId, tokens, preferredId);
    showCurrentPrice(form);
    form.querySelector('button[type="submit"]').disabled = loading || posting || !tokens.some((item) => item.isAuction);
  }
}

function showCurrentPrice(form) {
  const token = tokens.find((item) => item.id === form.elements.nftId.value);
  const text = form.querySelector("[data-current-price]");
  text.textContent = token ? `Текущая цена: ${token.price} ${currencies[token.network]}. Введите большую сумму.` : "Нет NFT, доступных для ставки.";
}

async function loadGallery() {
  if (loading) return;
  loading = true;
  retry.hidden = true;
  setMessage(loadStatus, "Загрузка галереи…");
  (catalog || detail)?.setAttribute("aria-busy", "true");
  for (const form of bidForms) form.querySelector('button[type="submit"]').disabled = true;
  try {
    tokens = validateNFTs(await getNFTs());
    setMessage(loadStatus, "");
    refreshView();
    if (!tokens.length) setMessage(loadStatus, "На сервере пока нет NFT.");
  } catch (error) {
    // Существующие карточки остаются видны, но операции ставок блокируются до повторной загрузки.
    for (const form of bidForms) form.querySelector('button[type="submit"]').disabled = true;
    setMessage(loadStatus, error.message, true);
    retry.hidden = false;
  } finally {
    loading = false;
    (catalog || detail)?.setAttribute("aria-busy", "false");
    // Не включаем кнопку после неудачного GET.
    if (retry.hidden) for (const form of bidForms) form.querySelector('button[type="submit"]').disabled = posting || !tokens.some((item) => item.isAuction);
  }
}

// Делегирование сохраняется после перерисовки и работает для новых карточек.
for (const container of [catalog, detail].filter(Boolean)) {
  container.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('[data-action="bid"]');
    if (!button || !container.contains(button)) return;
    const id = button.closest("[data-id]")?.dataset.id;
    if (!id) return;
    if (!dialog) {
      window.location.href = `checkout.html?nftId=${encodeURIComponent(id)}`;
      return;
    }
    openerId = id;
    const form = dialog.querySelector("form");
    fillTokenSelect(form.elements.nftId, tokens, id);
    form.elements.amount.value = "";
    showCurrentPrice(form);
    setMessage(form.querySelector("[data-form-status]"), "");
    dialog.showModal();
  });
}

document.querySelector("#close-bid-dialog")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("cancel", (event) => { if (posting) event.preventDefault(); });
dialog?.addEventListener("close", () => {
  const card = [...catalog.querySelectorAll("[data-id]")].find((item) => item.dataset.id === openerId);
  card?.querySelector('[data-action="bid"]')?.focus();
});

for (const form of bidForms) {
  form.elements.nftId.addEventListener("change", () => {
    showCurrentPrice(form);
    setMessage(form.querySelector("[data-form-status]"), "");
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (posting || loading || !form.reportValidity()) return;
    const status = form.querySelector("[data-form-status]");
    let amount;
    const nftId = form.elements.nftId.value;
    const bidder = form.elements.bidder.value.trim();
    try {
      amount = parseAmount(form.elements.amount.value);
      const token = tokens.find((item) => item.id === nftId);
      if (!token || !token.isAuction) throw new Error("Выберите доступный NFT.");
      if (!bidder) throw new Error("Введите ваше имя.");
      if (amount <= token.price) throw new Error(`Ставка должна быть больше ${token.price} ${currencies[token.network]}.`);
    } catch (error) { setMessage(status, error.message, true); return; }
    posting = true;
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    form.setAttribute("aria-busy", "true");
    const close = document.querySelector("#close-bid-dialog");
    if (close) close.disabled = true;
    setMessage(status, "Отправка ставки…");
    try {
      const saved = await createBid({ nftId, amount, bidder });
      // Используем подтверждённый ответ, а не локальное предположение об успехе.
      if (!saved || saved.nftId !== nftId || saved.amount !== amount) throw new Error("Сервер вернул некорректное подтверждение ставки. Проверьте состояние каталога перед повтором.");
      form.elements.amount.value = "";
      setMessage(status, `Ставка ${saved.amount} ${saved.currency} принята и сохранена на сервере.`);
      setMessage(document.querySelector("#catalog-status"), `Ставка ${saved.amount} ${saved.currency} принята.`);
      try {
        tokens = validateNFTs(await getNFTs());
        refreshView(nftId);
      } catch (error) {
        setMessage(loadStatus, `Ставка сохранена, но галерея не обновилась. ${error.message}`, true);
        retry.hidden = false;
      }
    } catch (error) {
      setMessage(status, error.message, true);
      // При конфликте цен перечитываем текущее серверное состояние.
      try { tokens = validateNFTs(await getNFTs()); refreshView(nftId); } catch { retry.hidden = false; }
    } finally {
      posting = false;
      form.setAttribute("aria-busy", "false");
      submit.disabled = false;
      if (close) close.disabled = false;
    }
  });
}

publishForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (posting || !publishForm.reportValidity()) return;
  const status = document.querySelector("#publish-status");
  const fields = new FormData(publishForm);
  let price;
  const title = String(fields.get("title") || "").trim();
  const author = String(fields.get("author") || "").trim();
  const image = String(fields.get("image") || "").trim();
  try {
    price = parseAmount(fields.get("price"));
    if (!title || !author || !isImagePath(image)) throw new Error("Проверьте название, автора и путь к изображению.");
  } catch (error) { setMessage(status, error.message, true); return; }
  posting = true;
  const submit = publishForm.querySelector('button[type="submit"]');
  const reset = publishForm.querySelector('button[type="reset"]');
  submit.disabled = true;
  if (reset) reset.disabled = true;
  publishForm.setAttribute("aria-busy", "true");
  setMessage(status, "Публикация NFT…");
  try {
    const saved = await createNFT({ title, author: { name: author }, price, image, network: fields.get("network"), category: fields.get("category") });
    if (!isNFT(saved)) throw new Error("Сервер вернул некорректное подтверждение публикации.");
    publishForm.reset();
    setMessage(status, `NFT «${saved.title}» опубликован на сервере.`);
    try { tokens = validateNFTs(await getNFTs()); refreshView(); }
    catch (error) { setMessage(loadStatus, `NFT сохранён, но галерея не обновилась. ${error.message}`, true); retry.hidden = false; }
  } catch (error) { setMessage(status, error.message, true); }
  finally {
    posting = false;
    submit.disabled = false;
    if (reset) reset.disabled = false;
    publishForm.setAttribute("aria-busy", "false");
  }
});
publishForm?.addEventListener("reset", () => setMessage(document.querySelector("#publish-status"), ""));
retry?.addEventListener("click", loadGallery);

if (catalog || detail || bidForms.length) {
  await loadGallery();
  const preferredId = new URLSearchParams(window.location.search).get("nftId");
  if (preferredId) for (const form of bidForms) { fillTokenSelect(form.elements.nftId, tokens, preferredId); showCurrentPrice(form); }
}
