<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedVariables: Used in form
async function login() {
	// biome-ignore lint/correctness/noUndeclaredVariables: Auto-imported by nuxt
	const { response, error } = await $fetch('/api/login', {
		method: 'POST',
		body: credentials,
	});
	if (response) {
		responseData.data = response;
	}
	if (error) {
		responseData.data = `Error occured: ${error}`;
	}
}
// biome-ignore lint/correctness/noUndeclaredVariables: Auto-imported by nuxt
const credentials = reactive({
	username: '',
	password: '',
});
const responseData = reactive({
	data: '',
});
</script>
<template>
  <NuxtLayout>
    <div>
      <h1>
        Login
      </h1>
      <form @submit.prevent="login">
        <input id="username" name="username" v-model="credentials.username" type="text" placeholder="Username" />
        <input id="password" name="password" v-model="credentials.password" type="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
      <div v-if="responseData.data">
        <p>{{ responseData.data }}</p>
      </div>
    </div>
  </NuxtLayout>
</template>
