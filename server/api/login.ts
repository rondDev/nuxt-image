import { db } from '../utils/db.ts';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = await db.selectFrom('users').where('username', '=', body.username).executeTakeFirst();
  if (user) {
    console.log(user);
  } else {
    console.log('No user');
  }
});
