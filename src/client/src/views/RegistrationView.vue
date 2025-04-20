<script setup lang="ts">
import { reactive } from 'vue';
import { api } from '../services/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
});

function register(event: Event) {
  api
    .get('/ping')
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  event.preventDefault();
  if (form.password !== form.repeatPassword) {
    alert('Passwords do not match');
    return;
  }
  const data = {
    username: form.username,
    email: form.email,
    password: form.password,
  };
  // api.post('/account/register', data).then(response => {
  //   if (response.status === 201) {
  //     alert('Registration successful');
  //     router.push('/login');
  //   } else if (response.status === 409) {
  //     alert('Account already exists');
  //   } else if (response.status === 500) {
  //     alert('Server error, please try again later');
  //   } else if (response.status === 400) {
  //     alert('Invalid data, please check your input');
  //   }
  // });
}
</script>

<template>
  <img src="../assets/landingIcon.svg" alt="Landing Icon" />
  <section>
    <img src="../assets/sandpiles-template-img.svg" alt="Sandpiles Template" />
    <section>
      <h1>REGISTRER</h1>
      <form @submit="register">
        <div>
          <label for="username">Username</label>
          <input v-model="form.username" type="text" id="username" name="username" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input v-model="form.email" type="email" id="email" name="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input v-model="form.password" type="password" id="password" name="password" required />
        </div>
        <div>
          <label for="repeat-password">Repeat Password</label>
          <input
            v-model="form.repeatPassword"
            type="password"
            id="repeat-password"
            name="password"
            required
          />
        </div>
        <button type="submit">Register</button>
        <p>Already have an account?</p>
        <button type="button" @click="$router.push('/login')">Login</button>
      </form>
    </section>
  </section>
</template>
