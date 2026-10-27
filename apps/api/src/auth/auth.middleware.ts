import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IMiddleware } from '../common/middleware.interface';
import { HTTPError } from '../errors/http-error.class';
import { TYPES } from '../types';
import { IUsersService } from '../users/users.service.interface';
import { ITokenService } from './token.service.interface';

@injectable()
export class AuthMiddleware implements IMiddleware {
  constructor(
    @inject(TYPES.ITokenService) private tokenService: ITokenService,
    @inject(TYPES.UsersService) private usersService: IUsersService
  ) {}

  async execute(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const header = req.headers.authorization;

    if (!header) {
      return next(new HTTPError(401, 'Header', 'Authorization header missing'));
    }

    const [scheme, token, extra] = header.split(' ');

    if (scheme !== 'Bearer' || !token || extra) {
      return next(
        new HTTPError(401, 'Header', 'Invalid Authorization header format')
      );
    }

    let payload;
    try {
      payload = await this.tokenService.verifyAccessToken(token);
    } catch (error) {
      return next(new HTTPError(401, 'Token', 'Invalid token'));
    }

    try {
      const user = await this.usersService.findUserById(payload.id);
      if (!user || !user.isActive) {
        return next(new HTTPError(401, 'Token', 'Invalid token'));
      }
    } catch (error) {
      return next(new HTTPError(401, 'Token', 'Invalid token'));
    }

    req.user = payload;
    return next();
  }
}
