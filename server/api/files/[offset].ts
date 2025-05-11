import adze from 'adze';
import { db } from '../../utils/db';
import { s3Client } from '../../utils/s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export default defineEventHandler(async (event) => {
	try {
		const offsetParam = getRouterParam(event, 'offset');
		const offset = (() => {
			if (offsetParam && offsetParam.length < 1) {
				return 0;
			}
			try {
				const n = Number.parseInt(offsetParam || '0');
				return n;
			} catch (e) {
				adze.error('[api/files | offset]', e);
				return 0;
			}
		})();
		const cookie = getCookie(event, 'session');
		const user = await db
			.selectFrom('sessions')
			.where('sessionToken', '=', cookie)
			.select(['userId'])
			.executeTakeFirst();
		if (!user) {
			return {
				error: 'User not found',
			};
		}
		const fileData = await db
			.selectFrom('files')
			.where('userId', '=', user.userId)
			.selectAll()
			.orderBy('updatedAt', 'desc')
			.limit(10)
			.offset(offset * 10 || 0)
			.execute();

		if (!fileData) {
			return {
				error: 'File not found',
			};
		}

		const files = [];

		for (const f of fileData) {
			const fileData = await db
				.selectFrom('files')
				.where('fileName', '=', f.fileName)
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
			files.push({
				fileName: f.fileName,
				size: bytesToSize(file.ContentLength || 0),
				contentType: file.ContentType,
				updatedAt: f.updatedAt,
			});
		}
		return {
			files: files,
		};
	} catch (e) {
		adze.error('[api/files | catch]', e);
		return {
			files: {},
			error: e,
		};
	}
});
