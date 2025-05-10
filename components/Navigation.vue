<script setup lang="ts">
const router = useRouter();

const active = router.currentRoute.value.name;
</script>
<template>
  <div
    class="fixed bottom-10px w-fit flex gap-10px bg-[#252525] py-[16px] px-[24px] rounded-12px left-[50%] transform-translate-x-[-50%] user-drag-none"
    ondragstart="return false">
    <NuxtLink href="/">
      <Icon name="gravity-ui:house" size="32px" class="color-[#575757] menuBarButton"
        :class="{ active: active === 'index' }" mode="svg" />
    </NuxtLink>
    <NuxtLink href="/files">
      <Icon name="tabler:stack" size="32px" class="color-[#575757] menuBarButton"
        :class="{ active: active === 'files' }" mode="svg" />
    </NuxtLink>
    <NuxtLink href="/config">
      <Icon name="tabler:settings" size="32px" class="color-[#575757] menuBarButton"
        :class="{ active: active === 'config' }" mode="svg" />
    </NuxtLink>
    <div class="self-center w-1px h-16px bg-[#3f3f3f]" />
    <NuxtLink href="/account">
      <Icon name="material-symbols:account-circle" size="32px" class="color-[#575757] menuBarButton"
        :class="{ active: active === 'account' }" mode="svg" />
    </NuxtLink>
  </div>
</template>

<style scoped>
.active {
  color: #f966abFF;
  filter: drop-shadow(0px 0px 4px #f966abFF)
}
</style>
