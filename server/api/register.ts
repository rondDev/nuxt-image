import { db } from '../utils/db.ts';
import { createId } from '../utils/cuid.ts';
import * as argon2 from 'argon2';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = await db.selectFrom('users').where('username', '=', body.username).executeTakeFirst();
  if (user) {
    return {
      error: `User by the username ${body.username} is already registered.`,
    };
  }

  try {
    const hashedPassword = await argon2.hash(body.password);
    await db
      .insertInto('users')
      .values({
        id: createId(),
        username: body.username,
        password: hashedPassword,
      })
      .executeTakeFirst();
  } catch (e) {
    return {
      error: 'Error occured',
      errorObject: e,
    };
  }

  return {
    response: 'User successfully registered',
  };
});
