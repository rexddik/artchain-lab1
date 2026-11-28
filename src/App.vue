<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import ItemList from './components/ItemList.vue';
import NftCard from './components/NftCard.vue';
import PageSection from './components/PageSection.vue';
import BaseButton from './components/BaseButton.vue';
import BaseModal from './components/BaseModal.vue';
import BidForm from './components/BidForm.vue';
import PublishForm from './components/PublishForm.vue';
import HomePage from './components/HomePage.vue';
import FilterBar from './components/FilterBar.vue';
import WatchlistPanel from './components/WatchlistPanel.vue';
import { currencies } from './model.js';
import { useGallery } from './composables/useGallery.js';

const pages = ['index', 'catalog', 'detail', 'collection', 'checkout'];
const filename = window.location.pathname.split('/').pop()?.replace('.html', '') || 'index';
const page = pages.includes(filename) ? filename : 'index';
const query = new URLSearchParams(window.location.search);
const selectedId = ref(query.get('nftId') || '');
const modalOpen = ref(false);
const items = ref([]);
const watchlist = ref([]);
const collectionOpen = ref(false);
const storageError = ref('');
const defaultFilters = () => ({ search: '', network: 'all', sort: 'default', onlyActive: false });
const filters = ref(defaultFilters());
const { loading, busy, loadError, bidStatus, bidError, publishStatus, publishError, message, serverReady, load, placeBid, publish } = useGallery(items);
const selectedNFT = computed(() => query.has('id') ? items.value.find(item => item.id === query.get('id')) : items.value[0]);
const operationsBusy = computed(() => loading.value || busy.value);
function openBid(id) {
  selectedId.value = id;
  bidStatus.value = '';
  bidError.value = false;
  modalOpen.value = true;
}
const watchedItems = computed(() => items.value.filter(item => watchlist.value.includes(item.id)));
const watchCount = computed(() => watchedItems.value.length);
const collectionTotals = computed(() => Object.entries(currencies).map(([network, currency]) => ({
  network, currency, amount: watchedItems.value.filter(item => item.network === network).reduce((sum, item) => sum + item.currentBid, 0)
})).filter(total => watchedItems.value.some(item => item.network === total.network)));
const filteredItems = computed(() => {
  const search = filters.value.search.trim().toLocaleLowerCase('ru-RU');
  const result = items.value.filter(item => (!search || `${item.title} ${item.creator}`.toLocaleLowerCase('ru-RU').includes(search))
    && (filters.value.network === 'all' || item.network === filters.value.network)
    && (!filters.value.onlyActive || item.isAuctionActive));
  const sorters = {
    'price-asc': (a, b) => a.currentBid - b.currentBid,
    'price-desc': (a, b) => b.currentBid - a.currentBid,
    'bids-asc': (a, b) => a.bidsCount - b.bidsCount,
    'bids-desc': (a, b) => b.bidsCount - a.bidsCount
  };
  return sorters[filters.value.sort] ? [...result].sort(sorters[filters.value.sort]) : result;
});
function resetFilters() { filters.value = defaultFilters(); }
function toggleWatchlist(id) {
  if (!items.value.some(item => item.id === id)) return;
  watchlist.value = watchlist.value.includes(id) ? watchlist.value.filter(value => value !== id) : [...watchlist.value, id];
}
let restored = false;
function savePreferences() {
  if (!restored) return;
  try {
    localStorage.setItem('artchain.watchlist.v1', JSON.stringify(watchlist.value));
    localStorage.setItem('artchain.filters.v1', JSON.stringify(filters.value));
    storageError.value = '';
  } catch { storageError.value = 'Браузер не разрешил сохранить настройки. После закрытия страницы они могут потеряться.'; }
}
watch([watchlist, filters], savePreferences, { deep: true, flush: 'post' });
onMounted(async () => {
  try {
    const saved = JSON.parse(localStorage.getItem('artchain.watchlist.v1') || '[]');
    if (!Array.isArray(saved) || !saved.every(id => typeof id === 'string')) throw new Error();
    watchlist.value = [...new Set(saved)];
    const savedFilters = JSON.parse(localStorage.getItem('artchain.filters.v1') || 'null');
    if (savedFilters && typeof savedFilters === 'object') {
      filters.value = {
        search: typeof savedFilters.search === 'string' ? savedFilters.search.slice(0, 120) : '',
        network: ['all', ...Object.keys(currencies)].includes(savedFilters.network) ? savedFilters.network : 'all',
        sort: ['default', 'price-asc', 'price-desc', 'bids-asc', 'bids-desc'].includes(savedFilters.sort) ? savedFilters.sort : 'default',
        onlyActive: savedFilters.onlyActive === true
      };
    }
  } catch { storageError.value = 'Не удалось восстановить сохранённые настройки. Используются начальные значения.'; }
  restored = true;
  await load();
});
</script>

