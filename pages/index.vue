<template>
  <k-page>
    <Header />

    <k-block strong>
      <p id="story"> {{ story }} </p>
    </k-block>


<!--    <k-block strong class="flex space-x-4">-->
<!--      <k-button @click="run">Button 1</k-button>-->
<!--&lt;!&ndash;      <k-button>Button 2</k-button>&ndash;&gt;-->
<!--    </k-block>-->

    <Bottom />
  </k-page>
</template>

<script setup lang="ts">
// Konsta UI components
import {
  kPage,
  kNavbar,
  kBlock,
  kButton,
  kList,
  kListItem,
  kLink,
  kBlockTitle,
} from 'konsta/vue';
import Header from "~/components/Header.vue";
import Bottom from "~/components/Bottom.vue";

const story = ref<string>("Welcome to Kuzma");

</script>