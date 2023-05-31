import { Body, Controller, Next, Post, Response } from '@nestjs/common';
import { User } from '@prisma/client';
import { NextFunction, Response as EResponse } from 'express';
import { ResponseModel } from 'models';
import { TExtendedRequestBody, TUserCredentials } from 'types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/check_auth')
  public async checkAuth(
    @Body() data: TExtendedRequestBody,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const user = data.user;
      res.json(new ResponseModel({ user }));
    } catch (error) {
      next(error);
    }
  }

  @Post('/create')
  public async create(
    @Body() data: Pick<User, 'clientId' | 'apiKey'>,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const user = await this.userService.createOne(data);
      res.json(new ResponseModel({ user }));
    } catch (error) {
      next(error);
    }
  }

  @Post('/find')
  public async find(
    @Body() data: Partial<User>,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const user = await this.userService.find(data);
      res.json(new ResponseModel({ user }));
    } catch (error) {
      next(error);
    }
  }

  @Post('/login')
  public async login(
    @Body() data: TUserCredentials,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const user = await this.userService.tryLogin(data);
      res.json(new ResponseModel({ user }));
    } catch (error) {
      next(error);
    }
  }
}
