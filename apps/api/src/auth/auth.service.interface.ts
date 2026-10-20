import { AuthenticatedUser, UserLoginDto } from '@servemate/shared-dto';
import { LoginResult, SessionMetadata, TokenPair } from '@servemate/shared-dto';

export interface IAuthService {
  login(
    credentials: UserLoginDto,
    metadata?: SessionMetadata
  ): Promise<LoginResult>;
  logout(accessToken?: string, refreshToken?: string): Promise<void>;
  refresh(refreshToken: string, metadata?: SessionMetadata): Promise<TokenPair>;
  me(userId: number): Promise<AuthenticatedUser | null>;
}
