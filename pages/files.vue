<script setup lang="ts">
import en from 'javascript-time-ago/locale/en';
import TimeAgo from 'javascript-time-ago';
import adze from 'adze';

type fileType = {
	fileName: string;
	fileSize: string;
	updatedAt: string;
};
const { files } = await $fetch('/api/files');

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

const { copy } = useClipboard();
</script>
<template>
  <NuxtLayout>
    <Navigation />
    <div
      class="h-full max-w-full rounded-lg mt-32 mb-32 ml-36 mr-36 grid grid-cols-3 gap-8 bg-gradient-to-br from-[#04102D] to-[#020817] text-white">
      <div v-for="file of files" class="bg-[#020817] p-5 h-[25rem] w-[30rem]">
        <div class="h-[5rem] flex flex-col gap-2">
          <p class="text-md font-bold">{{ file.fileName }}</p>
          <div class="flex gap-4">
            <p class="text-sm">Uploaded {{ calculate(file) }}</p>
            <p class="text-sm">{{ file.fileSize }}</p>
          </div>
        </div>
        <div class="flex justify-center h-[13rem]">
          <img class="flex object-contain h-full" :src='`http://localhost:3000/api/file/${file.fileName}`' />
        </div>
        <div class="flex h-[5rem] items-center justify-between">
          <!-- TODO: fix clipboard to actually copy link -->
          <button @click="copy('hi')" class="p-2 w-[10rem] h-[2rem] rounded-full self-center bg-slate-800
                text-blue-400 text-sm flex justify-center items-center cursor-pointer">
            Copy link
          </button>
          <input type="hidden" name="file" value={file.fileFullName} />
          <button
            class="p-2 w-[10rem] h-[2rem] rounded-full self-center bg-slate-800 text-red-500 text-sm flex justify-center items-center cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
