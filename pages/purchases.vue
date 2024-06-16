<template>
  <k-page>

    <Header/>

    <k-list inset-ios strong-ios>
      <k-list-input label="Import" type="file" @change="uploadPurchases($event.target.files[0])"/>
    </k-list>

    <div class="block overflow-x-auto mt-4 mb-4">
      <k-table v-if="purchases.length > 0">
        <k-table-head>
          <k-table-row header>
            <k-table-cell header>Date Time</k-table-cell>
            <k-table-cell header class="text-right">Merchant Name</k-table-cell>
            <k-table-cell header class="text-right">Merchant Category</k-table-cell>
            <k-table-cell header class="text-right">Expense Type</k-table-cell>
            <k-table-cell header class="text-right">Expense Sub Type</k-table-cell>
            <k-table-cell header class="text-right">Amount</k-table-cell>
            <k-table-cell header class="text-right">Emotion</k-table-cell>
            <k-table-cell header class="text-right">Heartbeat</k-table-cell>
          </k-table-row>
        </k-table-head>
        <k-table-body>
          <k-table-row v-for="purchase in purchases">
            <k-table-cell>{{ purchase.DateTime.toLocaleString() }}</k-table-cell>
            <k-table-cell class="text-right">{{ purchase.MerchantName }}</k-table-cell>
            <k-table-cell class="text-right">{{ purchase.MerchantCategory }}</k-table-cell>
            <k-table-cell class="text-right">{{ purchase.ExpenseType }}</k-table-cell>
            <k-table-cell class="text-right">{{ purchase.ExpenseSubType }}</k-table-cell>
            <k-table-cell class="text-right">{{ purchase.Amount }}</k-table-cell>
            <k-table-cell class="text-right">{{ purchase.Emotion }}</k-table-cell>
            <k-table-cell class="text-right">{{ purchase.Heartbeat }}</k-table-cell>
          </k-table-row>
        </k-table-body>
      </k-table>
    </div>

    <k-button @click="savePurchases" :disabled="purchases.length === 0">Save</k-button>

    <Bottom/>
  </k-page>
</template>

<script setup lang="ts">
import {
  kPage,
  kTable,
  kTableHead,
  kTableBody,
  kTableCell,
  kTableRow,
  kList,
  kListInput,
  kButton,
} from 'konsta/vue';
import Header from "~/components/Header.vue";
import Bottom from "~/components/Bottom.vue";
import Papa from 'papaparse'
import type {Purchase} from "~/entities/purchase";
import {doc, writeBatch} from "firebase/firestore";

const {$firestore} = useNuxtApp()

const purchases = ref<Purchase[]>([])

function uploadPurchases(f: File) {
  if (f) {
    Papa.parse(f, {
      header: true,
      complete: (results: any) => {

        results.data.forEach((purchase: any) => {
          purchases.value.push({
            ID: purchase['ID'],
            DateTime: new Date(purchase['date'] + ' ' + purchase['time']),
            MerchantName: purchase['merchant name'],
            MerchantCategory: purchase['merchant category'],
            ExpenseType: purchase['expense type'],
            ExpenseSubType: purchase['sub_type'],
            Amount: parseFloat(purchase['amount']),
            Emotion: purchase['emotion'],
            Heartbeat: purchase['Heartbit'],
          })
        })
      }
    })
  }
}

async function savePurchases() {
  try {

    const batch = writeBatch($firestore);
    purchases.value.forEach(purchase => {
      const purchaseRef = doc($firestore, 'purchases', purchase.ID.toString())
      batch.set(purchaseRef, purchase)
    })

    await batch.commit();

    console.log("Purchases saved")
  } catch (e) {
    console.error(e)
  }
}

</script>