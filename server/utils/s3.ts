import { S3Client } from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || '',
  // port: Number.parseInt(process.env.S3_PORT || "9000"),
  // useSSL: process.env.S3_SSL == 'true',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
  region: process.env.S3_REGION || 'us-east-1',
  forcePathStyle: true,
});
