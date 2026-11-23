<script setup>
import BaseBadge from './BaseBadge.vue';
defineProps({
  network: { type: String, required: true, validator: value => ['Ethereum', 'Polygon', 'Solana'].includes(value) }
});
</script>

<template>
  <BaseBadge class="network-badge"><slot>{{ network }}</slot></BaseBadge>
</template>

<style lang="scss" scoped>
.network-badge_ethereum { background: #e9edff; color: #334b91; border-color: #b9c5ef; }
.network-badge_polygon { background: #f0e7ff; color: #7134af; border-color: #d2b8ef; }
.network-badge_solana { background: #e0f7ef; color: #15694f; border-color: #9edac4; }
</style>
