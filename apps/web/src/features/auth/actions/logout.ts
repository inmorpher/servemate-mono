'use server';

import { getSession, destroySession } from '@/app/lib/session';
import { API_BASE_URL } from '@/consts';

export async function logoutAction(): Promise<{ success: boolean }> {
	const session = await getSession();

	try {
		if (session?.accessToken && API_BASE_URL) {
			await fetch(`${API_BASE_URL}/auth/logout`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ refreshToken: session.refreshToken }),
				cache: 'no-store',
			});
		}
	} catch (error) {
		console.error('[logoutAction] Backend logout failed:', error);
	} finally {
		await destroySession();
	}

	return { success: true };
}