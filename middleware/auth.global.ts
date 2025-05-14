import { useUserStore } from '~/stores/user';
import adze from 'adze';

export default async function defineNuxtRouteMiddleware() {
  if (import.meta.client) return;
  const user = useUserStore();
  try {
    const session = useCookie('session').value;
    if (!session) {
      throw new Error('No user session');
    }

    const res = await $fetch('/api/verify-session');
    if (res.valid) {
      const u = res.user;
      user.$patch({
        id: u.id,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        username: u.username,
        email: u.email,
        prefs: u.prefs,
        uploadKey: u.uploadKey,
      });
      adze.info('[middleware | user.$state]', user.$state);
    }
  } catch (e) {
    adze.error('[auth.global.ts | catch]', e);
  }
}
