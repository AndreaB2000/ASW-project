<!--
  This component is a simple modal dialog that displays a message and has a close button.
-->
<template>
  <MDBModal v-model="visible" staticBackdrop centered>
    <MDBModalBody class="text-center">
      <p class="mb-3">{{ text }}</p>
      <MDBBtn color="info" @click="visible = false; emit('close')">Close</MDBBtn>
    </MDBModalBody>
  </MDBModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { MDBModal, MDBModalBody, MDBBtn } from 'mdb-vue-ui-kit';

const props = defineProps<{ text: string; modelValue: boolean }>();
const emit = defineEmits(['update:modelValue', 'close']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, val => (visible.value = val));
watch(visible, val => emit('update:modelValue', val));
</script>
