<script setup>
import { computed } from 'vue';
import BaseButton from './BaseButton.vue';
import BaseBadge from './BaseBadge.vue';
import NetworkBadge from './NetworkBadge.vue';
const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  creator: { type: String, required: true },
  network: { type: String, required: true, validator: value => ['Ethereum', 'Polygon', 'Solana'].includes(value) },
  currentBid: { type: Number, required: true, validator: value => Number.isFinite(value) && value >= 0 },
  bidsCount: { type: Number, required: true, validator: value => Number.isInteger(value) && value >= 0 },
  isAuctionActive: { type: Boolean, required: true },
  imageUrl: { type: String, required: true },
  creatorAvatar: { type: String, default: 'images/avatar-maria.svg' },
  busy: { type: Boolean, default: false },
  watched: { type: Boolean, default: false }
});
defineEmits(['place-bid', 'toggle-watchlist']);
const logos = { Ethereum: 'images/logo/ethereum.png', Polygon: 'images/logo/polygon.png', Solana: 'images/logo/solana.png' };
const currencies = { Ethereum: 'ETH', Polygon: 'POL', Solana: 'SOL' };
const formattedBid = computed(() => `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 4 }).format(props.currentBid)} ${currencies[props.network]}`);
</script>

<template>
  <article class="section__card card nft-card" :class="{ 'nft-card_inactive': !isAuctionActive }" :data-id="id">
    <div class="card__media">
      <img class="card__image" :src="imageUrl" :alt="`Работа «${title}»`" width="640" height="360">
      <img class="card__network" :src="logos[network]" :alt="`Сеть ${network}`" width="36" height="36">
    </div>
    <h3 class="card__title">«{{ title }}»</h3>
    <div class="card__summary">
      <div class="card__author">
        <img class="card__avatar" :src="creatorAvatar" alt="" width="48" height="48">
        <p class="card__text">Автор: <strong>{{ creator }}</strong></p>
      </div>
      <p class="card__bid">Текущая ставка: <strong>{{ formattedBid }}</strong></p>
    </div>
    <p class="card__text">Сеть блокчейна:
      <NetworkBadge :network="network" :class="'network-badge_' + network.toLowerCase()" />
    </p>
    <p class="card__text">Количество ставок: {{ bidsCount }}</p>
    <BaseBadge v-if="!isAuctionActive" variant="muted">Аукцион завершён</BaseBadge>
    <div class="card__actions">
      <a :href="`detail.html?id=${encodeURIComponent(id)}`" class="card__link">Подробнее о работе</a>
      <BaseButton :disabled="!isAuctionActive || busy" @click.stop="$emit('place-bid', id)">Сделать ставку</BaseButton>
      <BaseButton variant="secondary" :aria-pressed="watched" @click.stop="$emit('toggle-watchlist', id)">{{ watched ? 'Убрать из отслеживаемых' : 'Отслеживать' }}</BaseButton>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.nft-card_inactive { background: #f5f5f7; }
.card__actions { margin-top: auto; display: flex; flex-direction: column; gap: 12px; }
.card__actions :deep(button) { width: 100%; }
</style>
