import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'user/user.service';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const apiKey = req.headers['api-key'] as string;
      const clientId = req.headers['client-id'] as string;

      if (!apiKey || !clientId) {
        throw new UnauthorizedException();
      }
      const credentials = { apiKey, clientId };
      const user = await this.userService.tryLogin(credentials);
      req.body.user = user;
      res.setHeader('Api-Key', user.apiKey);
      res.setHeader('Client-Id', user.clientId);
      next();
    } catch (error) {
      next(error);
    }
  }
}
