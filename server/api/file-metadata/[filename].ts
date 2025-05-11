import adze from 'adze';
import { db } from '../../utils/db';
import { s3Client } from '../../utils/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export default defineEventHandler(async (event) => {
	try {
		const filename = getRouterParam(event, 'filename');
		const fileData = await db
			.selectFrom('files')
			.innerJoin('users', 'users.id', 'files.userId')
			.where('fileName', '=', filename)
			.select([
				'files.createdAt',
				'files.bucket',
				'files.key',
				'users.username',
			])
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
		return {
			fileName: filename,
			size: bytesToSize(file.ContentLength || 0),
			contentType: file.ContentType,
			uploadedAt: fileData.createdAt,
			uploader: fileData.username,
		};
	} catch (e) {
		adze.error('[api/files | catch]', e);
		return {
			files: {},
			error: e,
		};
	}
});
