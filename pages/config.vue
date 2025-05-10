<script setup lang="ts">
import adze from 'adze';
import VCodeBlock from '@wdns/vue-code-block';
const userStore = useUserStore();
const user = storeToRefs(userStore);
const router = useRouter();

const showRaw = ref(false);
// TODO: Add randomize toggle
const randomizeFileNames = ref(false);
const host = ref(location.host);
const config = reactive({
	Version: '15.0.0',
	DestinationType:
		'ImageUploader, TextUploader, FileUploader, URLShortener, URLSharingService',
	RequestMethod: 'POST',
	RequestURL: `https://${host.value}/api/upload`,
	Headers: {
		origin: `https://${host.value}`,
	},
	Body: 'MultipartFormData',
	Arguments: {
		key: `${user.uploadKey.value}`,
		name: '{filename}',
		randomize_filename: randomizeFileNames,
	},
	FileFormName: 'd',
	URL: '{json:url}',
});
const configRef = ref(JSON.stringify(config));

function downloadConfig() {
	const blob = new Blob([JSON.stringify(config)], {
		type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `${host.value}.sxcu`;
	link.click();
}
</script>
<template>
  <NuxtLayout>
    <Navigation />
    <div class="flex flex-col gap-6 ml-16 mr-16 mt-16">
      <p class="self-start">ShareX Config</p>
      <p>This page gives you a configuration that you can use in <a href="https://getsharex.com/"
          class="text-blue">ShareX</a> to upload
        screenshots. It is also possible to upload from other methods as long as it's in the same format, which will say
        multi-part form where `d` is the file and `key` is your upload key.</p>
      <div class="flex gap-3 self-end">
        <button class="bg-[#09090b] border border-[#27272a] p-3 rounded-md text-sm font-semibold cursor-pointer"
          @click.prevent=" showRaw = !showRaw">Show
          raw config</button>
        <button class="bg-[#057a55] p-3 rounded-md text-sm font-semibold cursor-pointer"
          @click.prevent="downloadConfig">Download</button>
      </div>
      <div class="w-full" v-if="showRaw">
        <VCodeBlock class="text-sm" :code="configRef" highlightjs :label="host + '.sxcu'" lang="json"
          theme="neon-bunny" />
      </div>
    </div>
  </NuxtLayout>
</template>
