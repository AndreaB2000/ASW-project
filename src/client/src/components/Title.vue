<script setup lang="ts">
import Icon from '@/components/Icon.vue';
</script>

<template>
  <header>
    <section class="title">
      <Icon />
      <h1>SANDPILES</h1>
    </section>
  </header>
</template>

<style scoped>
.title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2vw;
  margin-top: 4vh;
  margin-bottom: 4vh;

  h1 {
    font-size: 5rem;
    letter-spacing: 40%;
  }
}
</style>
