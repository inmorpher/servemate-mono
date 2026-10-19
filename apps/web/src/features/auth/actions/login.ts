'use server';

import { getSession } from '@/app/lib/session';
import { API_BASE_URL } from '@/consts';
import { getSafeInternalPath } from '@/shared/utils/safeInternalPath';
import { jwtDecode } from 'jwt-decode';
import { redirect } from 'next/navigation';

export interface ILoginFormInputs {
	email: string;
	password: string;
}

interface JwtPayload {
	exp: number;
	id: number;
	email?: string;
	role?: string;
}

export async function loginAction(formData: ILoginFormInputs, callbackUrl: string) {
	try {
		console.log('[loginAction] Form data:', formData);
		console.log('API_BASE_URL:', API_BASE_URL);
		const { email, password } = formData;

		const response = await fetch(`${API_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
			cache: 'no-store',
		});

		if (!response.ok) {
			const error = await response.json();
			console.error('[loginAction] Ошибка авторизации:', error);
			throw new Error(error.message || 'Ошибка авторизации');
		}

		// Receive access and refresh tokens
		const { accessToken, refreshToken } = await response.json();

		// Decode the access token to get expiration time and user ID
		const decodedToken = jwtDecode<JwtPayload>(accessToken);
		const expiresAt = decodedToken.exp * 1000; // Переводим в миллисекунды
		const userId = decodedToken.id;
		const role = decodedToken.role || 'user';

		// Get session and update it
		const session = await getSession();
		session.accessToken = accessToken;
		session.refreshToken = refreshToken;
		session.expiresAt = expiresAt; // Устанавливаем время истечения токена
		session.isLoggedIn = true;
		session.userId = userId;
		session.role = role;
		session.lastChecked = Date.now(); // Добавляем время последней проверки токена

		// Save session
		await session.save();
	} catch (error) {
		console.error('[loginAction] Error:', error);
		throw error instanceof Error ? error : new Error('Unknown error while logging in');
	}

	redirect(getSafeInternalPath(callbackUrl));
}
