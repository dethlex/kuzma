<template>
  <k-page>
    <Header/>

    <k-block-title>Default</k-block-title>
    <k-list inset-ios strong-ios>
      <k-list-input
          label="Name" type="text" placeholder="Your name"
          :value="profile.Name"
          @input="profile.Name = $event.target.value"
      />
      <k-list-input
          label="Birthday"
          type="date"
          default-value="2001-01-01"
          placeholder="Please choose..."
          :value="profile.Birthday"
          @input="profile.Birthday = $event.target.value"
      />

      <k-list-input
          label="Born place" type="text" placeholder="Your born place"
          :value="profile.BornPlace"
          @input="profile.BornPlace = $event.target.value"
      />

      <k-list-input
          label="Live place" type="text" placeholder="Your live place"
          :value="profile.LivePlace"
          @input="profile.LivePlace = $event.target.value"
      />

      <k-list-input
          label="Gender"
          type="select"
          dropdown
          default-value="Male"
          placeholder="Please choose..."
          :value="profile.Gender"
          @input="profile.Gender = $event.target.value"
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </k-list-input>

      <k-list-input
          label="Occupation" type="text" placeholder="Your occupation"
          :value="profile.Occupation"
          @input="profile.Occupation = $event.target.value"
      />

      <k-list-input
          label="Salary" type="number" placeholder="Your salary"
          :value="profile.Salary"
          @input="profile.Salary = $event.target.value"
      />

      <k-list-input
          label="Textarea"
          type="textarea"
          placeholder="Bio"
          input-class="!h-20 resize-none"
          :value="profile.Bio"
          @input="profile.Bio = $event.target.value"
      />

      <k-button @click="saveProfile">Save</k-button>
    </k-list>

    <Bottom/>
  </k-page>

</template>

<script setup lang="ts">
import Header from "~/components/Header.vue";
import Bottom from "~/components/Bottom.vue";
import {
  kPage,
  kButton,
  kBlockTitle,
  kList,
  kListInput,
} from 'konsta/vue';
import {setDoc, doc, getDoc} from "firebase/firestore";
import type {Profile} from "~/entities/profile";

const {$firestore} = useNuxtApp()
const profile = ref<Profile>({} as Profile)

onMounted(async () => {
  getDoc(doc($firestore, 'profiles', 'aleksei')).then((doc) => {
    profile.value = doc.data() as Profile
  })
})

async function saveProfile() {
  console.log(profile.value)
  try {
    await setDoc(doc($firestore, 'profiles', 'aleksei'), profile.value)
    console.log("Profile saved")
  } catch (e) {
    console.error(e)
  }
}

</script>