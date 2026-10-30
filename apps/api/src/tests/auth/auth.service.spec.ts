import { AuthService } from '../../auth/auth.service';
import { Session } from '../../auth/entities/session.entity';

jest.mock('uuid', () => ({ v4: () => 'session-uuid' }));

jest.mock('../../../env', () => ({
  ENV: {
    PRODUCTION: false,
    PORT: 3001,
    DATABASE_URL: 'postgresql://test',
    JWT_SECRET: 'a'.repeat(32),
    JWT_REFRESH: 'b'.repeat(32),
    JWT_EXPIRES_IN: '1h',
    JWT_REFRESH_EXPIRES_IN: '7d',
    LOG_TO_FILE: false,
  },
}));

const future = () => new Date(Date.now() + 60 * 60 * 1000);

const activeUser = {
  id: 7,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'ADMIN',
  isActive: true,
};

const makeSession = (revokedAt: Date | null = null, rotatedAt: Date | null = null) =>
  new Session('session-1', 7, 'old-jti', future(), null, null, revokedAt, new Date(), rotatedAt);

const LONG_AGO = () => new Date(Date.now() - 60 * 1000);

const setup = () => {
  const tokenService = {
    verifyRefreshToken: jest.fn().mockResolvedValue({ userId: 7, jti: 'old-jti' }),
    generateAccessToken: jest.fn().mockResolvedValue({
      token: 'new-access',
      expiresIn: 3600,
    }),
    generateRefreshToken: jest.fn().mockResolvedValue({
      token: 'new-refresh',
      jti: 'new-jti',
      expiresAt: future(),
    }),
  };
  const usersService = {
    findUserById: jest.fn().mockResolvedValue(activeUser),
  };
  const authRepository = {
    findByJti: jest.fn().mockResolvedValue(makeSession()),
    rotateIfActive: jest.fn().mockResolvedValue(true),
    revokeAllByUser: jest.fn().mockResolvedValue(undefined),
    save: jest.fn().mockResolvedValue(undefined),
  };
  const logger = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };
  const service = new AuthService(
    tokenService as any,
    usersService as any,
    authRepository as any,
    logger as any
  );
  return { service, tokenService, usersService, authRepository };
};

describe('AuthService.refresh', () => {
  it('rotates the refresh token and saves a new session', async () => {
    const { service, authRepository } = setup();

    const result = await service.refresh('old-refresh');

    expect(authRepository.rotateIfActive).toHaveBeenCalledWith(
      'old-jti',
      expect.any(Date)
    );
    expect(authRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 7, refreshJti: 'new-jti' })
    );
    expect(result).toEqual({
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
      expiresIn: 3600,
    });
  });

  it('revokes all sessions when a token is reused after the grace window', async () => {
    const { service, authRepository, tokenService } = setup();
    authRepository.findByJti.mockResolvedValue(makeSession(LONG_AGO(), LONG_AGO()));

    await expect(service.refresh('old-refresh')).rejects.toThrow(
      'Invalid refresh token'
    );

    expect(authRepository.revokeAllByUser).toHaveBeenCalledWith(7);
    expect(tokenService.generateRefreshToken).not.toHaveBeenCalled();
    expect(authRepository.save).not.toHaveBeenCalled();
  });

  it('rejects a rotated token reused within the grace window without ending sessions', async () => {
    const { service, authRepository } = setup();
    authRepository.findByJti.mockResolvedValue(makeSession(new Date(), new Date()));

    await expect(service.refresh('old-refresh')).rejects.toMatchObject({
      statusCode: 401,
    });

    expect(authRepository.revokeAllByUser).not.toHaveBeenCalled();
    expect(authRepository.save).not.toHaveBeenCalled();
  });

  it('revokes all sessions when a logged-out token is replayed within the grace window', async () => {
    const { service, authRepository } = setup();
    authRepository.findByJti.mockResolvedValue(makeSession(new Date(), null));

    await expect(service.refresh('old-refresh')).rejects.toThrow(
      'Invalid refresh token'
    );

    expect(authRepository.revokeAllByUser).toHaveBeenCalledWith(7);
  });

  it('rejects without ending sessions when a concurrent rotation wins the race', async () => {
    const { service, authRepository } = setup();
    authRepository.rotateIfActive.mockResolvedValue(false);
    authRepository.findByJti
      .mockResolvedValueOnce(makeSession())
      .mockResolvedValueOnce(makeSession(new Date(), new Date()));

    await expect(service.refresh('old-refresh')).rejects.toThrow(
      'Invalid refresh token'
    );

    expect(authRepository.revokeAllByUser).not.toHaveBeenCalled();
    expect(authRepository.save).not.toHaveBeenCalled();
  });

  it('rejects refresh for an inactive user without rotating the session', async () => {
    const { service, usersService, authRepository } = setup();
    usersService.findUserById.mockResolvedValue({
      ...activeUser,
      isActive: false,
    });

    await expect(service.refresh('old-refresh')).rejects.toThrow(
      'User not found'
    );

    expect(authRepository.rotateIfActive).not.toHaveBeenCalled();
    expect(authRepository.save).not.toHaveBeenCalled();
  });

  it('returns 401 instead of 500 when the refresh token signature is invalid', async () => {
    const { service, tokenService } = setup();
    tokenService.verifyRefreshToken.mockRejectedValue(new Error('invalid signature'));

    await expect(service.refresh('garbage')).rejects.toMatchObject({
      statusCode: 401,
    });
  });
});
