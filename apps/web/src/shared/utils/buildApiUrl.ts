import { buildQueryParams } from './buildQueryParams';

export const buildApiUrl = (endpoint: string, params: Record<string, unknown> = {}): string => {
	const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

	let url = `/api/service${normalizedEndpoint}`;

	if (params && Object.keys(params).length > 0) {
		const queryString = buildQueryParams(params);
		if (queryString) {
			url += `?${queryString}`;
		}
	}

	return url;
};
