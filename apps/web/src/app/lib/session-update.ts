'use server';

import { jwtDecode } from 'jwt-decode';
import { getSession, type ISessionData } from './session';

interface DecodedToken {
	exp: number;
	iat?: number;
	id?: number;
	email?: string;
	role?: string;
}

interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

/**
 * Централизованная функция для обновления сессии с новыми токенами
 * Автоматически декодирует expiresAt из JWT exp claim (в миллисекундах)
 *
 * @param tokens - Объект с accessToken и refreshToken от backend'а
 * @param additionalData - Опциональные дополнительные данные для сохранения в сессию
 */
export async function updateSessionWithTokens(
	tokens: TokenResponse,
	additionalData?: Partial<ISessionData>,
): Promise<void> {
	try {
		const session = await getSession();

		// Декодируем токен для получения expiresAt
		const decoded = jwtDecode<DecodedToken>(tokens.accessToken);

		if (!decoded.exp) {
			throw new Error('Invalid token: no exp claim found');
		}

		// Обновляем основные поля
		session.accessToken = tokens.accessToken;
		session.refreshToken = tokens.refreshToken;
		session.expiresAt = decoded.exp * 1000; // ✅ Конвертируем из секунд в миллисекунды в одном месте!

		// Добавляем дополнительные данные если были переданы
		if (additionalData) {
			Object.assign(session, additionalData);
		}

		await session.save();
	} catch (error) {
		console.error('[Session Update] Error session  :', error);
		throw error;
	}
}
