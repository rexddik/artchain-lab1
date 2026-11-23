<script setup>
defineProps({
  type: { type: String, default: 'button', validator: value => ['button', 'submit', 'reset'].includes(value) },
  variant: { type: String, default: 'primary', validator: value => ['primary', 'secondary'].includes(value) },
  disabled: { type: Boolean, default: false }
});
</script>

<template>
  <button :type="type" :disabled="disabled" class="bid-form__button"
          :class="{ 'bid-form__button--secondary': variant === 'secondary' }"><slot /></button>
</template>

<style lang="scss" scoped>
@use '../assets/scss/mixins' as *;
button { min-height: 44px; }
button:focus-visible { @include focus-ring; }
button:disabled { cursor: not-allowed; opacity: .55; }
</style>
