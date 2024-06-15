<template>
  <k-page>
    <Header />

    <k-block strong>
      <p id="story"> {{ story }} </p>
    </k-block>


    <k-block strong class="flex space-x-4">
      <k-button @click="run">Button 1</k-button>
<!--      <k-button>Button 2</k-button>-->
    </k-block>

    <Bottom />
  </k-page>
</template>

<script setup lang="ts">
import Header from "~/components/Header.vue";
import Bottom from "~/components/Bottom.vue";

const {$model} = useNuxtApp()
const story = ref<string>("Press the button to generate the advices.");

function run(){
  story.value = "Generating advices...";

  // Provide a prompt that contains text
  const prompt = "Imagine an investment mobile game." +
      "Here you can analyze in-game purchases and find how to save the money for creating investment advices. " +
      "For example, I am a person who likes water sports and I want to invest in something related to it. " +
      "Generate a list of 5 random investment advices from the water sport category. " +
      "Wrap the response in json, each option should have an advice field. Example of response: " +
      "{\"advice\": \"text\"}."

  // To generate text output, call generateContent with the text input
  $model.generateContent(prompt).then((response) => {
    story.value = response.response.text();
  });
}

</script>

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

export default {
  components: {
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