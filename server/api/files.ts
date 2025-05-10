import adze from 'adze';
import { db } from '../utils/db';

export default defineEventHandler(async (event) => {
	try {
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
