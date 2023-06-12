import { Body, Controller, Next, Post, Response } from '@nestjs/common';
import { AppService } from 'app.service';
import { TExtendedRequestBody } from 'common/types';
import { NextFunction, Response as EResponse } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('page-source')
  async getPageSource(
    @Body() data: TExtendedRequestBody & { url: string },
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const result = await this.appService.getPageSource(data.url);
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
}
