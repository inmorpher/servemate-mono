import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from './errors';
import { buildServiceRequest } from './request-utils';
import { forceRefreshToken, getValidatedTokenFromSession } from './token-utils';

function getResponseHeaders(response: Response): Headers {
	const headers = new Headers(response.headers);

	['content-encoding', 'content-length', 'transfer-encoding'].forEach((header) => {
		headers.delete(header);
	});

	return headers;
}

async function forwardResponse(response: Response): Promise<Response> {
	const headers = getResponseHeaders(response);

	if (response.status === 204 || response.status === 205 || response.status === 304) {
		return new Response(null, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

async function handler(
	request: NextRequest,
	{ params }: { params: Promise<{ params: string[] }> },
) {
	try {
		const { accessToken } = await getValidatedTokenFromSession();
		const resolvedParams = await params;
		const pathParams = resolvedParams.params || [];

		const { serviceUrl, headers, body } = await buildServiceRequest(
			request,
			pathParams,
			accessToken,
		);

		const response = await fetch(serviceUrl, {
			method: request.method,
			headers,
			body,
		});

		if (response.status === 401) {
			const newTokens = await forceRefreshToken();
			const retryHeaders = new Headers(headers);
			retryHeaders.set('Authorization', `Bearer ${newTokens.accessToken}`);

			const retryResponse = await fetch(serviceUrl, {
				method: request.method,
				headers: retryHeaders,
				body,
			});

			if (retryResponse.status === 401) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}

			return forwardResponse(retryResponse);
		}

		return forwardResponse(response);
	} catch (error) {
		if (error instanceof ApiError) {
			if (error.requiresLogin) {
				return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
			}

			return new Response(JSON.stringify({ error: error.message }), {
				status: error.statusCode,
				headers: { 'Content-Type': 'application/json' },
			});
		}

		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

// Экспортируем обработчики для всех методов
export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT };
