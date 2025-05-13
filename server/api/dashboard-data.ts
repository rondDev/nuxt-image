import { GetObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import { db } from '../utils/db';
import { s3Client } from '../utils/s3';
import adze from 'adze';
import { bytesToSize } from '../utils/files';

export default defineEventHandler(async (event) => {
  try {
    const cookie = getCookie(event, 'session');
    const user = await db
      .selectFrom('sessions')
      .where('sessionToken', '=', cookie)
      .innerJoin('users', 'users.id', 'sessions.userId')
      .select(['users.id', 'users.username'])
      .executeTakeFirst();
    if (!user) {
      return {
        error: 'User not found',
      };
    }

    const userFileCount = await db
      .selectFrom('files')
      .select([(c) => c.fn.count('id').as('count')])
      .where('userId', '=', user.id)
      .executeTakeFirstOrThrow();
    adze.info('userFileCount', userFileCount);

    if (!userFileCount) {
      return {
        error: 'Could not get amount of files for user',
      };
    }

    const totalFileCount = await db
      .selectFrom('files')
      .select([(c) => c.fn.count('id').as('count')])
      .executeTakeFirstOrThrow();
    adze.info('totalFileCount', totalFileCount);

    const userCount = await db
      .selectFrom('users')
      .select([(c) => c.fn.count('id').as('count')])
      .executeTakeFirstOrThrow();

    if (!totalFileCount) {
      return {
        error: 'Could not get amount of total files',
      };
    }

    let totalUserSize = 0;
    const userObjects = await s3Client.send(
      new ListObjectsCommand({
        Bucket: 'image-uploader',
        Prefix: `${user.username}/`,
      }),
    );
    if (!userObjects.Contents) {
      return {
        error: 'Contents is empty',
      };
    }
    for (const o of userObjects.Contents) {
      if (o.Size) {
        totalUserSize += o.Size;
      }
    }

    let totalSize = 0;
    const allObjects = await s3Client.send(
      new ListObjectsCommand({
        Bucket: 'image-uploader',
      }),
    );
    if (!allObjects.Contents) {
      return {
        error: 'Contents is empty',
      };
    }
    for (const o of allObjects.Contents) {
      if (o.Size) {
        totalSize += o.Size;
      }
    }

    adze.log(bytesToSize(totalUserSize)); //your answer

    return {
      userTotal: userFileCount.count,
      total: totalFileCount.count,
      userSize: bytesToSize(totalUserSize),
      totalSize: bytesToSize(totalSize),
      userCount: userCount.count,
    };

    // const fileData = await db
    //   .selectFrom('files')
    //   .where('fileName', '=', fileUrl)
    //   .selectAll()
    //   .executeTakeFirst();
    //
    // if (!fileData) {
    //   return {
    //     error: 'File not found',
    //   };
    // }
    //
    // const file = await s3Client.send(
    //   new GetObjectCommand({
    //     Bucket: fileData.bucket,
    //     Key: fileData.key,
    //   }),
    // );
    // const s = file.Body?.transformToWebStream();
    // if (!s) {
    //   return {
    //     error: 'No file found',
    //   };
    // }
    // return sendStream(event, s);
  } catch (e) {
    return {
      error: e,
    };
  }
});
