<script setup>
import { computed, reactive, watch } from 'vue';
import BaseButton from './BaseButton.vue';
const props = defineProps({
  items: { type: Array, required: true },
  selectedId: { type: String, default: '' },
  busy: { type: Boolean, default: false },
  status: { type: String, default: '' },
  hasError: { type: Boolean, default: false },
  formId: { type: String, default: 'bid' }
});
const emit = defineEmits(['submit']);
const activeItems = computed(() => props.items.filter(item => item.isAuctionActive));
const fields = reactive({ nftId: '', bidder: '', amount: '' });
const currencies = { Ethereum: 'ETH', Polygon: 'POL', Solana: 'SOL' };
watch(() => [props.selectedId, activeItems.value.map(item => item.id).join(',')], () => {
  fields.nftId = activeItems.value.some(item => item.id === props.selectedId) ? props.selectedId
    : activeItems.value.some(item => item.id === fields.nftId) ? fields.nftId : activeItems.value[0]?.id || '';
}, { immediate: true });
const selected = computed(() => props.items.find(item => item.id === fields.nftId));
watch(() => props.status, value => { if (value.includes('принята')) fields.amount = ''; });
</script>

<template>
  <form class="bid-form" :aria-busy="busy" @submit.prevent="emit('submit', { ...fields })">
    <p class="bid-form__text"><label :for="`${formId}-token`" class="bid-form__label">NFT для ставки</label>
      <select :id="`${formId}-token`" v-model="fields.nftId" name="nftId" required :disabled="busy" class="bid-form__input">
        <option v-for="item in activeItems" :key="item.id" :value="item.id">{{ item.title }} — {{ item.currentBid }} {{ currencies[item.network] }}</option>
      </select>
    </p>
    <p class="bid-form__text"><label :for="`${formId}-name`" class="bid-form__label">Ваше имя</label>
      <input :id="`${formId}-name`" v-model="fields.bidder" name="bidder" required maxlength="100" :disabled="busy" class="bid-form__input">
    </p>
    <p class="bid-form__text"><label :for="`${formId}-amount`" class="bid-form__label">Сумма ставки в валюте сети NFT</label>
      <input :id="`${formId}-amount`" v-model="fields.amount" name="amount" type="number" min="0.0001" step="0.0001" required :disabled="busy" class="bid-form__input">
    </p>
    <p class="bid-form__text">{{ selected ? `Текущая цена: ${selected.currentBid} ${currencies[selected.network]}. Введите большую сумму.` : 'Нет NFT, доступных для ставки.' }}</p>
    <p class="bid-form__text bid-form__text--actions"><BaseButton type="submit" :disabled="busy || !selected">{{ busy ? 'Отправка ставки…' : 'Отправить ставку' }}</BaseButton></p>
    <p class="bid-form__text request-status" :class="{ 'request-status--error': hasError }" role="status" aria-live="polite">{{ status }}</p>
  </form>
</template>
