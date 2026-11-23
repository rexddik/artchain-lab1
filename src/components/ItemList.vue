<script setup>
import { computed } from 'vue';
import NftCard from './NftCard.vue';
import PageSection from './PageSection.vue';
const props = defineProps({
  items: { type: Array, required: true, validator: value => value.every(item => item && typeof item.id === 'string') },
  busy: { type: Boolean, default: false }
});
defineEmits(['bid']);
const categories = computed(() => [...new Set(props.items.map(item => item.category))]);
</script>

<template>
  <div id="catalog-container" :aria-busy="busy">
    <p v-if="!items.length" class="content__text">В галерее пока нет NFT.</p>
    <PageSection v-for="category in categories" :key="category">
      <template #header><h2 class="section__title">{{ category }}</h2></template>
      <div class="section__gallery">
        <NftCard v-for="item in items.filter(token => token.category === category)" :key="item.id"
                 :id="item.id" :title="item.title" :creator="item.creator" :creator-avatar="item.creatorAvatar"
                 :network="item.network" :current-bid="item.currentBid" :bids-count="item.bidsCount"
                 :is-auction-active="item.isAuctionActive" :image-url="item.imageUrl" :busy="busy"
                 @bid="$emit('bid', $event)" />
      </div>
    </PageSection>
  </div>
</template>
