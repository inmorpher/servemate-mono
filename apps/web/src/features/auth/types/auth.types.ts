import type {
	AuthenticatedUser,
	LoginResult,
	UserLoginDto,
} from '@servemate/shared-dto';

export type AuthLoginRequest = UserLoginDto;
export type AuthLoginResponse = LoginResult;

export type AuthMeResponse = {
	user: AuthenticatedUser | null;
};

export type AuthUser = AuthenticatedUser;
