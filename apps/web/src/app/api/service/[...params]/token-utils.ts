import { destroySession, getSession } from '@/app/lib/session';
import { updateSessionWithTokens } from '@/app/lib/session-update';
import { jwtDecode } from 'jwt-decode';
import { CONFIG } from './config';
import { ApiError } from './errors';
import { DecodedToken, SessionData, TokenResponse } from './types';

export async function getValidatedTokenFromSession(): Promise<TokenResponse> {
	const session = (await getSession()) as SessionData;

	if (!session?.refreshToken || !session?.accessToken) {
		throw new ApiError('Unauthorized: No session or token found', 401, true);
	}

	const now = Math.floor(Date.now() / 1000);
	let decoded: DecodedToken;
	try {
		decoded = jwtDecode<DecodedToken>(session.accessToken);
	} catch {
		throw new ApiError('Invalid token format', 401, true);
	}

	if (!decoded.exp || !decoded.iat) {
		throw new ApiError('Invalid token format', 401, true);
	}

	const tokenLifeTime = decoded.exp - decoded.iat;
	const refreshBuffer = Math.floor(tokenLifeTime * CONFIG.TOKEN_REFRESH_BUFFER_PERCENT);
	const isExpiringSoon = decoded.exp - refreshBuffer <= now;

	if (isExpiringSoon) {
		return deduplicatedRefresh(session);
	}

	return {
		accessToken: session.accessToken,
		refreshToken: session.refreshToken,
	};
}

export async function forceRefreshToken(): Promise<TokenResponse> {
	const session = (await getSession()) as SessionData;

	if (!session?.refreshToken) {
		throw new ApiError('No refresh token available', 401, true);
	}

	return deduplicatedRefresh(session);
}

/**
 * Единая точка дедупликации — если рефреш уже идёт, ждём его.
 * Если нет — запускаем и сбрасываем промис после завершения.
 */
const refreshPromises = new Map<string, Promise<TokenResponse>>();

async function deduplicatedRefresh(session: SessionData): Promise<TokenResponse> {
	const key = session.refreshToken;
	if (!key) {
		throw new ApiError('No refresh token available', 401, true);
	}

	const existing = refreshPromises.get(key);
	if (existing) {
		return existing;
	}

	const promise = refreshTokenInternal(session);
	refreshPromises.set(key, promise);

	try {
		return await promise;
	} finally {
		refreshPromises.delete(key);
	}
}

async function refreshTokenInternal(session: SessionData): Promise<TokenResponse> {
	let response: Response;
	try {
		response = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh-token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refreshToken: session.refreshToken }),
			cache: 'no-store',
		});
	} catch {
		throw new ApiError('Token refresh service unavailable', 503, false);
	}

	if (!response.ok) {
		if (response.status === 401 || response.status === 403) {
			await destroySession();
			throw new ApiError('Token refresh failed', 401, true);
		}
		throw new ApiError('Token refresh service unavailable', 503, false);
	}

	const tokenData: TokenResponse = await response.json();
	await updateSessionWithTokens(tokenData);

	return tokenData;
}
