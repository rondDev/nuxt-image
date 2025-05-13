import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../utils/s3';
import cryptoRandomString from 'crypto-random-string';
import { ContentFileType } from '@nuxt/content';
import { db } from '../utils/db';
import { createId } from '../utils/cuid';
import mime from 'mime-types';
import adze from 'adze';

export default defineEventHandler(async (event) => {
  try {
    const formDataBody = await readMultipartFormData(event);
    if (!formDataBody) {
      return {
        error: 'No data provided',
      };
    }
    let fileObject: {
      name: string;
      filename: string | undefined;
      type: string | undefined;
      data: Buffer;
    };
    let uploadKey = '';
    let randomizeFilename = false;
    for (const item of formDataBody) {
      if (item.name === 'd') {
        fileObject = {
          name: item.name,
          filename: item.filename,
          type: item.type,
          data: item.data,
        };
      } else if (item.name === 'key') {
        uploadKey = item.data.toString();
      } else if (item.name === 'randomize_filename') {
        randomizeFilename = item.data.toString() === 'true';
      }
    }
    if (!uploadKey) {
      setResponseStatus(event, 401);
      return {
        error: 'Unauthorized',
      };
    }
    if (!fileObject) {
      return {
        error: "Couldn't parse a file object or no files were provided",
      };
    }

    const user = await db
      .selectFrom('users')
      .innerJoin('file_upload_keys as file', 'file.userId', 'users.id')
      .where('file.uploadKey', '=', uploadKey)
      .select(['users.id', 'username'])
      .executeTakeFirst();

    if (!user) {
      adze.error('[api/upload] Upload key invalid');
      return {
        error: 'Upload key invalid',
      };
    }

    const fileNameRand = cryptoRandomString({
      length: 12,
      type: 'alphanumeric',
    });
    // NOTE: Might need to add file extension to the random name
    const fileName = randomizeFilename ? fileNameRand : fileObject.filename;
    const fileKey = `${user.username}/${fileName}`;

    const file = await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET || 'image',
        Key: fileKey,
        ContentType: fileObject.type,
        Body: fileObject.data,
      }),
    );
    await db
      .insertInto('files')
      .values({
        id: createId(),
        fileName: fileNameRand,
        fileSize: bytesToSize(Buffer.byteLength(fileObject.data)),
        mimeType: mime.lookup(fileObject.filename || ''),
        bucket: process.env.S3_BUCKET || 'image',
        key: fileKey,
        userId: user.id,
      })
      .execute();
    return {
      url: `https://i.rond.cc/${fileNameRand}`,
    };
  } catch (e) {
    adze.error('[api/upload | catch]', e);
    return {
      error: e,
    };
  }
});
