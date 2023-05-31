import { Body, Controller, Next, Post, Response } from '@nestjs/common';
import { NextFunction, Response as EResponse } from 'express';
import { ResponseModel } from 'models';
import { ProductInfoRequestModel } from 'ozon/models';
import { ozonProductService } from 'ozon/ozon-product-service';
import { TExtendedRequestBody } from 'types';

@Controller('product')
export class ProductController {
  @Post('/info')
  public async getInfo(
    @Body() data: TExtendedRequestBody & ProductInfoRequestModel,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const productInfo = await ozonProductService.productInfo(
        data.user,
        new ProductInfoRequestModel(data)
      );
      res.json(new ResponseModel({ productInfo }));
    } catch (error) {
      next(error);
    }
  }

  @Post('/list')
  public async getList(
    @Body() data: TExtendedRequestBody,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const products = await ozonProductService.productList(data.user, {});
      res.json(new ResponseModel({ products }));
    } catch (error) {
      next(error);
    }
  }
}
