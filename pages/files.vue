<script setup lang="ts">
import en from 'javascript-time-ago/locale/en';
import TimeAgo from 'javascript-time-ago';
import adze from 'adze';

type fileType = {
	fileName: string;
	size: string;
	updatedAt: string;
};
const route = useRoute();
const offset = ref(
	route.query.offset && typeof route.query.offset === 'number'
		? route.query.offset
		: 0,
);
const { files } = await $fetch(`/api/files/${offset.value}`);

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo('en-US');

function calculate(file: fileType) {
	try {
		return timeAgo.format(Date.parse(file.updatedAt), 'round');
	} catch (e) {
		adze.error('[files.vue | calculate]', e, file);
		return '';
	}
}

const config = useRuntimeConfig();

const { copy } = useClipboard();
</script>
<template>
  <NuxtLayout>
    <Navigation />
    <div
      class="h-full max-w-full rounded-lg m-12 xl:m-18 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 bg-gradient-to-br from-[#04102D] to-[#020817] text-white justify-items-center">
      <div v-for="file of files" class="border border-[#27272a] p-5 w-[90%] sm:w-[42vw] md:w-[28vw] rounded-xl">
        <div class="h-[5rem] flex flex-col gap-2">
          <p class="text-md font-bold">{{ file.fileName }}</p>
          <div class="flex justify-between">
            <p class="text-xs lg:text-sm">Uploaded {{ calculate(file) }}</p>
            <p class="text-xs lg:text-sm">{{ file.size }}</p>
          </div>
        </div>
        <div class="flex justify-center lg:h-[10rem] xl:h-[13rem]">
          <img class="flex object-contain h-full" :src='`${config.public.domain}/api/file/${file.fileName}`' />
        </div>
        <div class="flex my-2 lg:h-[4rem] items-center justify-between">
          <input type="hidden" name="file" value={file.fileFullName} />
          <!-- TODO: implement functionality for delete -->
          <button
            class="p-2 xl:w-[6rem] h-[2rem] rounded-lg self-center border border-red-500 text-red-500 text-xs lg:text-sm flex justify-center items-center cursor-pointer">
            Delete
          </button>
          <button @click="copy(`${config.public.domain}/${file.fileName}`)" class="p-2 xl:w-[6rem] h-[2rem] rounded-lg self-center border border-blue-400
                text-blue-400 text-xs lg:text-sm flex justify-center items-center cursor-pointer">
            Copy link
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
