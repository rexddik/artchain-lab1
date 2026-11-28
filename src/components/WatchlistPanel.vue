<script setup>
import NftCard from './NftCard.vue';
import BaseButton from './BaseButton.vue';
defineProps({ items: { type: Array, required: true }, totals: { type: Array, required: true }, busy: Boolean });
defineEmits(['place-bid', 'toggle-watchlist', 'clear']);
const format = value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 4 }).format(value);
</script>

<template>
  <section class="watchlist section" aria-labelledby="watchlist-title">
    <h2 id="watchlist-title">Отслеживаемые NFT — {{ items.length }}</h2>
    <template v-if="items.length">
      <p>Суммарная оценка по текущим ставкам:</p>
      <ul><li v-for="total in totals" :key="total.network">{{ total.network }}: <strong>{{ format(total.amount) }} {{ total.currency }}</strong></li></ul>
      <p>Разные валюты учитываются отдельно, без пересчёта по курсу.</p>
      <BaseButton variant="secondary" :disabled="busy" @click="$emit('clear')">Очистить отслеживаемые</BaseButton>
      <div class="section__gallery watchlist__grid">
        <NftCard v-for="item in items" :key="item.id" v-bind="item" :watched="true" :busy="busy"
          @place-bid="$emit('place-bid', $event)" @toggle-watchlist="$emit('toggle-watchlist', $event)" />
      </div>
    </template>
    <p v-else>Пока ничего не отслеживается. Добавьте работы кнопкой «Отслеживать» в каталоге.</p>
  </section>
</template>

<style scoped>
.watchlist { margin: 20px 0; background: white; border: 1px solid #ccd0e0; border-radius: 8px; padding: 20px; }
.watchlist__grid { margin-top: 20px; }
</style>