<template>
  <div class="page" :class="{ 'page--with-sidebar': page === 'index' }">
    <a class="page__skip-link" href="#main-content">Перейти к содержимому</a>
    <AppHeader :active-page="page" :watch-count="watchCount" :totals="collectionTotals" />
    <main id="main-content" class="page__content content" tabindex="-1">
      <p v-if="storageError" class="request-status request-status--error" role="alert">{{ storageError }}</p>
      <HomePage v-if="page === 'index'" />
      <template v-else-if="page === 'collection'">
        <h2 class="content__title">Моя коллекция</h2>
        <p v-if="loading" role="status">Загрузка коллекции…</p>
        <p v-if="loadError" class="request-status request-status--error" role="alert">{{ loadError }}</p>
        <BaseButton v-if="loadError" variant="secondary" :disabled="operationsBusy" @click="load">Повторить загрузку</BaseButton>
        <WatchlistPanel :items="watchedItems" :totals="collectionTotals" :busy="operationsBusy" @place-bid="openBid" @toggle-watchlist="toggleWatchlist" @clear="watchlist = []" />
        <a href="catalog.html">Вернуться в каталог</a>
      </template>
      <template v-else>
        <h2 class="content__title">{{ page === 'catalog' ? 'Каталог цифровых работ' : page === 'detail' ? 'Карточка NFT' : 'Размещение ставки на NFT' }}</h2>
        <p v-if="page === 'catalog'" class="content__text">Работы, выставленные на продажу и аукционы.</p>
        <p v-if="page === 'catalog'"><a class="bid-form__button" href="#publish">Опубликовать NFT</a></p>
        <p v-if="message" class="request-status" role="status" aria-live="polite">{{ message }}</p>
        <p v-if="loading" class="request-status" role="status" aria-live="polite">Загрузка галереи…</p>
        <div v-if="loadError" class="request-panel">
          <p class="request-status request-status--error" role="alert">{{ loadError }}</p>
          <BaseButton variant="secondary" :disabled="operationsBusy" @click="load">Повторить загрузку</BaseButton>
        </div>
        <template v-if="page === 'catalog'">
          <FilterBar v-model="filters" @reset="resetFilters" />
          <p role="status" aria-live="polite">Найдено работ: {{ filteredItems.length }} из {{ items.length }}</p>
          <BaseButton variant="secondary" :aria-expanded="collectionOpen" aria-controls="catalog-watchlist" @click="collectionOpen = !collectionOpen">{{ collectionOpen ? 'Скрыть отслеживаемые' : `Показать отслеживаемые (${watchCount})` }}</BaseButton>
          <div v-show="collectionOpen" id="catalog-watchlist">
            <WatchlistPanel :items="watchedItems" :totals="collectionTotals" :busy="operationsBusy" @place-bid="openBid" @toggle-watchlist="toggleWatchlist" @clear="watchlist = []" />
          </div>
          <ItemList v-if="!loading && !loadError" :items="filteredItems" :watchlist="watchlist" :busy="operationsBusy" @place-bid="openBid" @toggle-watchlist="toggleWatchlist" @reset="resetFilters" />
        </template>
        <template v-else-if="page === 'detail'">
          <div v-if="selectedNFT" class="detail-gallery">
            <NftCard :id="selectedNFT.id" :title="selectedNFT.title" :creator="selectedNFT.creator"
              :creator-avatar="selectedNFT.creatorAvatar" :network="selectedNFT.network" :current-bid="selectedNFT.currentBid"
              :bids-count="selectedNFT.bidsCount" :is-auction-active="selectedNFT.isAuctionActive" :image-url="selectedNFT.imageUrl"
              :busy="operationsBusy" :watched="watchlist.includes(selectedNFT.id)" @place-bid="openBid" @toggle-watchlist="toggleWatchlist" />
          </div>
          <p v-else-if="!loading" class="content__text">NFT не найден.</p>
          <p><a href="catalog.html" class="section__link">К каталогу</a></p>
        </template>
        <BidForm v-else :items="items" :selected-id="selectedId" :busy="operationsBusy || !serverReady"
          :status="bidStatus" :has-error="bidError" form-id="checkout-bid" @submit="placeBid" />
        <PageSection v-if="page === 'catalog'" id="publish" :busy="busy">
          <template #header><h2 class="section__title">Публикация собственного NFT</h2></template>
          <p class="content__text">Заполните все поля. Новая работа появится в начале каталога и сохранится на сервере.</p>
          <PublishForm :busy="operationsBusy" :status="publishStatus" :has-error="publishError" @submit="publish" />
          <template #footer><a href="#catalog-container" class="section__link">К началу каталога</a></template>
        </PageSection>
      </template>
    </main>
    <aside v-if="page === 'index'" class="page__sidebar notice">
      <h2 class="notice__title">Объявление</h2>
      <p class="notice__text">Комиссия площадки при размещении ставки — 2,5%.</p>
    </aside>
    <AppFooter />
    <BaseModal :open="modalOpen" :busy="busy" title-id="bid-modal-title" @close="modalOpen = false">
      <template #header><h2 id="bid-modal-title">Сделать ставку</h2></template>
      <BidForm v-if="modalOpen" :items="items" :selected-id="selectedId" :busy="operationsBusy || !serverReady"
        :status="bidStatus" :has-error="bidError" form-id="modal-bid" @submit="placeBid" />
      <template #footer><BaseButton variant="secondary" :disabled="busy" @click="modalOpen = false">Закрыть</BaseButton></template>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
.detail-gallery { max-width: 640px; }
</style>
