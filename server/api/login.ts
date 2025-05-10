import { db } from '../utils/db';
import { createId } from '../utils/cuid';
import * as argon2 from 'argon2';
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding';
import { encodeHex } from 'oslo/encoding';
import { sha256 } from 'oslo/crypto';

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		const user = await db
			.selectFrom('users')
			.selectAll()
			.where('username', '=', body.username)
			.executeTakeFirst();
		if (!user) {
			console.log('user  doesnt exist');
			return { error: 'User does not exist' };
		}
		const match = await argon2.verify(user.password, body.password);
		if (match) {
			const session = await createSession(generateSessionToken(), user.id);
			setCookie(event, 'session', session.sessionToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				expires: session.expiresAt,
			});
			return { response: 'Signed in!' };
		}
		return { error: 'Data entered did not match any records' };
	} catch (e) {
		console.error(e);
		return {
			error: e,
		};
	}
});

export interface Session {
	id: string;
	sessionToken: string;
	userId: string;
	expiresAt: Date;
}

export async function createSession(
	token: string,
	userId: string,
): Promise<Session> {
	try {
		const data = new TextEncoder().encode(token);
		const sha = await sha256(data);
		const sessionToken = encodeHex(sha);
		const session: Session = {
			id: createId(),
			sessionToken: sessionToken,
			userId,
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		};
		await db
			.insertInto('sessions')
			.values({
				id: session.id,
				sessionToken: session.sessionToken,
				userId: session.userId,
				expire: session.expiresAt,
				//TODO: Potentially add IP, need to get real IP behind Cloudflare DNS
			})
			.execute();
		return session;
	} catch (e) {
		console.log(e);
		return { id: '', sessionToken: '', userId: '', expiresAt: new Date() };
	}
}

function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}
