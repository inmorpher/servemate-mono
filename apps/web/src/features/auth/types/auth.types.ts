import type { paths } from '@/shared/api/api-types';

export type AuthLoginRequest =
	paths['/api/auth/login']['post']['requestBody']['content']['application/json'];
export type AuthLoginResponse =
	paths['/api/auth/login']['post']['responses']['200']['content']['application/json'];

export type AuthMeResponse =
	paths['/api/auth/me']['get']['responses']['200']['content']['application/json'];

export type AuthUser = AuthMeResponse['user'];
