import { db } from '../utils/db';

export default defineEventHandler(async (event) => {
  try {
    const fileData = await db
      .selectFrom('files')
      .where('userId', '=', 'byyrkjgid8sj64uiht50o75d')
      .selectAll()
      .orderBy('updatedAt', 'desc')
      .limit(10)
      .offset(0)
      .execute();

    if (!fileData) {
      return {
        error: 'File not found',
      };
    }

    const files = [];

    for (const f of fileData) {
      files.push(f);
    }
    return files;
  } catch (e) {
    console.log(e);
    return {
      error: e,
    };
  }
});
