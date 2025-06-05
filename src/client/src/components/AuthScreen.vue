<script setup lang="ts">
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from 'mdb-vue-ui-kit';

const props = defineProps<{
  title: string;
  formCompletionCallback: (event: Event) => void;
}>();
</script>

<template>
  <img
    src="../assets/landingIcon.svg"
    alt="Landing Icon"
    class="position-absolute top-0 start-0 m-3"
    style="
      height: 40px;
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
        <div style="max-width: 400px;">
          <h1 class="text-center mb-4 fw-bold">{{ props.title.toUpperCase() }}</h1>
          <MDBRow tag="form" class="g-3 needs-validation" novalidate @submit.prevent="props.formCompletionCallback">
            <slot name="form-fields"></slot>
            <MDBBtn color="primary" block type="submit"> {{ props.title }} </MDBBtn>
          </MDBRow>
          <slot name="secondary-action"></slot>
        </div>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>
