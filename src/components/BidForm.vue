<script setup>
import { computed, reactive, ref, watch } from 'vue';
import BaseButton from './BaseButton.vue';
import { parseAmount, currencies } from '../model.js';
const props = defineProps({
  items: { type: Array, required: true }, selectedId: { type: String, default: '' },
  busy: { type: Boolean, default: false }, status: { type: String, default: '' },
  hasError: { type: Boolean, default: false }, formId: { type: String, default: 'bid' }
});
const emit = defineEmits(['submit']);
const activeItems = computed(() => props.items.filter(item => item.isAuctionActive));
const fields = reactive({ nftId: '', bidder: '', amount: '' });
const submitted = ref(false);
watch(() => [props.selectedId, activeItems.value.map(item => item.id).join(',')], () => {
  fields.nftId = activeItems.value.some(item => item.id === props.selectedId) ? props.selectedId
    : activeItems.value.some(item => item.id === fields.nftId) ? fields.nftId : activeItems.value[0]?.id || '';
}, { immediate: true });
const selected = computed(() => activeItems.value.find(item => item.id === fields.nftId));
const errors = computed(() => {
  const result = {};
  if (!selected.value) result.nftId = 'Выберите NFT с активным аукционом.';
  if (!fields.bidder.trim()) result.bidder = 'Введите ваше имя.';
  else if (fields.bidder.length > 100) result.bidder = 'Не более 100 символов.';
  try {
    const amount = parseAmount(fields.amount);
    if (selected.value && amount <= selected.value.currentBid) result.amount = `Ставка должна быть больше ${selected.value.currentBid} ${currencies[selected.value.network]}.`;
  } catch (error) { result.amount = error.message; }
  return result;
});
// Комиссия вычисляется от введённой суммы; валюты не смешиваются.
const commission = computed(() => {
  const amount = Number(fields.amount);
  return Number.isFinite(amount) && amount > 0 && amount <= 1e9 ? Math.round(amount * 0.025 * 1e8) / 1e8 : 0;
});
const total = computed(() => commission.value ? Number(fields.amount) + commission.value : 0);
const format = value => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 8 }).format(value);
function submit() {
  submitted.value = true;
  if (!props.busy && !Object.keys(errors.value).length) emit('submit', { ...fields });
}
watch(() => props.status, value => { if (value.includes('принята') && !props.hasError) { fields.amount = ''; submitted.value = false; } });
</script>

<template>
  <form class="bid-form" :aria-busy="busy" novalidate @submit.prevent="submit">
    <p class="bid-form__text"><label :for="`${formId}-token`" class="bid-form__label">NFT для ставки</label>
      <select :id="`${formId}-token`" v-model="fields.nftId" required :disabled="busy" class="bid-form__input">
        <option v-for="item in activeItems" :key="item.id" :value="item.id">{{ item.title }} — {{ item.currentBid }} {{ currencies[item.network] }}</option>
      </select>
      <span v-if="submitted && errors.nftId" class="field-error" role="alert">{{ errors.nftId }}</span>
    </p>
    <p class="bid-form__text"><label :for="`${formId}-name`" class="bid-form__label">Ваше имя</label>
      <input :id="`${formId}-name`" v-model.trim="fields.bidder" required maxlength="100" :disabled="busy" class="bid-form__input" :aria-invalid="submitted && !!errors.bidder" :aria-describedby="submitted && errors.bidder ? `${formId}-name-error` : undefined">
      <span v-if="submitted && errors.bidder" :id="`${formId}-name-error`" class="field-error" role="alert">{{ errors.bidder }}</span>
    </p>
    <p class="bid-form__text"><label :for="`${formId}-amount`" class="bid-form__label">Сумма ставки в валюте сети NFT</label>
      <input :id="`${formId}-amount`" v-model.number="fields.amount" type="number" min="0.0001" max="1000000000" step="0.0001" required :disabled="busy" class="bid-form__input" :aria-invalid="(submitted || fields.amount !== '') && !!errors.amount" :aria-describedby="`${formId}-amount-hint`">
      <span v-if="(submitted || fields.amount !== '') && errors.amount" class="field-error" role="alert">{{ errors.amount }}</span>
    </p>
    <p :id="`${formId}-amount-hint`">{{ selected ? `Текущая цена: ${selected.currentBid} ${currencies[selected.network]}. Введите большую сумму.` : 'Нет NFT, доступных для ставки.' }}</p>
    <div v-if="selected" class="fee-summary" aria-live="polite">
      <p>Комиссия площадки (2,5%): <strong>{{ format(commission) }} {{ currencies[selected.network] }}</strong></p>
      <p>Ставка с учётом комиссии: <strong>{{ format(total) }} {{ currencies[selected.network] }}</strong></p>
      <p>Комиссия показана как расчёт; списание средств в учебном приложении не выполняется.</p>
    </div>
    <p class="bid-form__text bid-form__text--actions"><BaseButton type="submit" :disabled="busy || !selected">{{ busy ? 'Отправка ставки…' : 'Отправить ставку' }}</BaseButton></p>
    <p v-if="status" class="request-status" :class="{ 'request-status--error': hasError }" role="status" aria-live="polite">{{ status }}</p>
  </form>
</template>

<style scoped>
.field-error { display: block; margin-top: 6px; color: #b42318; }
.fee-summary { background: #f3f0ff; padding: 12px 16px; border-radius: 6px; }
.fee-summary p { margin: 6px 0; }
</style>
