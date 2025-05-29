<script setup lang="ts">
import DialogModal from '@/components/DialogModal.vue';
import { MDBBtn } from 'mdb-vue-ui-kit';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import { ref } from 'vue';

const dialogVisible = ref(false);

</script>

<template>
  <section class="text-center container py-5">
    <div class="d-flex justify-content-center align-items-center mb-5">
      <img src="@/assets/landingIcon.svg" class="me-4" style="height: 10vh;" />
      <h1 class="display-3 fw-bold">SANDPILES</h1>
    </div>
    <div class="row justify-content-center align-items-center g-4">
      <div class="col-md-6">
        <p class="lead">
          Place your grains. Tip the balance. In this world of unstable equilibrium, every move can
          trigger a chain reaction. Conquer the board — one avalanche at a time.
        </p>
        <div class="d-grid gap-3 mt-4">
          <MDBBtn class="special-btn" @click="dialogVisible = true">Play with BOT</MDBBtn>
          <MDBBtn class="main-btn" @click="$router.push('/login')">Login</MDBBtn>
          <MDBBtn class="std-btn" @click="dialogVisible = true">Tutorial</MDBBtn>
          <MDBBtn class="std-btn" @click="$router.push('/registration')">Register</MDBBtn>
        </div>
      </div>
      <div class="col-md-6 text-center main-img">
        <img src="@/assets/sandpiles-template-img.svg" class="img-fluid" />
      </div>
    </div>
    <DialogModal v-model="dialogVisible" text="This button is not binded yet" @close="dialogVisible = false" />
  </section>
</template>

<style scoped lang="scss">
.main-img {
  @media (max-width: 768px) {
    display: none;
  }
}
</style>
