import { S3Client } from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT || '',
  // port: Number.parseInt(process.env.MINIO_PORT || "9000"),
  // useSSL: process.env.MINIO_SSL == 'true',
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || '',
    secretAccessKey: process.env.MINIO_SECRET_KEY || '',
  },
  region: 'us-east-1',
  forcePathStyle: true
})
