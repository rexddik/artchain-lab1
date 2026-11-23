<script setup>
import PageSection from './PageSection.vue';
const groups = [
  { network: 'Ethereum', currency: 'ETH', rows: [{ id: '1', title: 'Обь - важная шишка', creator: 'Анна Орловская', price: .25 }, { id: '4', title: 'Мама Обь с сыном Канючкой', creator: 'Анна Орловская', price: .30 }] },
  { network: 'Polygon', currency: 'POL', rows: [{ id: '2', title: 'Котик Канючка', creator: 'Дарья Штром', price: .12 }, { id: '6', title: 'Мама с любимой дочкой', creator: 'Анна Орловская', price: .15 }] },
  { network: 'Solana', currency: 'SOL', rows: [{ id: '3', title: 'Братик Канючка и сестренка Погоныш', creator: 'Анна Орловская', price: .08 }] }
];
</script>

<template>
  <PageSection>
    <template #header><h2 class="section__title">Мой крипто-кошелёк</h2></template>
    <p class="content__text">Коллекция цифровых работ с группировкой по сети блокчейна.</p>
    <div class="table-scroll" tabindex="0" role="region" aria-label="Приобретённые токены">
      <table class="wallet">
        <caption class="wallet__caption">Приобретённые токены</caption>
        <thead class="wallet__head"><tr><th class="wallet__heading" scope="col">Сеть</th><th class="wallet__heading" scope="col">Название работы</th><th class="wallet__heading" scope="col">Автор</th><th class="wallet__heading" scope="col">Стоимость покупки</th></tr></thead>
        <tbody v-for="group in groups" :key="group.network">
          <tr v-for="(item, index) in group.rows" :key="item.id">
            <th v-if="index === 0" :rowspan="group.rows.length" class="wallet__heading" scope="rowgroup">{{ group.network }}</th>
            <td class="wallet__cell">«{{ item.title }}»</td><td class="wallet__cell">{{ item.creator }}</td><td class="wallet__cell">{{ item.price }} {{ group.currency }}</td>
          </tr>
        </tbody>
        <tfoot class="wallet__foot"><tr v-for="group in groups" :key="group.network"><td colspan="3" class="wallet__cell">Итого {{ group.network }}</td><td class="wallet__cell">{{ Number(group.rows.reduce((sum, item) => sum + item.price, 0).toFixed(4)) }} {{ group.currency }}</td></tr></tfoot>
      </table>
    </div>
  </PageSection>
</template>
