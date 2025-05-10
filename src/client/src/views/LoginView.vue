<script setup lang="ts">

import axios from 'axios';

//configure axios to use the base URL of the server
// const protocol = import.meta.env.VITE_SERVER_PROTOCOL;
// const ip = import.meta.env.VITE_SERVER_IP;
// const port = import.meta.env.VITE_SERVER_PORT;
const baseURL = `http://localhost:3000`;
axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

//setting cors

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';

async function loginFoo() {
  await axios.post("/account/login", {
    username: "foo",
    password: "test",
  })
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
}); 
}

async function loginBar() {
  await axios.post("/account/login", {
    username: "bar",
    password: "test",
  }); 
}

</script>

<template>
  <main>this is a login page</main>
  <button @click="loginFoo()">foo</button>
  <button @click="loginBar()">bar</button>
</template>
