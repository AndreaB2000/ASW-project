<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore();

const username = ref(userStore.username);
const isEditing = ref(false);

function changeProfile() {
  isEditing.value = true;
}

function saveProfile() {
  isEditing.value = false;
}
</script>

<template>
  <p style="font-size: large">profile</p>
  <section>
    <img alt="profile image"/>

    <div v-if="!isEditing">
      <h1>{{ username }}</h1>
      <button @click="changeProfile()">Modify</button>
    </div>
    <div v-else>
      <input v-model="username" />
      <button @click="saveProfile()">Save</button>
    </div>
  </section>
</template>
