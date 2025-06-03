<script setup lang="ts">
import { server, tryAuth } from '@/services/server-connections';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-vue-ui-kit';
import zxcvbn from 'zxcvbn';
import DialogModal from '@/components/DialogModal.vue';

const router = useRouter();
const userStore = useUserStore();

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

const changeSocketNamespace = (namespace: string) => {
  // This function should change the socket namespace, implementation depends on your socket setup
  console.log(`Changing socket namespace to: ${namespace}`);
  tryAuth();
};

function isStrongPassword(password: string): boolean {
  const basicFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // home-brew check
  return basicFormat.test(password) && zxcvbn(password).score >= 3; // library-based check - score: 0 (weak) to 4 (strong)
}

function checkForm(): boolean {
  validation.username = form.username.length > 3;
  validation.password = import.meta.env.VITE_DOCKER ? isStrongPassword(form.password) : true;
  return validation.username && validation.password;
}

function login(event: Event) {
  event.preventDefault();
  if (!checkForm()) return;
  server
    .post('/account/login', { username: form.username, password: form.password })
    .then(response => {
      console.log('Login successful:', response.data);
      userStore.setUsername(form.username);
      changeSocketNamespace('/auth');
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
  <img
    src="../assets/landingIcon.svg"
    alt="Landing Icon"
    class="position-absolute top-0 start-0 m-3"
    style="height: 40px;
    z-index: 100;
    cursor: pointer;"
    @click="$router.push('/')"
  />
  <MDBContainer class="vh-100 d-flex justify-content-center align-items-center">
    <MDBRow class="w-100">
      <MDBCol class="md-6 d-none d-md-flex justify-content-center align-items-center">
        <img src="../assets/sandpiles-template-img.svg" alt="Sandpiles Template" class="img-fluid" style="max-height: 60vh;" />
      </MDBCol>
      <MDBCol class="md-6 d-flex justify-content-center align-items-center">
        <div class="w-100" style="max-width: 400px;">
          <h1 class="text-center mb-4 fw-bold">LOGIN</h1>
          <MDBRow tag="form" class="g-3 needs-validation" novalidate @submit.prevent="login">
            <MDBInput
              type="text"
              label="Username"
              id="username"
              v-model="form.username"
              :class="{
                'is-invalid': validation.username === false,
                'is-valid': validation.username === true
              }"
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
              white
            />
            <MDBBtn color="primary" block type="submit"> Login </MDBBtn>
          </MDBRow>
          <p class="text-center mt-3">Don't have an account yet?</p>
          <MDBBtn color="secondary" block @click="$router.push('/registration')">Register</MDBBtn>
        </div>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
  <DialogModal v-model="dialog.visible" :text=dialog.text @close="dialog.visible = false" />
</template>
