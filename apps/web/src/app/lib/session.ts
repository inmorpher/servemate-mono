'use server';

import { IronSession, SessionOptions, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface ISessionData {
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number;
	isLoggedIn: boolean;
	userId?: number;
	role?: string;
	needsRefresh?: boolean;
	lastChecked?: number;
	refreshCount?: number;
}

const defaultSession: ISessionData = {
	isLoggedIn: false,
	refreshCount: 0,
};

const sessionSecret =
	process.env.SESSION_SECRET ??
	(process.env.NODE_ENV === 'development' ? process.env.NEXTAUTH_SECRET : undefined);

if (!sessionSecret || sessionSecret.length < 32) {
	throw new Error('SESSION_SECRET must be configured and at least 32 characters long');
}

const sessionOptions: SessionOptions = {
	password: sessionSecret,
	cookieName: 'servemate_session',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 7, // 7 days
	},
	ttl: 60 * 60 * 24 * 7, // 7 days
};

export async function getSession(): Promise<IronSession<ISessionData>> {
	const session = await getIronSession<ISessionData>(await cookies(), sessionOptions);

	if (!session.isLoggedIn) {
		Object.assign(session, defaultSession);
	}

	return session;
}

export async function updateSession(data: Partial<ISessionData>): Promise<void> {
	const session = await getSession();

	Object.assign(session, data);

	await session.save();
}

export async function destroySession(): Promise<void> {
	const session = await getSession();
	session.destroy();
}

export async function getSessionOptions(): Promise<SessionOptions> {
	return {
		...sessionOptions,
	};
}
