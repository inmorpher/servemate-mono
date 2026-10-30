import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { v4 as uidv4 } from 'uuid';
import { BaseService } from '../common/base.service';
import { ILogger } from '../logger/logger.service.interface';
import { TYPES } from '../types';
import { AuthenticatedUser, UserLoginDto } from '@servemate/shared-dto';
import { IUsersService } from '../users/users.service.interface';
import { IAuthRepository } from './auth.repository.interface';
import { IAuthService } from './auth.service.interface';
import type { TokenPair } from '@servemate/shared-dto';
import { LoginResult, SessionMetadata } from '@servemate/shared-dto';
import { ITokenService } from './token.service.interface';

import { HTTPError } from '../errors/http-error.class';
import { Session } from './entities/session.entity';

const REFRESH_REUSE_GRACE_MS = 15_000;

@injectable()
export class AuthService extends BaseService implements IAuthService {
  protected serviceName = 'AuthService';
  constructor(
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
    @inject(TYPES.UsersService) private usersService: IUsersService,
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository,
    @inject(TYPES.ILogger) private logger: ILogger
  ) {
    super();
  }

  async login(
    credentials: UserLoginDto,
    metadata?: SessionMetadata
  ): Promise<LoginResult> {
    try {
      const user = await this.usersService.validateCredentials(credentials);

      if (!user) {
        this.logger.warn('Failed login attempt');
        throw new HTTPError(401, this.serviceName, 'Invalid credentials');
      }

      const [access, refresh] = await Promise.all([
        this.tokenService.generateAccessToken(user),
        this.tokenService.generateRefreshToken(user),
      ]);

      const session = new Session(
        uidv4(),
        user.id,
        refresh.jti,
        refresh.expiresAt,
        metadata?.ipAddress || null,
        metadata?.userAgent || null
      );

      await this.authRepository.save(session);

      return {
        user,
        accessToken: access.token,
        refreshToken: refresh.token,
        expiresIn: access.expiresIn,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(accessToken?: string, refreshToken?: string): Promise<void> {
    try {
      if (accessToken) {
        this.tokenService.revokeAccessToken(accessToken);
      }

      if (refreshToken) {
        try {
          const { jti } =
            await this.tokenService.verifyRefreshToken(refreshToken);
          const session = await this.authRepository.findByJti(jti);

          if (session) {
            session.revoke();
            await this.authRepository.save(session);
          }
        } catch (error) {
          this.handleError(error);
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async refresh(
    refreshToken: string,
    metadata?: SessionMetadata
  ): Promise<TokenPair> {
    try {
      const { jti } = await this.tokenService
        .verifyRefreshToken(refreshToken)
        .catch(() => {
          throw new HTTPError(401, this.serviceName, 'Invalid refresh token');
        });
      const session = await this.authRepository.findByJti(jti);

      if (!session) {
        throw new HTTPError(401, this.serviceName, 'Invalid refresh token');
      }

      if (session.isRevoked()) {
        if (!this.isWithinReuseGrace(session)) {
          // Reuse long after rotation: treat as theft and end every session of that user.
          await this.authRepository.revokeAllByUser(session.userId);
        }
        throw new HTTPError(401, this.serviceName, 'Invalid refresh token');
      }

      if (!session.isActive()) {
        throw new HTTPError(401, this.serviceName, 'Invalid refresh token');
      }

      const user = await this.usersService.findUserById(session.userId);
      if (!user || !user.isActive) {
        throw new HTTPError(401, this.serviceName, 'User not found');
      }

      const claimed = await this.authRepository.rotateIfActive(jti, new Date());
      if (!claimed) {
        // Another request rotated this token first. Only end sessions if that was not a rotation.
        const current = await this.authRepository.findByJti(jti);
        if (!current || !this.isWithinReuseGrace(current)) {
          await this.authRepository.revokeAllByUser(session.userId);
        }
        throw new HTTPError(401, this.serviceName, 'Invalid refresh token');
      }

      const [access, refresh] = await Promise.all([
        this.tokenService.generateAccessToken(user),
        this.tokenService.generateRefreshToken(user),
      ]);

      const newSession = new Session(
        uidv4(),
        user.id,
        refresh.jti,
        refresh.expiresAt,
        metadata?.ipAddress ?? null,
        metadata?.userAgent ?? null
      );

      await this.authRepository.save(newSession);

      return {
        accessToken: access.token,
        refreshToken: refresh.token,
        expiresIn: access.expiresIn,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
  private isWithinReuseGrace(session: Session): boolean {
    const rotatedAt = session.rotatedAt;
    return (
      rotatedAt !== null &&
      Date.now() - rotatedAt.getTime() < REFRESH_REUSE_GRACE_MS
    );
  }

  async me(userId: number): Promise<AuthenticatedUser | null> {
    try {
      const user = await this.usersService.findUserById(userId);
      return user && user.isActive ? (user as AuthenticatedUser) : null;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
