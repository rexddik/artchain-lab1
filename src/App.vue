<script setup>
import { computed, onMounted, ref } from 'vue';
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
import WalletPage from './components/WalletPage.vue';
import { useGallery } from './composables/useGallery.js';

const pages = ['index', 'catalog', 'detail', 'collection', 'checkout'];
const filename = window.location.pathname.split('/').pop()?.replace('.html', '') || 'index';
const page = pages.includes(filename) ? filename : 'index';
const query = new URLSearchParams(window.location.search);
const selectedId = ref(query.get('nftId') || '');
const modalOpen = ref(false);
const { items, loading, busy, loadError, bidStatus, bidError, publishStatus, publishError, message, serverReady, load, placeBid, publish } = useGallery();
const selectedNFT = computed(() => query.has('id') ? items.value.find(item => item.id === query.get('id')) : items.value[0]);
const operationsBusy = computed(() => loading.value || busy.value);
function openBid(id) {
  selectedId.value = id;
  bidStatus.value = '';
  bidError.value = false;
  modalOpen.value = true;
}
onMounted(() => { if (['catalog', 'detail', 'checkout'].includes(page)) load(); });
</script>

<template>
  <div class="page" :class="{ 'page--with-sidebar': page === 'index' }">
    <a class="page__skip-link" href="#main-content">Перейти к содержимому</a>
    <AppHeader :active-page="page" />
    <main id="main-content" class="page__content content" tabindex="-1">
      <HomePage v-if="page === 'index'" />
      <WalletPage v-else-if="page === 'collection'" />
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
        <ItemList v-if="page === 'catalog'" :items="items" :busy="operationsBusy" @bid="openBid" />
        <template v-else-if="page === 'detail'">
          <div v-if="selectedNFT" class="detail-gallery">
            <NftCard :id="selectedNFT.id" :title="selectedNFT.title" :creator="selectedNFT.creator"
              :creator-avatar="selectedNFT.creatorAvatar" :network="selectedNFT.network" :current-bid="selectedNFT.currentBid"
              :bids-count="selectedNFT.bidsCount" :is-auction-active="selectedNFT.isAuctionActive" :image-url="selectedNFT.imageUrl"
              :busy="operationsBusy" @bid="openBid" />
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
      <p class="notice__text">С 1 по 15 число каждого месяца комиссия площадки снижена до 1,5%.</p>
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
