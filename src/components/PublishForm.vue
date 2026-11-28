<script setup>
import { computed, reactive, ref, watch } from 'vue';
import BaseButton from './BaseButton.vue';
import { parseAmount, isImagePath } from '../model.js';
const props = defineProps({ busy: { type: Boolean, default: false }, status: { type: String, default: '' }, hasError: { type: Boolean, default: false } });
const emit = defineEmits(['submit']);
const empty = () => ({ title: '', author: '', price: '', image: '', network: 'Ethereum', category: 'Живопись и графика' });
const fields = reactive(empty());
const submitted = ref(false);
const errors = computed(() => {
  const result = {};
  if (!fields.title.trim()) result.title = 'Введите название работы.';
  if (!fields.author.trim()) result.author = 'Введите имя автора.';
  if (!isImagePath(fields.image)) result.image = 'Введите ссылку или путь к изображению, например images/image 11.png.';
  try { parseAmount(fields.price); } catch (error) { result.price = error.message; }
  return result;
});
function submit() {
  submitted.value = true;
  if (!props.busy && !Object.keys(errors.value).length) emit('submit', { ...fields });
}
function reset() { Object.assign(fields, empty()); submitted.value = false; }
watch(() => props.status, value => { if (value.includes('опубликован') && !props.hasError) reset(); });
</script>

<template>
  <form class="content__form bid-form" :aria-busy="busy" novalidate @submit.prevent="submit" @reset.prevent="reset">
    <p class="bid-form__text"><label for="nft-title" class="bid-form__label">Название работы</label><input id="nft-title" v-model.trim="fields.title" name="title" maxlength="120" required :disabled="busy" class="bid-form__input"><span v-if="submitted && errors.title" class="field-error" role="alert">{{ errors.title }}</span></p>
    <p class="bid-form__text"><label for="nft-author" class="bid-form__label">Автор</label><input id="nft-author" v-model.trim="fields.author" name="author" maxlength="100" required :disabled="busy" class="bid-form__input"><span v-if="submitted && errors.author" class="field-error" role="alert">{{ errors.author }}</span></p>
    <p class="bid-form__text"><label for="nft-price" class="bid-form__label">Начальная цена в валюте выбранной сети</label><input id="nft-price" v-model.number="fields.price" type="number" name="price" min="0.0001" step="0.0001" required :disabled="busy" class="bid-form__input"><span v-if="submitted && errors.price" class="field-error" role="alert">{{ errors.price }}</span></p>
    <p class="bid-form__text"><label for="nft-network" class="bid-form__label">Блокчейн-сеть</label><select id="nft-network" v-model="fields.network" :disabled="busy" class="bid-form__input"><option>Ethereum</option><option>Polygon</option><option>Solana</option></select></p>
    <p class="bid-form__text"><label for="nft-image" class="bid-form__label">Ссылка на изображение или путь в проекте</label><input id="nft-image" v-model.trim="fields.image" name="image" placeholder="images/image 11.png" required :disabled="busy" class="bid-form__input"><span v-if="submitted && errors.image" class="field-error" role="alert">{{ errors.image }}</span></p>
    <p class="bid-form__text"><label for="nft-category" class="bid-form__label">Категория</label><select id="nft-category" v-model="fields.category" :disabled="busy" class="bid-form__input"><option>Живопись и графика</option><option>Генеративное искусство</option></select></p>
    <p class="bid-form__text bid-form__text--actions"><BaseButton type="submit" :disabled="busy">{{ busy ? 'Публикация…' : 'Опубликовать NFT' }}</BaseButton><BaseButton type="reset" variant="secondary" :disabled="busy">Очистить форму</BaseButton></p>
  </form>
  <p class="request-status" :class="{ 'request-status--error': hasError }" role="status" aria-live="polite">{{ status }}</p>
</template>

<style scoped>
.field-error { display: block; margin-top: 6px; color: #b42318; }
</style>
