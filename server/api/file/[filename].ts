import { GetObjectCommand } from '@aws-sdk/client-s3';
import { db } from '../../utils/db';
import { s3Client } from '../../utils/s3';

export default defineEventHandler(async (event) => {
  try {
    const fileUrl = getRouterParam(event, 'filename');
    if (!fileUrl) {
      return {
        error: 'No file url specified',
      };
    }
    const fileData = await db
      .selectFrom('files')
      .where('fileName', '=', fileUrl)
      .selectAll()
      .executeTakeFirst();

    if (!fileData) {
      return {
        error: 'File not found',
      };
    }

    const file = await s3Client.send(
      new GetObjectCommand({
        Bucket: fileData.bucket,
        Key: fileData.key,
      }),
    );
    const s = file.Body?.transformToWebStream();
    if (!s) {
      return {
        error: 'No file found',
      };
    }
    return sendStream(event, s);
  } catch (e) {
    return {
      error: e,
    };
  }
});
