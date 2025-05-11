<script setup lang="ts">
const user = useUserStore();
const u = storeToRefs(user);
const loggedIn = ref(u.id.value !== undefined);

const { userTotal, total, userSize, totalSize, userCount, error } =
  await $fetch('/api/dashboard-data');
</script>
<template>

  <Head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </Head>
  <NuxtLayout>
    <div v-show="loggedIn">
      <Navigation />
      <div class="flex flex-col justify-center items-center m-48">
        <div class="grid grid-cols-2 gap-10">
          <div class="homepage_card">
            <div class="flex flex-col gap-5">
              <Clock />
              <p class="text-lg font-bold m-0 p-0 text-gray-300">
                Total Files
              </p>
              <p class="text-xl">{{ total }}</p>
              <p class="text-sm text-gray-400">
                Total amount of files uploaded
              </p>
            </div>
          </div>
          <div class="homepage_card">
            <div class="grid grid-rows-3 gap-5">
              <div class="flex gap-5 items-center">
                <Clock />
                <p class="text-lg font-bold m-0 p-0 text-gray-300">
                  Your Files
                </p>
              </div>

              <p class="text-xl">{{ userTotal }}</p>
              <p class="text-sm text-gray-400">
                Your total amount of files uploaded
              </p>
            </div>
          </div>
          <div class="homepage_card">
            <div class="grid grid-rows-3 gap-5">
              <div class="flex gap-5 items-center">
                <Clock />
                <p class="text-lg font-bold m-0 p-0 text-gray-300">
                  Total Storage
                </p>
              </div>
              <p class="text-xl">{{ totalSize }}</p>
              <p class="text-sm text-gray-400">Total storage used by all files</p>
            </div>
          </div>
          <div class="homepage_card">
            <div class="grid grid-rows-3 gap-5">
              <div class="flex gap-5 items-center">
                <Clock />
                <p class="text-lg font-bold m-0 p-0 text-gray-300">
                  Your Storage
                </p>
              </div>
              <p class="text-xl">{{ userSize }}</p>
              <p class="text-sm text-gray-400">Total storage used by your files</p>
            </div>
          </div>
          <div class="homepage_card">
            <div class="grid grid-rows-3 gap-5">
              <div class="flex gap-5 items-center">
                <Clock />
                <p class="text-lg font-bold m-0 p-0 text-gray-300">
                  Total Users
                </p>
              </div>
              <p class="text-xl">{{ userCount }}</p>
              <p class="text-sm text-gray-400">Amount of registered users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
