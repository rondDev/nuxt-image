import { db } from '../utils/db';
import { createId } from '../utils/cuid';
import * as argon2 from 'argon2';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const Login = z.object({
    username: z.string().min(4).max(64),
    password: z.string().min(8).max(128),
  });
  Login.parse(body);

  const user = await db.selectFrom('users').where('username', '=', body.username).executeTakeFirst();
  if (user) {
    return {
      error: `User by the username ${body.username} is already registered.`,
    };
  }

  try {
    const hashedPassword = await argon2.hash(body.password);
    const user = await db
      .insertInto('users')
      .values({
        id: createId(),
        username: body.username,
        password: hashedPassword,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow();

    await db
      .insertInto('file_upload_keys')
      .values({
        id: createId(),
        uploadKey: uuidv4(),
        userId: user.id,
      })
      .executeTakeFirstOrThrow();
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
