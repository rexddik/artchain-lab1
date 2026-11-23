<script setup>
import BaseButton from './BaseButton.vue';
defineProps({
  open: { type: Boolean, default: false },
  busy: { type: Boolean, default: false },
  titleId: { type: String, default: 'modal-title' }
});
defineEmits(['close']);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop" @click.self="!busy && $emit('close')" @keydown.esc.prevent="!busy && $emit('close')">
      <section class="base-modal" role="dialog" aria-modal="true" :aria-labelledby="titleId">
        <header><slot name="header" /></header>
        <slot />
        <footer class="base-modal__footer"><slot name="footer"><BaseButton variant="secondary" :disabled="busy" @click="$emit('close')">Закрыть</BaseButton></slot></footer>
      </section>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 16px; background: rgb(0 0 0 / .4); font-family: Arial, sans-serif; }
.base-modal { width: min(600px, 100%); max-height: 90vh; overflow: auto; background: white; color: #222632; border-radius: 8px; padding: 24px; }
.base-modal__footer { margin-top: 16px; }
</style>
