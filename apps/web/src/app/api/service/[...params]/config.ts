import { API_BASE_URL } from '@/consts';
import { HttpMethod } from './types';

export const CONFIG = {
	API_BASE_URL: API_BASE_URL,
	TOKEN_REFRESH_BUFFER_PERCENT: 0.1, // 10% from token lifespan
	METHODS_WITH_BODY: ['POST', 'PUT', 'PATCH', 'DELETE'] as const satisfies readonly HttpMethod[],
} as const;
