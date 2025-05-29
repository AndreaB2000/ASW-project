<script setup lang="ts">
import DialogModal from '@/components/DialogModal.vue';
import { MDBBtn } from 'mdb-vue-ui-kit';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import { ref } from 'vue';

const dialogVisible = ref(false);
</script>

<template>
  <section class="text-center container py-5">
    <div class="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3 mb-5 text-center text-md-start">
      <img src="@/assets/landingIcon.svg" class="img-fluid" style="height: 10vh;" />
      <h1 class="display-3 fw-bold m-0">SANDPILES</h1>
    </div>
    <div class="row justify-content-center align-items-center g-4">
      <div class="col-md-6">
        <p class="lead">
          Place your grains. Tip the balance. In this world of unstable equilibrium, every move can
          trigger a chain reaction. Conquer the board — one avalanche at a time.
        </p>
        <div class="row mt-4 g-3">
          <div class="col-12 col-md-6">
            <MDBBtn class="special-btn w-100 py-3" @click="dialogVisible">Play with BOT</MDBBtn>
          </div>
          <div class="col-12 col-md-6">
            <MDBBtn class="main-btn w-100 py-3" @click="$router.push('/login')">Login</MDBBtn>
          </div>
          <div class="col-12 col-md-6">
            <MDBBtn class="std-btn w-100 py-3" @click="dialogVisible">Tutorial</MDBBtn>
          </div>
          <div class="col-12 col-md-6">
            <MDBBtn class="std-btn w-100 py-3" @click="$router.push('/registration')">Register</MDBBtn>
          </div>
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
