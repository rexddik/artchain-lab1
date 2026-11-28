<script setup>
import { reactive, watch } from 'vue';
import BaseButton from './BaseButton.vue';
const props = defineProps({ modelValue: { type: Object, required: true } });
const emit = defineEmits(['update:modelValue', 'reset']);
const fields = reactive({ ...props.modelValue });
watch(() => props.modelValue, value => Object.assign(fields, value), { deep: true });
function update() { emit('update:modelValue', { ...fields }); }
</script>

<template>
  <form class="filter-bar" role="search" @submit.prevent @input="update" @change="update">
    <label>Поиск по названию или автору
      <input v-model.trim="fields.search" type="search" maxlength="120" class="bid-form__input" placeholder="Например, Канючка или Штром">
    </label>
    <label>Блокчейн-сеть
      <select v-model="fields.network" class="bid-form__input">
        <option value="all">Все сети</option><option>Ethereum</option><option>Polygon</option><option>Solana</option>
      </select>
    </label>
    <label>Сортировка
      <select v-model="fields.sort" class="bid-form__input">
        <option value="default">Порядок каталога</option>
        <option value="price-asc">Ставка: по возрастанию</option><option value="price-desc">Ставка: по убыванию</option>
        <option value="bids-asc">Количество ставок: по возрастанию</option><option value="bids-desc">Количество ставок: по убыванию</option>
      </select>
    </label>
    <label class="filter-bar__check"><input v-model="fields.onlyActive" type="checkbox"> Аукцион активен</label>
    <BaseButton variant="secondary" @click="emit('reset')">Сбросить фильтры</BaseButton>
    <p class="filter-bar__note">Для сравнения цен в одной валюте выберите сеть. Во всех сетях сортировка сравнивает числовые значения ставок.</p>
  </form>
</template>

<style scoped>
.filter-bar { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; background: white; border: 1px solid #ccd0e0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
label { display: flex; flex-direction: column; gap: 8px; font-weight: 600; }
.filter-bar__check { flex-direction: row; align-items: center; }
.filter-bar__note { grid-column: 1 / -1; margin: 0; font-size: 14px; }
@media (max-width: 760px) { .filter-bar { grid-template-columns: 1fr; } }
</style>
