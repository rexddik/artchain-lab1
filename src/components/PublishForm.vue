<script setup>
import { reactive, watch } from 'vue';
import BaseButton from './BaseButton.vue';
const props = defineProps({ busy: { type: Boolean, default: false }, status: { type: String, default: '' }, hasError: { type: Boolean, default: false } });
const emit = defineEmits(['submit']);
const empty = () => ({ title: '', author: '', price: '', image: '', network: 'Ethereum', category: 'Живопись и графика' });
const fields = reactive(empty());
watch(() => props.status, value => { if (value.includes('опубликован')) Object.assign(fields, empty()); });
</script>

<template>
  <form class="content__form bid-form" :aria-busy="busy" @submit.prevent="emit('submit', { ...fields })" @reset="Object.assign(fields, empty())">
    <p class="bid-form__text"><label for="nft-title" class="bid-form__label">Название работы</label><input id="nft-title" v-model="fields.title" name="title" maxlength="120" required :disabled="busy" class="bid-form__input"></p>
    <p class="bid-form__text"><label for="nft-author" class="bid-form__label">Автор</label><input id="nft-author" v-model="fields.author" name="author" maxlength="100" required :disabled="busy" class="bid-form__input"></p>
    <p class="bid-form__text"><label for="nft-price" class="bid-form__label">Начальная цена в валюте выбранной сети</label><input id="nft-price" v-model="fields.price" type="number" name="price" min="0.0001" step="0.0001" required :disabled="busy" class="bid-form__input"></p>
    <p class="bid-form__text"><label for="nft-network" class="bid-form__label">Блокчейн-сеть</label><select id="nft-network" v-model="fields.network" :disabled="busy" class="bid-form__input"><option>Ethereum</option><option>Polygon</option><option>Solana</option></select></p>
    <p class="bid-form__text"><label for="nft-image" class="bid-form__label">Ссылка на изображение или путь в проекте</label><input id="nft-image" v-model="fields.image" name="image" placeholder="images/image 11.png" required :disabled="busy" class="bid-form__input"></p>
    <p class="bid-form__text"><label for="nft-category" class="bid-form__label">Категория</label><select id="nft-category" v-model="fields.category" :disabled="busy" class="bid-form__input"><option>Живопись и графика</option><option>Генеративное искусство</option></select></p>
    <p class="bid-form__text bid-form__text--actions"><BaseButton type="submit" :disabled="busy">{{ busy ? 'Публикация…' : 'Опубликовать NFT' }}</BaseButton><BaseButton type="reset" variant="secondary" :disabled="busy">Очистить форму</BaseButton></p>
  </form>
  <p class="request-status" :class="{ 'request-status--error': hasError }" role="status" aria-live="polite">{{ status }}</p>
</template>
