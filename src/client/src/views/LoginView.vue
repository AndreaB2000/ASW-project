<script setup lang="ts">
import { server, tryAuth } from '@/services/server-connections';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { MDBBtn, MDBInput } from 'mdb-vue-ui-kit';
import DialogModal from '@/components/DialogModal.vue';
import AuthScreen from '@/components/AuthScreen.vue';

const router = useRouter();

const form = reactive({
  username: '',
  password: '',
});

const validation = reactive({
  username: null as boolean | null,
  password: null as boolean | null,
});

const dialog = reactive({
  visible: false,
  text: ''
});

function login(event: Event) {
  event.preventDefault();
  server
    .post('/account/login', { username: form.username, password: form.password })
    .then(() => {
      tryAuth();
      router.push('/play');
    })
    .catch((error) => {
      validation.username = false;
      validation.password = false;
      dialog.text = error.response?.data?.message || 'Login failed. Please try again.';
      dialog.visible = true;
    });
}
</script>

<template>
  <AuthScreen title="Login" :formCompletionCallback="login">
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
    </template>
    <template #secondary-action>
      <p class="text-center mt-3">Don't have an account yet?</p>
      <MDBBtn color="secondary" block @click="$router.push('/registration')">Register</MDBBtn>
    </template>
  </AuthScreen>
  <DialogModal v-model="dialog.visible" :text=dialog.text @close="dialog.visible = false" />
</template>
