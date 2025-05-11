<script setup lang="ts">
import en from 'javascript-time-ago/locale/en';
import TimeAgo from 'javascript-time-ago';
const route = useRoute();
const { fileName, size, contentType, uploadedAt, uploader } = await $fetch(
	`/api/file-metadata/${route.params.slug}`,
);

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

const config = useRuntimeConfig();

function calculate(uploadTime: string) {
	try {
		return timeAgo.format(Date.parse(uploadTime), 'round');
	} catch (e) {}
}
</script>
<template>
  <NuxtLayout>
    <div class="h-screen w-screen overflow-y-scroll pb-8">
      <div class="flex items-center justify-center">
        <div class="m-20">
          <img v-if="contentType.includes('image')" draggable="false" :src='`${config.domain}/api/file/${fileName}`'
            :alt='fileName' />
          <video v-if="contentType.includes('video')" autoplay loop muted controls
            :src='`${config.domain}/api/file/${fileName}`' />
        </div>
      </div>
      <div class="flex flex-col items-center justify-center gap-6 mb-8 pb-8">
        <div
          class="rounded-lg border border-[#1E293B] shadow-sm flex justify-center items-center m-8 md:m-0 md:ml-0 md:mr-0 p-8 md:p-0 md:w-[800px] md:h-52 h-fit">
          <div class="text-center grow h-full p-0">
            <div
              class="flex flex-col md:flex-row justify-center items-center md:h-full h-min pt-6 pb-6 gap-10 md:gap-0">
              <div class="flex flex-col justify-evenly items-center mr-auto grow m-13 h-full w-full">
                <p class="text-lg md:text-2xl">{{ fileName }}</p>
                <a :href='`/api/file/${fileName}`'
                  class="w-2/3 flex justify-evenly items-center border py-2 border-blue-600 rounded-md">
                  <Icon name="material-symbols:download" size="1em" mode="svg" />
                  Download
                </a>
              </div>
              <div class="shrink-0 bg-[#1E293B] h-[1px] w-full md:h-full md:w-[1px]"></div>
              <div class="grid grid-cols-2 grid-rows-2 ml-auto mt-auto grow gap-6 m-9 h-full w-full">
                <div class="flex flex-col justify-evenly items-center">
                  <Icon name="lucide:webhook" size="1.4em" mode="svg" />
                  <p class="text-[10px]">SIZE</p>
                  <p>{{ size }}</p>
                </div>
                <div class="flex flex-col justify-evenly items-center">
                  <Icon name="lucide:clock-1" size="1.4em" mode="svg" />
                  <p class="text-[10px]">UPLOAD TIME</p>
                  <p>{{ calculate(uploadedAt) }}</p>
                </div>
                <div class="flex flex-col justify-evenly items-center">
                  <Icon name="lucide:file-digit" size="1.4em" mode="svg" />
                  <p class="text-[10px]">MIMETYPE</p>
                  <p>{{ contentType }}</p>
                </div>
                <div class="flex flex-col justify-evenly items-center">
                  <Icon name="lucide:contact" size="1.4em" mode="svg" />
                  <p class="text-[10px]">UPLOADED BY</p>
                  <p>{{ uploader }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
