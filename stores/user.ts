import { defineStore } from '#imports';
export const useUserStore = defineStore('user', {
	state: () => ({
		id: undefined,
		createdAt: undefined,
		updatedAt: undefined,
		username: undefined,
		email: undefined,
		prefs: undefined,
		uploadKey: undefined,
	}),
});
