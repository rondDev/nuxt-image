<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedVariables: Used in form
function login() {
  // biome-ignore lint/correctness/noUndeclaredVariables: Auto-imported by nuxt
  $fetch('/api/login', { method: 'POST', body: credentials });
}
// biome-ignore lint/correctness/noUndeclaredVariables: Auto-imported by nuxt
const credentials = reactive({
  username: '',
  password: '',
});
</script>
<template>
  <div>
    <h1>
      Login
    </h1>
    <form @submit.prevent="login">
      <input id="username" name="username" v-model="credentials.username" type="text" placeholder="Username" />
      <input id="password" name="password" v-model="credentials.password" type="password" placeholder="Password" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
