<script setup lang="ts">
defineProps(['numberOfGrains']);
</script>

<template>
  <div class="grains-container">
    <!-- <div v-for="i in numberOfGrains" class="grain" :data-count="numberOfGrains"></div> -->
    <img v-if="numberOfGrains == 1" src="../../assets/grains/1.png" />
    <img v-if="numberOfGrains == 2" src="../../assets/grains/2.png" />
    <img v-if="numberOfGrains == 3" src="../../assets/grains/3.png" />
    <img v-if="numberOfGrains == 4" src="../../assets/grains/4.png" />
    <img v-if="numberOfGrains == 5" src="../../assets/grains/5.png" />
  </div>
</template>

<style scoped lang="scss">
img {
  width: 100%;
}
</style>
