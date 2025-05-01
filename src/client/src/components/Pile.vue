<script setup lang="ts">
import { MDBIcon } from 'mdb-vue-ui-kit';
defineProps(['numberOfGrains']);
</script>

<template>
  <div class="grains-container">
    <div v-for="i in numberOfGrains" class="grain" :data-count="numberOfGrains"></div>
  </div>
</template>

<style scoped lang="scss">
.grains-container {
  --grain-offset: 100%;
  --grain-size: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 80px;

  .grain {
    width: var(--grain-size);
    height: var(--grain-size);
    border-radius: 50%;
    background-color: #000;
    position: absolute;
    margin: 0;

    &[data-count='1'] {
      position: relative;
    }

    &[data-count='2'] {
      &:nth-child(1) {
        transform: translate(calc(-1 * var(--grain-offset)), 0);
      }
      &:nth-child(2) {
        transform: translate(var(--grain-offset), 0);
      }
    }

    &[data-count='3'] {
      &:nth-child(1) {
        transform: translate(0, var(--grain-offset));
      }
      &:nth-child(2) {
        transform: translate(calc(-1 * var(--grain-offset)), calc(-1 * var(--grain-offset)));
      }
      &:nth-child(3) {
        transform: translate(var(--grain-offset), calc(-1 * var(--grain-offset)));
      }
    }

    &[data-count='4'] {
      &:nth-child(1) {
        transform: translate(calc(-1 * var(--grain-offset)), calc(-1 * var(--grain-offset)));
      }
      &:nth-child(2) {
        transform: translate(var(--grain-offset), calc(-1 * var(--grain-offset)));
      }
      &:nth-child(3) {
        transform: translate(calc(-1 * var(--grain-offset)), var(--grain-offset));
      }
      &:nth-child(4) {
        transform: translate(var(--grain-offset), var(--grain-offset));
      }
    }

    &[data-count='5'] {
      &:nth-child(1) {
        transform: translate(0, 0);
      }
      &:nth-child(2) {
        transform: translate(calc(-1 * var(--grain-offset)), calc(-1 * var(--grain-offset)));
      }
      &:nth-child(3) {
        transform: translate(var(--grain-offset), calc(-1 * var(--grain-offset)));
      }
      &:nth-child(4) {
        transform: translate(calc(-1 * var(--grain-offset)), var(--grain-offset));
      }
      &:nth-child(5) {
        transform: translate(var(--grain-offset), var(--grain-offset));
      }
    }
  }
}
</style>
