<script setup>
import NftCard from './NftCard.vue';
import PageSection from './PageSection.vue';
import BaseButton from './BaseButton.vue';
defineProps({
  items: { type: Array, required: true },
  watchlist: { type: Array, default: () => [] },
  busy: { type: Boolean, default: false }
});
defineEmits(['place-bid', 'toggle-watchlist', 'reset']);
</script>

<template>
  <div id="catalog-container" :aria-busy="busy">
    <PageSection v-if="items.length > 0" :busy="busy">
      <template #header><h2 class="section__title">Цифровые работы</h2></template>
      <div class="section__gallery">
        <NftCard v-for="item in items" :key="item.id"
          :id="item.id" :title="item.title" :creator="item.creator" :creator-avatar="item.creatorAvatar"
          :network="item.network" :current-bid="item.currentBid" :bids-count="item.bidsCount"
          :is-auction-active="item.isAuctionActive" :image-url="item.imageUrl" :busy="busy" :watched="watchlist.includes(item.id)"
          @place-bid="$emit('place-bid', $event)" @toggle-watchlist="$emit('toggle-watchlist', $event)" />
      </div>
    </PageSection>
    <div v-else class="empty-state" role="status">
      <p>По вашему запросу ничего не найдено</p>
      <BaseButton variant="secondary" @click="$emit('reset')">Сбросить фильтры</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.empty-state { background: white; border: 1px solid #ccd0e0; border-radius: 8px; padding: 24px; }
</style>
