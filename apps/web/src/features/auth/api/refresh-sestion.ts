'use server';

import { ApiError } from '@/app/api/service/[...params]/errors';
import { forceRefreshToken } from '@/app/api/service/[...params]/token-utils';

export async function refreshSessionAction() {
	try {
		const tokens = await forceRefreshToken();
		return { success: true, token: tokens.accessToken };
	} catch (error: unknown) {
		return {
			success: false,
			retryable: !(error instanceof ApiError) || !error.requiresLogin,
		};
	}
}
