<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { socket } from '@/services/server-connections'

const userStore = useUserStore();

const email = ref(userStore.email);
const isEditing = ref(false);

function changeProfile() {
  isEditing.value = true;
}

function saveProfile() {
  socket.emit('updateEmail', email.value, () => {
    userStore.setEmail(email.value);
    isEditing.value = false;
  });
}
</script>

<template>
  <p style="font-size: large">profile</p>
  <section>
    <img alt="profile image"/>
    <h1>{{ userStore.username }}</h1>
    <div v-if="!isEditing">
      <h1>{{ email }}</h1>
      <button @click="changeProfile()">Modify</button>
    </div>
    <div v-else>
      <input v-model="email" />
      <button @click="saveProfile()">Save</button>
    </div>
  </section>
</template>
