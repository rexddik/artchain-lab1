<script setup>
defineProps({
  id: { type: String, default: undefined },
  busy: { type: Boolean, default: false }
});
</script>

<template>
  <section :id="id" class="content__section section" :aria-busy="busy">
    <header v-if="$slots.header" class="section__header"><slot name="header" /></header>
    <slot />
    <footer v-if="$slots.footer" class="section__footer"><slot name="footer" /></footer>
  </section>
</template>

<style lang="scss" scoped>
.section__footer { margin-top: 16px; }
</style>
