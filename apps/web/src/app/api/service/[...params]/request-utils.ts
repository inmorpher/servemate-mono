import { NextRequest } from 'next/server';
import { CONFIG } from './config';
import { ApiError } from './errors';
import { HttpMethod } from './types';

function isMethodWithBody(method: string): method is HttpMethod {
	return CONFIG.METHODS_WITH_BODY.includes(method as HttpMethod);
}

export async function buildServiceRequest(
	request: NextRequest,
	pathParams: string[],
	accessToken: string,
) {
	const url = new URL(request.url);
	const queryParams = url.searchParams.toString();
	const apiPath = pathParams
		.map((segment) => {
			if (
				!segment ||
				segment === '.' ||
				segment === '..' ||
				/[\\/\u0000-\u001f\u007f]/.test(segment)
			) {
				throw new ApiError('Invalid API path', 400, false);
			}
			return encodeURIComponent(segment);
		})
		.join('/');
	const serviceUrl = `${CONFIG.API_BASE_URL}/${apiPath}${queryParams ? `?${queryParams}` : ''}`;

	const headers = new Headers();
	['accept', 'accept-language', 'content-type'].forEach((header) => {
		const value = request.headers.get(header);
		if (value) headers.set(header, value);
	});
	headers.set('Authorization', `Bearer ${accessToken}`);

	const rawBody = isMethodWithBody(request.method) ? await request.text() : undefined;
	const body = rawBody && rawBody.trim().length > 0 ? rawBody : undefined;

	return { serviceUrl, headers, body };
}
