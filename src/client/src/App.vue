<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <h1>SandPiles</h1>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
