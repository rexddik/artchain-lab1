<script setup>
defineProps({
  year: { type: Number, default: () => new Date().getFullYear() },
  email: { type: String, default: 'support@artchain.example' }
});
</script>

<template>
  <footer class="page__footer footer">
    <p class="footer__text">© {{ year }} ArtChain. Все права защищены.</p>
    <p class="footer__text">Связь: <a :href="`mailto:${email}`" class="footer__link">{{ email }}</a></p>
  </footer>
</template>

<style lang="scss" scoped>
.footer { padding: 16px; border-top: 1px solid #cdd1dc; background: #fff; }
.footer__text { margin: 4px 0; }
</style>
