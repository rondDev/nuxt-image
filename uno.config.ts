import { defineConfig, presetWind4 } from 'unocss';

export default defineConfig({
	presets: [presetWind4({ reset: true })],
	rules: [],
	shortcuts: [
		{
			menuBarButton:
				' cursor-pointer transform transition ease-in-out hover:scale-[1.1] hover:translate-y-[-3px] hover:rotate-z-10 hover:color-[#f966abFF] motion-reduce:transition-none motion-reduce:hover:transform-none',
			homepage_card:
				'rounded-2xl w-[12rem] h-[12rem] bg-[#0f172b4b] border-[3px] border-[#0414384b] shadow-sm shadow-purple-700 flex flex-col p-3',
		},
	],
});
