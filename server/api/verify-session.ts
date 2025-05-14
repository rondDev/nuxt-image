import adze from 'adze';

export default defineEventHandler(async (event) => {
  try {
    const c = getCookie(event, 'session');
    if (!c) {
      return {
        user: undefined,
        valid: false,
      };
    }
    const s = await db
      .selectFrom('sessions')
      .where('sessionToken', '=', c)
      .select(['userId'])
      .executeTakeFirstOrThrow();

    const u = await db
      .selectFrom('users')
      .innerJoin('file_upload_keys', 'users.id', 'file_upload_keys.userId')
      .where('users.id', '=', s.userId)
      .select([
        'users.id',
        'users.createdAt',
        'users.updatedAt',
        'users.username',
        'users.email',
        'users.prefs',
        'file_upload_keys.uploadKey',
      ])
      .executeTakeFirstOrThrow();
    return {
      user: u,
      valid: !!u,
    };
  } catch (e) {
    adze.error('[verify-session.ts | catch]', e);
  }
});
