// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	nitro: {
		preset: 'bun',
	},

	runtimeConfig: {
		domain: process.env.DOMAIN,
	},

	modules: [
		'@nuxt/content',
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxt/scripts',
		'@nuxt/test-utils',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@unocss/nuxt',
	],
});
