<template>
  <k-page>

    <Header/>

    <k-block strong>
      <p> text </p>
    </k-block>


    <Bottom/>
  </k-page>
</template>

<script lang="ts">
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

export default {
  components: {
    Bottom,
    Header,
    kPage,
    kNavbar,
    kBlock,
    kButton,
    kList,
    kListItem,
    kLink,
    kBlockTitle,
  },
};

</script>