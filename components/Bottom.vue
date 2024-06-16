<script setup lang="ts">
import {kToolbar, kLink} from "konsta/vue";
</script>

<template>
  <k-toolbar
      :top="true"
      class="left-0 ios:top-11-safe material:top-14-safe sticky w-full"
  >
<!--    <k-link toolbar href="/">Main</k-link>-->
    <k-link toolbar href="/profile">Profile</k-link>
    <k-link toolbar href="/purchases">Purchases</k-link>
    <k-link toolbar href="/analytics">Analytics</k-link>
    <k-link toolbar href="/budget">Budget</k-link>
    <k-link toolbar href="/investments">Investments</k-link>
  </k-toolbar>
</template>

<style scoped>

</style>