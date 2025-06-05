<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { socket, server } from '@/services/server-connections'
import NavBar from '@/components/NavBar.vue';

const userStore = useUserStore();

if (!userStore.username || !userStore.email) {
  server.get('/account/me').then(response => {
    userStore.setUsername(response.data.username);
    userStore.setEmail(response.data.email);
  }).catch((error: Error) => {
    console.error('Failed to fetch user data:', error);
    alert('Failed to fetch user data. Please try again later.');
  });
}
const reactiveEmail = ref(userStore.email);
const isEditing = ref(false);

function changeProfile() {
  isEditing.value = true;
}

function saveProfile() {
  socket.emit('change email', reactiveEmail.value, (result: { success: boolean, message: string }) => {
    if (!result.success) {
      alert('Failed to change email:' + result.message);
      return;
    }
    userStore.setEmail(reactiveEmail.value);
    isEditing.value = false;
  });
}
</script>

<template>
  <NavBar/>
  <p style="font-size: large">profile</p>
  <section>
    <img alt="profile image"/>
    <h1>{{ userStore.email }}</h1>
    <div v-if="!isEditing">
      <button @click="changeProfile()">Modify</button>
    </div>
    <div v-else>
      <input v-model="reactiveEmail" />
      <button @click="saveProfile()">Save</button>
    </div>
  </section>
</template>
