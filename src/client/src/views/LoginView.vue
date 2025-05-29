<script setup lang="ts">
import { server, tryAuth } from '@/services/server-connections';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-vue-ui-kit';

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  username: '',
  password: '',
});

const changeSocketNamespace = (namespace: string) => {
  // This function should change the socket namespace, implementation depends on your socket setup
  console.log(`Changing socket namespace to: ${namespace}`);
  tryAuth();
};

function checkForm(event: Event) {
  const target = event.target as HTMLElement | null;
  if (form.username.length > 3) target?.classList.add('was-validated');
  else {
    target?.classList.remove('was-validated');
    return;
  }
}

function login(event: Event) {
  event.preventDefault();
  console.log('Login data:', form);
  server
    .post('/account/login', { username: form.username, password: form.password })
    .then(response => {
      console.log('Login successful:', response.data);
      userStore.setUsername(form.username);
      changeSocketNamespace('/auth');
      router.push('/play');
    })
    .catch(alert);
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
          <MDBRow tag="form" class="g-3 needs-validation" novalidate @submit.prevent="checkForm">
            <MDBInput
              type="text"
              label="Username"
              id="username"
              v-model="form.username"
              invalidFeedback="Username length must be greater than 3 characters."
              white
            />
            <MDBInput
              type="password"
              label="Password"
              id="password"
              v-model="form.password"
              wrapperClass="mb-4"
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
</template>

