import { ref } from 'vue';
import { getNFTs, createBid, createNFT } from '../api.js';
import { validateNFTs, isNFT, parseAmount, isImagePath, currencies } from '../model.js';

// Данные передаются компонентам сверху вниз; карточки не изменяют props.
const toCard = token => ({
  id: String(token.id), title: token.title, creator: token.author.name,
  creatorAvatar: token.author.avatar, network: token.network,
  currentBid: token.price, bidsCount: token.bids, isAuctionActive: token.isAuction,
  imageUrl: token.image, category: token.category, tags: [...token.tags]
});

export function useGallery(items) {
  const loading = ref(false);
  const busy = ref(false);
  const loadError = ref('');
  const bidStatus = ref('');
  const bidError = ref(false);
  const publishStatus = ref('');
  const publishError = ref(false);
  const message = ref('');
  const serverReady = ref(false);

  async function refresh() {
    const result = validateNFTs(await getNFTs());
    items.value = result.map(toCard);
    serverReady.value = true;
    loadError.value = '';
  }
  async function load() {
    if (loading.value || busy.value) return;
    loading.value = true;
    loadError.value = '';
    try { await refresh(); }
    catch (error) { serverReady.value = false; loadError.value = error.message; }
    finally { loading.value = false; }
  }

  async function placeBid(fields) {
    if (busy.value || loading.value) return;
    bidStatus.value = '';
    bidError.value = false;
    let amount;
    const nftId = String(fields.nftId);
    const bidder = fields.bidder.trim();
    try {
      if (!serverReady.value) throw new Error('Для размещения ставки загрузите данные с сервера.');
      amount = parseAmount(fields.amount);
      const token = items.value.find(item => item.id === nftId);
      if (!token || !token.isAuctionActive) throw new Error('Выберите NFT с активным аукционом.');
      if (!bidder) throw new Error('Введите ваше имя.');
      if (amount <= token.currentBid) throw new Error(`Ставка должна быть больше ${token.currentBid} ${currencies[token.network]}.`);
    } catch (error) { bidError.value = true; bidStatus.value = error.message; return; }
    busy.value = true;
    bidStatus.value = 'Отправка ставки…';
    try {
      const saved = await createBid({ nftId, amount, bidder });
      if (!saved || saved.nftId !== nftId || saved.amount !== amount) throw new Error('Не удалось проверить подтверждение ставки. Обновите каталог перед повторной отправкой.');
      bidStatus.value = `Ставка ${saved.amount} ${saved.currency} принята и сохранена на сервере.`;
      message.value = `Ставка ${saved.amount} ${saved.currency} принята.`;
      try { await refresh(); }
      catch (error) { serverReady.value = false; loadError.value = `Ставка сохранена, но галерея не обновилась. ${error.message}`; }
    } catch (error) {
      bidError.value = true;
      bidStatus.value = error.message;
      try { await refresh(); } catch { serverReady.value = false; }
    } finally { busy.value = false; }
  }

  async function publish(fields) {
    if (busy.value || loading.value) return;
    publishStatus.value = '';
    publishError.value = false;
    let price;
    const title = fields.title.trim();
    const author = fields.author.trim();
    const image = fields.image.trim();
    try {
      price = parseAmount(fields.price);
      if (!title || !author || !isImagePath(image)) throw new Error('Проверьте название, автора и путь к изображению.');
    } catch (error) { publishError.value = true; publishStatus.value = error.message; return; }
    busy.value = true;
    publishStatus.value = 'Публикация NFT…';
    try {
      const saved = await createNFT({ title, author: { name: author }, price, image, network: fields.network, category: fields.category });
      if (!isNFT(saved)) throw new Error('Сервер вернул некорректное подтверждение публикации.');
      publishStatus.value = `NFT «${saved.title}» опубликован на сервере.`;
      try { await refresh(); }
      catch (error) { serverReady.value = false; loadError.value = `NFT опубликован, но галерея не обновилась. ${error.message}`; }
    } catch (error) { publishError.value = true; publishStatus.value = error.message; }
    finally { busy.value = false; }
  }
  return { items, loading, busy, loadError, bidStatus, bidError, publishStatus, publishError, message, serverReady, load, placeBid, publish };
}
