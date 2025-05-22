<script lang="ts" setup></script>

<template>
  <p style="font-size: large">you are now logged in</p>
  <button>Play</button>
  <button>Tutorial</button>
  <button>Leaderboard</button>
  <button @click="$router.push('/profile')">Profile</button>
</template>
