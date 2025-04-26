<script setup lang="ts">
let active = 'house';
</script>
<template>
  <div class="w-fit flex relative gap-10px bg-[#252525] py-[16px] px-[24px] rounded-12px">
    <Icon name="gravity-ui:house" size="32px" class="color-[#575757] menuBarButton"
      :class="{ active: active === 'house' }" mode="svg" />
    <Icon name="tabler:stack" size="32px" class="color-[#575757] menuBarButton"
      :class="{ active: active === 'projects' }" mode="svg" />
    <Icon name="tabler:bell" size="32px" class="color-[#575757] menuBarButton"
      :class="{ active: active === 'notifications' }" mode="svg" />
    <div class="self-center w-1px h-16px bg-[#3f3f3f]" />
    <Icon name="material-symbols:account-circle" size="32px" class="color-[#575757] menuBarButton"
      :class="{ active: active === 'notifications' }" mode="svg" />
  </div>
</template>

<style scoped>
.active {
  color: #f966abFF;
  filter: drop-shadow(0px 0px 4px #f966abFF)
}
</style>
