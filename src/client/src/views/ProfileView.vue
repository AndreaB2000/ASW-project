<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { socket, server } from '@/services/server-connections'

const userStore = useUserStore();

if (userStore.username === '' || userStore.email === '') {
  server.get('/account/me').then(response => {
    userStore.setUsername(response.data.username);
    userStore.setEmail(response.data.email);
  }).catch((error: Error) => {
    console.error('Failed to fetch user data:', error);
    // Optionally redirect to login or show an error message
  });
}

const reactiveEmail = ref(userStore.email);

const isEditing = ref(false);

function changeProfile() {
  isEditing.value = true;
}

function saveProfile() {
  console.log('Saving profile with email:', reactiveEmail.value);
  socket.emit('change email', reactiveEmail.value, () => {
    console.log('Email change request sent');
    userStore.setEmail(reactiveEmail.value);
    isEditing.value = false;
  });
}
</script>

<template>
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
