<script setup lang="ts">
import { server } from '@/services/server-connections';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  username: '',
  password: '',
});

function login(event: Event) {
  event.preventDefault();
  console.log('Login data:', form);
  server.post('/account/login', { username: form.username, password: form.password })
    .then(response => {
      console.log('Login successful:', response.data);
      router.push('/')
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    });
}
</script>

<template>
  <img src="../assets/landingIcon.svg" alt="Landing Icon" />
  <section>
    <img src="../assets/sandpiles-template-img.svg" alt="Sandpiles Template" />
    <section>
      <h1>LOGIN</h1>
      <form @submit="login">
        <div>
          <label for="username">Username</label>
          <input v-model="form.username" type="text" id="username" name="username" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input v-model="form.password" type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
        <p>Don't have an account yet?</p>
        <button type="button" @click="$router.push('/registration')">Register</button>
      </form>
    </section>
  </section>
</template>
