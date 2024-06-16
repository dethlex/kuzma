<template>
  <k-page>
    <Header/>

    <k-button @click="() => (popupBudgetOpened = true)">Add budget</k-button>
    <!--    <k-button @click="() => (popupGoalOpened = true)">Add goal</k-button>-->

    <k-popup :opened="popupBudgetOpened" @backdropclick="() => (popupBudgetOpened = false)">
      <k-page>
        <k-navbar title="Popup">
          <template #right>
            <k-link navbar @click="() => (popupBudgetOpened = false)"> Close</k-link>
          </template>
        </k-navbar>
        <k-block class="space-y-4">
          <k-list inset-ios strong-ios>
            <k-list-input
                label="Name" type="text" placeholder="Add name"
                :value="newBudget.Name"
                @input="newBudget.Name = $event.target.value"
            />

            <k-list-input
                label="Period"
                type="select"
                dropdown
                default-value="Month"
                placeholder="Please choose..."
                :value="newBudget.Period"
                @input="newBudget.Period = $event.target.value"
            >
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </k-list-input>

            <k-list-input
                label="Limit" type="number" placeholder="Add limit"
                :value="newBudget.Limit"
                @input="newBudget.Limit = $event.target.value"
            />

            <k-list-input
                label="Repeat every"
                type="select"
                dropdown
                default-value="Month"
                placeholder="Please choose..."
                :value="newBudget.RepeatEvery"
                @input="newBudget.RepeatEvery = $event.target.value"
            >
              <option value="1">1 Month</option>
              <option value="2">2 Months</option>
              <option value="6">6 Months</option>
              <option value="12">Year</option>
            </k-list-input>

          </k-list>

          <k-button @click="save">Save</k-button>

        </k-block>
      </k-page>
    </k-popup>

    <k-block-title>Budgets</k-block-title>
    <k-block v-for="b in budgets">
      <k-card
          v-for="[k, v] in purchases"
          :header="k">
<!--        <k-link :href="'/budget/' + k.toLowerCase().replaceAll(' ', '_')">-->
          € {{ v.toFixed(2) }} | € {{ b.Limit }}
<!--        </k-link>-->
      </k-card>

    </k-block>


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
// Konsta UI components
import {
  kPage,
  kNavbar,
  kBlock,
  kButton,
  kPopup,
  kCard,
  kList,
  kListItem,
  kListInput,
  kLink,
  kBlockTitle,
} from 'konsta/vue';
import Header from "~/components/Header.vue";
import Bottom from "~/components/Bottom.vue";
import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import type {Budget} from "~/entities/budget";
import type {Purchase} from "~/entities/purchase";
import type {Goal} from "~/entities/goal";

const {$firestore} = useNuxtApp()

const popupBudgetOpened = ref(false);
const popupGoalOpened = ref(false);

const newBudget = ref<Budget>({} as Budget)

function save() {
  setDoc(doc(collection($firestore, "budgets")), newBudget.value)
  popupBudgetOpened.value = false
}

const budgets = ref<Budget[]>([])
const purchases = ref<Map<string, number>>(new Map<string, number>())
const goals = ref<Goal[]>([])

onMounted(async () => {
  const allBudgets = collection($firestore, 'budgets')
  const querySnapshot = await getDocs(allBudgets)
  querySnapshot.forEach((doc) => {
    budgets.value.push(doc.data() as Budget)
  })

  const allPurchases = collection($firestore, 'purchases')
  const querySnapshot2 = await getDocs(allPurchases)
  querySnapshot2.forEach((doc) => {
    const purchase = doc.data() as Purchase
    purchase.DateTime = doc.data().DateTime.toDate()

    const key = getMonthName(purchase.DateTime.getMonth()) + ' ' + purchase.DateTime.getFullYear()
    const sum = purchases.value.get(key) || 0
    purchases.value.set(key, sum + purchase.Amount)
  })

  const allGoals = collection($firestore, 'goals')
  const querySnapshot3 = await getDocs(allGoals)
  querySnapshot3.forEach((doc) => {
    const goal = doc.data() as Goal
    goal.Date = doc.data().Date.toDate()
    goals.value.push(goal)
  })
})


function getMonthName(month: number) {
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ]
  return months[month]
}

</script>