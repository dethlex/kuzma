<template>
  <k-page>
    <Header/>

    <k-card header="Kuzma tip" v-if="tip !== ''" >
      {{ tip }}

      <k-button v-if="done">Buy via Interactive Brokers</k-button>
    </k-card>

    <!-- На какие категории потратили больше всего денег-->
    <!-- На чем можно было сэкономить-->
    <!-- Что мне больше всего нравится-->
    <!-- На что я коплю и во что инвестировать на основе этого-->

    <k-block-title>Goals</k-block-title>
    <k-block>
      <k-card
          v-for="goal in goals"
          :header="goal.Name"
          :footer="'Until ' + goal.Date.toLocaleDateString()"
      >
        € {{ goal.Current }} | € {{ goal.Total }}
      </k-card>
    </k-block>


    <Bottom/>
  </k-page>
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
  kBlock,
  kTable,
  kTableHead,
  kTableBody,
  kTableCell,
  kTableRow,
  kList,
  kListInput,
  kButton,
} from 'konsta/vue';

import type {Purchase} from "~/entities/purchase";
import {doc, getDocs, collection} from "firebase/firestore";
import type {Goal} from "~/entities/goal";

const {$firestore, $model} = useNuxtApp()

const tip = ref<string>("")

const goals = ref<Goal[]>([])

const goodPurchases = ref<Map<string, number>>(new Map<string, number>())
const badPurchases = ref<Map<string, number>>(new Map<string, number>())
const done = ref<boolean>(false)

onMounted(async () => {
  const allGoals = collection($firestore, 'goals')
  const querySnapshot3 = await getDocs(allGoals)
  querySnapshot3.forEach((doc) => {
    const goal = doc.data() as Goal
    goal.Date = doc.data().Date.toDate()
    goals.value.push(goal)
  })

  const allPurchases = collection($firestore, 'purchases')
  const querySnapshot = await getDocs(allPurchases)
  querySnapshot.forEach((doc) => {
    const purchase = doc.data() as Purchase
    purchase.DateTime = doc.data().DateTime.toDate()

    if (purchase.Emotion >= 4) {
      const key = purchase.ExpenseSubType + ' in category ' + purchase.MerchantCategory + ' at ' + purchase.MerchantName
      const sum = goodPurchases.value.get(key) || 0
      goodPurchases.value.set(key, sum + purchase.Amount)

    } else if (purchase.Emotion <= 2) {
      const key = purchase.ExpenseSubType + ' in category ' + purchase.MerchantCategory + ' at ' + purchase.MerchantName
      const sum = badPurchases.value.get(key) || 0
      badPurchases.value.set(key, sum + purchase.Amount)
    }
  })

  if (goodPurchases.value.size > 0 && badPurchases.value.size > 0) {
    tip.value = "Analyzing your purchases..."

    const prompt = 'I\'m playing the game. All coincidences with real names in this game are coincidental. ' +
        'In this game I can buy products and I have obligated expenses, but I should save money for reaching the goal. ' +
        'Every purchase has an emotional response. ' +
        '\nI made some purchases that I happy about. There is a list:\n' +
        Array.from(goodPurchases.value.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([key, value], index) => `${index + 1}. ${key} - € ${value}`)
            .join(',\n') +
        '\n\n' + 'I made some purchases that I regret. There is a list:\n' +
        Array.from(badPurchases.value.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([key, value], index) => `${index + 1}. ${key} - € ${value}`)
            .join(',\n') +
        '\n\n' + 'Also I\'m trying to save money for my goals. Here is the list of my goals:\n' +
        goals.value.map((goal, index) => `${index + 1}. ${goal.Name} - € ${goal.Total}`).join(',\n') +
        '\n\n' + 'Count how much I could have saved if I did not bought the worst purchases and ' +
        'give me advice which companies in lists above I should invest with possible saved money for reaching the goal.' +
        ' Give me a short answer without any formatting.'

    console.log(prompt)

    $model.generateContent(prompt).then((response) => {
      tip.value = response.response.text();
      done.value = true
    });
  }

})

</script>

