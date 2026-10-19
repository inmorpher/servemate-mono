export interface TokenResponse {
	accessToken: string;
	refreshToken: string;
}

export interface DecodedToken {
	exp: number;
	iat: number;
	[key: string]: unknown;
}

export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface SessionData {
	accessToken: string;
	refreshToken: string;
	isLoggedIn: boolean;
	userId?: string;
	expiresAt?: number;
	save: () => Promise<void>;
}
