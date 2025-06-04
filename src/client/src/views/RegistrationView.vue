<script setup lang="ts">
import AuthScreen from '@/components/AuthScreen.vue';
import DialogModal from '@/components/DialogModal.vue';
import { server } from '@/services/server-connections';
import { isPasswordStrong, isUsernameStrong } from '@/services/strength-validator';
import axios from 'axios';
import { MDBBtn, MDBInput } from 'mdb-vue-ui-kit';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
  username: '',
  email: '',
  password: '',
  repeatPassword: '',
});

const validation = reactive({
  username: null as boolean | null,
  email: null as boolean | null,
  password: null as boolean | null,
  repeatPassword: null as boolean | null,
});

const dialog = reactive({
  visible: false,
  text: ''
});

function register(event: Event) {
  event.preventDefault();
  validation.username = isUsernameStrong(form.username);
  validation.email = form.email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  validation.password = isPasswordStrong(form.password);
  validation.repeatPassword = form.password === form.repeatPassword;
  if (!validation.username || !validation.email || !validation.password || !validation.repeatPassword) return;
  server.post('/account/register', {
    username: form.username.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password
  }).then((response) => {
    console.log('Registration successful:', response.data);
    router.push('/login');
  }).catch((error) => {
    console.error('Registration error:', error);
    // Better error handling
    let errorMessage = 'Registration failed. Please try again.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    alert(errorMessage);
  });
}
</script>

<template>
  <AuthScreen title="Register" :formCompletionCallback="register">
    <template #form-fields>
      <MDBInput
        type="text"
        label="Username"
        id="username"
        v-model="form.username"
        :class="{
          'is-invalid': validation.username === false,
          'is-valid': validation.username === true
        }"
        wrapperClass="mb-4"
        invalidFeedback="Username must be at least 3 characters long and contain only alphanumeric characters."
        white
      />
      <MDBInput
        type="email"
        label="Email"
        id="email"
        v-model="form.email"
        :class="{
          'is-invalid': validation.email === false,
          'is-valid': validation.email === true
        }"
        wrapperClass="mb-4"
        invalidFeedback="Please enter a valid email address."
        white
      />
      <MDBInput
        type="password"
        label="Password"
        id="password"
        v-model="form.password"
        wrapperClass="mb-4"
        :class="{
          'is-invalid': validation.password === false,
          'is-valid': validation.password === true
        }"
        invalidFeedback="Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        white
      />
      <MDBInput
        type="password"
        label="Repeat Password"
        id="repeat-password"
        v-model="form.repeatPassword"
        wrapperClass="mb-4"
        :class="{
          'is-invalid': validation.repeatPassword === false,
          'is-valid': validation.repeatPassword === true
        }"
        invalidFeedback="Passwords do not match."
        white
      />
    </template>
    <template #secondary-action>
      <p class="text-center mt-3">Already have an account?</p>
      <MDBBtn color="secondary" block @click="$router.push('/login')">Login</MDBBtn>
    </template>
  </AuthScreen>
  <DialogModal v-model="dialog.visible" :text=dialog.text @close="dialog.visible = false" />
</template>
