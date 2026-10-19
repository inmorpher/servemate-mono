import { getSession } from '@/app/lib/session';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
	const session = await getSession();

	if (!session?.accessToken) {
		throw new Error('No access token found');
	}
	try {
		const response = fetch(url, {
			...options,
			headers: {
				...options.headers,
				Authorization: `Bearer ${session.accessToken}`,
			},
		});

		return (await response).json();
	} catch (error) {
		console.error('Error fetching data with auth:', error);
	}
};
