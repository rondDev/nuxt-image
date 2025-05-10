import { db } from '../utils/db';
import * as argon2 from 'argon2';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const user = await db.selectFrom('users').selectAll().where('username', '=', body.username).executeTakeFirst();
  if (!user) {
    console.log('user  doesnt exist');
    return { error: 'User does not exist' };
  }
  const match = await argon2.verify(user.password, body.password);
  if (match) {
    return { response: 'Signed in!' };
  }
  return { error: 'Data entered did not match any records' };
});
