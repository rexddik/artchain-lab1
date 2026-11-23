<script setup>
defineProps({
  variant: { type: String, default: 'neutral', validator: value => ['neutral', 'success', 'muted'].includes(value) }
});
</script>

<template>
  <span class="base-badge" :class="`base-badge_${variant}`"><slot /></span>
</template>

<style lang="scss" scoped>
.base-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px; border: 1px solid transparent; border-radius: 5px; font-size: 12px; font-weight: 700; }
.base-badge_neutral { background: #eeebfa; color: #4935a2; }
.base-badge_success { background: #e5f4eb; color: #245d3c; }
.base-badge_muted { background: #eeeeef; color: #545c70; }
</style>
