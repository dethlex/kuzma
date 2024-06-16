<template>
  <k-page>
    <Header/>

    <template v-if="!done">
      <k-block strong>
        <p>Analysing your purchases...</p>
      </k-block>
    </template>

    <template v-if="done">
      <k-card header="Recommended investment amount:">
        € {{ tip.recommended.amount }}
      </k-card>

      <k-segmented strong rounded>
        <k-segmented-button
            strong
            rounded
            :active="activeSegmented === 1"
            @click="() => (activeSegmented = 1)"
        >
          Faster to the goal
        </k-segmented-button>
        <k-segmented-button
            strong
            rounded
            :active="activeSegmented === 2"
            @click="() => (activeSegmented = 2)"
        >
          Average result
        </k-segmented-button>
        <k-segmented-button
            strong
            rounded
            :active="activeSegmented === 3"
            @click="() => (activeSegmented = 3)"
        >
          Slowly but surely
        </k-segmented-button>
      </k-segmented>

      <k-list strong>
        <k-list-item
            v-for="item in tip[activeSegmented === 1 ? 'high' : activeSegmented === 2 ? 'medium' : 'low']"
            :title="item['company'] + ' - € ' + item['amount']"/>
      </k-list>


      <k-block-title>Goals</k-block-title>
      <k-block>
        <k-card
            v-for="goal in goals"
            :header="goal.Name"
            header-divider
            :footer="'Until ' + goal.Date.toLocaleDateString()"
        >
          € {{ goal.Current + earnings[activeSegmented] }} | € {{ goal.Total }}
        </k-card>

      </k-block>

      <k-button>Buy via Interactive Brokers</k-button>
    </template>
    <!-- На какие категории потратили больше всего денег-->
    <!-- На чем можно было сэкономить-->
    <!-- Что мне больше всего нравится-->
    <!-- На что я коплю и во что инвестировать на основе этого-->


    <Bottom/>
  </k-page>
</template>

<script setup lang="ts">
import Header from "~/components/Header.vue";
import Bottom from "~/components/Bottom.vue";
import {kBlock, kBlockTitle, kButton, kCard, kPage, kSegmented, kSegmentedButton, kList, kListItem} from 'konsta/vue';

import type {Purchase} from "~/entities/purchase";
import {collection, getDocs} from "firebase/firestore";
import type {Goal} from "~/entities/goal";

const {$firestore, $model} = useNuxtApp()

const tip = ref<any>()

const goals = ref<Goal[]>([])

const activeSegmented = ref(1);
const earnings = ref<number[]>([])

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

  /*

  json:
  {
"recommended" : {"amount": 70},
"high" : [{"company": "Google", "amount": 50}, {"company": "Amazon", "amount": 20}],
"medium" : [{"company": "Apple", "amount": 50}, {"company": "Tesla", "amount": 20}],
"low" : [{"company": "Microsoft", "amount": 50}, {"company": "Facebook", "amount": 20}],
  }

   */

  if (goodPurchases.value.size > 0 && badPurchases.value.size > 0) {
    // tip.value = "Analyzing your purchases..."

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
        '\n\n' + 'Calculate a recommended amount to invest based on the purchases I would save on. ' +
        'Also propose 3 plans with different types of risks (high, medium and low) and possible earnings for investing in companies from the list above based on the amount calculated.' +
        ' Advice should be in plain JSON without any formatting. For example:\n' +
        ' {' +
        '"recommended" : {"amount": 70},' +
        '"high" : [{"company": "Google", "amount": 50, "earnings": 100}, {"company": "Amazon", "amount": 20, "earnings": 100}],' +
        '"medium" : [{"company": "Apple", "amount": 50, "earnings": 70}, {"company": "Tesla", "amount": 20, "earnings": 70}],' +
        '"low" : [{"company": "Microsoft", "amount": 50, "earnings": 50}, {"company": "Facebook", "amount": 20, "earnings": 50}],' +
        '}'

    console.log(prompt)

    $model.generateContent(prompt).then((response) => {
      tip.value = JSON.parse(
          response.response.text().replaceAll("`", '').replaceAll("json", '')
      )

      tip.value.high.forEach((item: any) => {
        earnings.value[1] = item.earnings
      })
      tip.value.medium.forEach((item: any) => {
        earnings.value[2] = item.earnings
      })
      tip.value.low.forEach((item: any) => {
        earnings.value[3] = item.earnings
      })

      done.value = true
    });
  }

})

</script>

