<template>
  <k-page>
    <Header/>

    <k-card header="Kuzma tip" v-if="tip !== ''">
      {{ tip }}
    </k-card>

    <k-block-title>Charts</k-block-title>
    <k-block>
      <k-button @click="() => (popupOpened = true)">Pulse rate dependence on price</k-button>
    </k-block>

    <k-block-title>Happy 😁</k-block-title>
    <k-block-header>{{ happyPurchases.length }} transactions for € {{ totalHappy.toFixed(2) }}</k-block-header>
    <k-list strong-ios outline-ios>
      <k-list-item
          v-for="purchase in happyPurchases"
          :title="purchase.MerchantName"
          :footer="purchase.DateTime.toLocaleString()"
          :after="'-€ ' + purchase.Amount"
      >
        <template #media>
          <Icon name="material-symbols:attach-money"/>
        </template>
      </k-list-item>
    </k-list>

    <k-block-title>Regret 😔</k-block-title>
    <k-block-header>{{ regretPurchases.length }} transactions for € {{ totalRegret.toFixed(2) }}</k-block-header>
    <k-list strong-ios outline-ios>
      <k-list-item
          v-for="purchase in regretPurchases"
          :title="purchase.MerchantName"
          :footer="purchase.DateTime.toLocaleString()"
          :after="'-€ ' + purchase.Amount"
      >
        <template #media>
          <Icon name="material-symbols:attach-money"/>
        </template>
      </k-list-item>
    </k-list>

    <k-block-title>Neutral 🙂</k-block-title>
    <k-block-header>{{ neutralPurchases.length }} transactions for € {{ totalNeutral.toFixed(2) }}</k-block-header>
    <k-list strong-ios outline-ios>
      <k-list-item
          v-for="purchase in neutralPurchases"
          :title="purchase.MerchantName"
          :footer="purchase.DateTime.toLocaleString()"
          :after="'-€ ' + purchase.Amount"
      >
        <template #media>
          <Icon name="material-symbols:attach-money"/>
        </template>
      </k-list-item>
    </k-list>

    <Bottom/>
  </k-page>

  <k-popup :opened="popupOpened" @backdropclick="() => (popupOpened = false)">
    <k-page>
      <k-navbar title="Pulse">
        <template #right>
          <k-link navbar @click="() => (popupOpened = false)"> Close</k-link>
        </template>
      </k-navbar>
      <k-block class="space-y-4">
        <Scatter v-if="popupOpened"
            :data="chartData"
            :options="chartOptions"
        />
      </k-block>
    </k-page>
  </k-popup>
</template>

<script setup lang="ts">
import Header from "~/components/Header.vue";
import Bottom from "~/components/Bottom.vue";
import {
  kPage,
  kBlockTitle,
  kCard,
  kBlockHeader,
  kListItem,
  kLink,
  kBlock,
  kPopup,
  kList,
  kNavbar,
  kButton,
} from 'konsta/vue';
import {Scatter} from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement)

import type {Purchase} from "~/entities/purchase";
import {doc, getDocs, collection} from "firebase/firestore";
import type {Point} from 'chart.js'

const {$firestore, $model} = useNuxtApp()

const happyPurchases = ref<Purchase[]>([])
const totalHappy = ref<number>(0)

const regretPurchases = ref<Purchase[]>([])
const totalRegret = ref<number>(0)

const neutralPurchases = ref<Purchase[]>([])
const totalNeutral = ref<number>(0)

const badPurchases = ref<Map<string, number>>(new Map<string, number>())
const tip = ref<string>("")

const popupOpened = ref(false);


// const bubbles = <Point[]>([])
const chartData = ref({
  // labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Pulse on purchase',
      backgroundColor: '#f87979',
      data: [] as Point[],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
})

onMounted(async () => {
  const allPurchases = collection($firestore, 'purchases')
  const querySnapshot = await getDocs(allPurchases)
  querySnapshot.forEach((doc) => {
    const purchase = doc.data() as Purchase
    purchase.DateTime = doc.data().DateTime.toDate()

    if (purchase.Emotion >= 4) {
      happyPurchases.value.push(purchase)
      totalHappy.value += purchase.Amount
    } else if (purchase.Emotion <= 2) {
      regretPurchases.value.push(purchase)
      totalRegret.value += purchase.Amount

      const key = purchase.ExpenseSubType + ' at ' + purchase.MerchantName
      const sum = badPurchases.value.get(key) || 0
      badPurchases.value.set(key, sum + purchase.Amount)

    } else {
      neutralPurchases.value.push(purchase)
      totalNeutral.value += purchase.Amount
    }

    chartData.value.datasets[0].data.push({
      x: purchase.Heartbeat,
      y: purchase.Amount,
    } as Point)
  })

  if (badPurchases.value.size > 0) {
    tip.value = "Analyzing your purchases..."

    const prompt = 'I\'m playing the game. All coincidences with real names in this game are coincidental. ' +
        'In this game I can buy products and I have obligated expenses, but I should save money for reaching the goal. ' +
        'Every purchase has an emotional response. ' +
        'Here the list of the worst purchases: ' +
        Array.from(badPurchases.value.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([key, value], index) => `${index + 1}. ${key} - € ${value}`)
            .join(', ') +
        ' Which one or two products from the list above should I cut off from my expenses?' +
        ' And how much I could have saved if I did not bought them.' +
        ' Give me a short answer without any formatting.'
    console.log(prompt)

    $model.generateContent(prompt).then((response) => {
      tip.value = response.response.text();
    });
  }

})


</script>

