import { Body, Controller, Next, Post, Response } from '@nestjs/common';
import { ResponseModel } from 'common/models';
import { TExtendedRequestBody } from 'common/types';
import { NextFunction, Response as EResponse } from 'express';
import {
  DetailedProductInfoRequestModel,
  ProductCompetitorsRequestModel,
  ProductInfoRequestModel,
  ProductModel
} from 'ozon/models';
import { ozonProductApi } from 'ozon/ozon-product-api';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/create')
  public async create(
    @Body() data: TExtendedRequestBody & ProductModel,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const product = await this.productService.createOne(
        ProductModel.fromServer(data, data.user.id)
      );
      res.json(new ResponseModel({ product }));
    } catch (error) {
      next(error);
    }
  }

  @Post('/competitors')
  public async getCompetitors(
    @Body() data: TExtendedRequestBody & ProductCompetitorsRequestModel,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      if (data.productId) {
        const competitorProducts =
          await this.productService.getProductCompetitors(
            data.user.id,
            data.productId,
            data.count
          );
        res.json(new ResponseModel({ competitors: competitorProducts }));
      }

      const allCompetitorProducts =
        await this.productService.getAllProductsCompetitors(data.user.id);
      res.json(new ResponseModel({ competitors: allCompetitorProducts }));
    } catch (error) {
      next(error);
    }
  }

  @Post('/detailed_list')
  public async getDetailedList(
    @Body() data: TExtendedRequestBody & DetailedProductInfoRequestModel,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const productList = await this.productService.getDetailedList(
        data.productsInfo,
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
      const productInfo = await ozonProductApi.productInfo(
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
      const products = await ozonProductApi.productList(data.user, {});
      res.json(new ResponseModel({ products }));
    } catch (error) {
      next(error);
    }
  }

  @Post('/top')
  public async getUserCompetitors(
    @Body() data: TExtendedRequestBody & { count?: number },
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const topProducts = await this.productService.getTopProducts();
      res.json(new ResponseModel({ sellerCompetitors: topProducts }));
    } catch (error) {
      next(error);
    }
  }
}
