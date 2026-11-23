<script setup>
import PageSection from './PageSection.vue';
</script>

<template>
  <PageSection>
    <template #header><h2 class="section__title">Добро пожаловать в ArtChain</h2></template>
    <p class="section__text">ArtChain — платформа для коллекционеров и авторов цифрового искусства. Здесь можно просматривать NFT-токены, делать ставки на аукционах и публиковать свои работы.</p>
    <p class="section__text">В каталоге представлены работы сетей Ethereum, Polygon и Solana.</p>
  </PageSection>
  <PageSection>
    <template #header><h2 class="section__title">Как это работает</h2></template>
    <ol class="section__list">
      <li class="section__item">Выберите работу в каталоге.</li>
      <li class="section__item">Изучите её автора, сеть и текущую ставку.</li>
      <li class="section__item">Предложите сумму выше текущей цены.</li>
      <li class="section__item">После подтверждения новая ставка появится в каталоге.</li>
    </ol>
    <template #footer><a href="catalog.html" class="section__link">Открыть каталог цифровых работ</a></template>
  </PageSection>
</template>
