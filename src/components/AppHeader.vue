<script setup>
defineProps({
  activePage: { type: String, default: 'catalog' },
  title: { type: String, default: 'ArtChain' }
});
const links = [
  { id: 'index', label: 'Главная', href: 'index.html' },
  { id: 'catalog', label: 'Каталог работ', href: 'catalog.html' },
  { id: 'detail', label: 'Карточка работы', href: 'detail.html' },
  { id: 'collection', label: 'Мой кошелёк', href: 'collection.html' },
  { id: 'checkout', label: 'Сделать ставку', href: 'checkout.html' }
];
</script>

<template>
  <header class="page__header header">
    <h1 class="header__title">{{ title }}</h1>
    <p class="header__text">Маркетплейс цифрового искусства и NFT-токенов</p>
  </header>
  <nav class="page__menu menu" aria-label="Основная навигация">
    <ul class="menu__list">
      <li v-for="link in links" :key="link.id" class="menu__item">
        <a :href="link.href" class="menu__link"
           :class="{ 'menu__link--active': activePage === link.id }"
           :aria-current="activePage === link.id ? 'page' : undefined">{{ link.label }}</a>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.header { padding: 32px; background: #4935a2; color: #fff; }
.header__title { margin: 0 0 8px; font-size: 30px; }
.header__text { margin: 0; }
@media (min-width: 1200px) {
  .header { display: flex; justify-content: space-between; align-items: center; gap: 24px; }
  .header__title { margin: 0; }
  .header__text { max-width: 65%; text-align: right; }
}
</style>
