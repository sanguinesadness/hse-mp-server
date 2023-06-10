import { Body, Controller, Next, Post, Response } from '@nestjs/common';
import { NextFunction, Response as EResponse } from 'express';
import { ResponseModel } from 'models';
import {
  DetailedProductInfoRequestModel,
  ProductInfoRequestModel
} from 'ozon/models';
import { ozonProductService } from 'ozon/ozon-product-service';
import { TExtendedRequestBody } from 'types';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/detailed_list')
  public async getDetailedList(
    @Body() data: TExtendedRequestBody & DetailedProductInfoRequestModel,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const productList = await this.productService.getDetailedList(
        data.products,
        data.user
      );
      res.json(new ResponseModel({ productList }));
    } catch (error) {
      next(error);
    }
  }

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

  @Post('/short_list')
  public async getShortList(
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
