<template>
  <img
    src="../assets/landingIcon.svg"
    alt="Landing Icon"
    class="position-absolute top-0 start-0 m-3"
    @click="$router.push('/')"
  />
</template>

<style scoped>
img {
  height: 45px;
  width: fit-content;
  z-index: 100;
  cursor: pointer;
}
</style>
