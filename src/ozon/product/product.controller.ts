import { Body, Controller, Get, Next, Post, Response } from '@nestjs/common';
import { TopProduct } from '@prisma/client';
import { ResponseModel } from 'common/models';
import { TExtendedRequestBody } from 'common/types';
import { NextFunction, Response as EResponse } from 'express';
import xlsx from 'node-xlsx';
import {
  DetailedProductInfoRequestModel,
  ProductCompetitorsRequestModel,
  ProductInfoRequestModel,
  ProductModel,
  TProductDescriptionRequest
} from 'ozon/models';
import { ozonProductApi } from 'ozon/ozon-product-api';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/clear_product_competitor_duplicates')
  public async clearProductCompetitorDuplicates(
    @Body() data: TExtendedRequestBody,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const result =
        await this.productService.clearProductCompetitorDuplicates();
      res.json(new ResponseModel(result));
    } catch (error) {
      next(error);
    }
  }

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

  @Get('/download_competitors')
  public async downloadCompetitors(
    @Body() data: TExtendedRequestBody,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const competitors = await this.productService.getSortedProductCompetitors(
        data.user.id
      );
      const header = [
        'Идентификатор',
        'Ссылка',
        'Аватар',
        'Название',
        'Новая цена',
        'Старая цена',
        'Рейтинг',
        'Комментарии',
        'Идентификатор продукта'
      ];
      const array = competitors.map((product: TopProduct) =>
        Object.values(product)
      );
      array.unshift(header);
      const buffer = xlsx.build([
        {
          name: 'Ozon Competitors',
          data: array,
          options: {
            '!cols': [
              {
                width: 36
              },
              {
                width: 20
              },
              {
                width: 20
              },
              {
                width: 50
              },
              {
                width: 15
              },
              {
                width: 15
              },
              {
                width: 15
              },
              {
                width: 15
              }
            ]
          }
        }
      ]);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment');
      res.write(buffer, 'binary');
      res.end(null, 'binary');
    } catch (error) {
      next(error);
    }
  }

  @Get('/download_top')
  public async downloadTopProducts(
    @Body() data: TExtendedRequestBody,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const topProducts = await this.productService.getTopProducts(false);
      const header = [
        'Идентификатор',
        'Ссылка',
        'Аватар',
        'Название',
        'Новая цена',
        'Старая цена',
        'Рейтинг',
        'Комментарии'
      ];
      const array = topProducts.map((product: TopProduct) =>
        Object.values(product)
      );
      array.unshift(header);
      const buffer = xlsx.build([
        {
          name: 'Ozon Top Products',
          data: array,
          options: {
            '!cols': [
              {
                width: 36
              },
              {
                width: 20
              },
              {
                width: 20
              },
              {
                width: 50
              },
              {
                width: 15
              },
              {
                width: 15
              },
              {
                width: 15
              },
              {
                width: 15
              }
            ]
          }
        }
      ]);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', 'attachment');
      res.write(buffer, 'binary');
      res.end(null, 'binary');
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
      const competitors = await this.productService.getProductCompetitors(
        data.user.id,
        data.productId,
        data.refresh
      );
      res.json(new ResponseModel({ competitors }));
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
      const productInfo = await this.productService.getProductDetailInfo(
        data.user,
        new ProductInfoRequestModel(data)
      );
      res.json(new ResponseModel({ productInfo }));
    } catch (error) {
      next(error);
    }
  }

  @Post('/description')
  public async getProductDescription(
    @Body() data: TExtendedRequestBody & TProductDescriptionRequest,
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const result = await ozonProductApi.productDescription(data.user, {
        ...data
      });
      res.json(new ResponseModel(result));
    } catch (error) {
      next(error);
    }
  }

  @Post('/products_with_competitors')
  public async getProductsWithCompetitors(
    @Body() data: TExtendedRequestBody & { refresh?: boolean },
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const productsWithCompetitors =
        await this.productService.getAllProductsCompetitors(
          data.user.id,
          data.refresh
        );
      res.json(new ResponseModel({ products: productsWithCompetitors }));
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
  public async getTopProducts(
    @Body() data: TExtendedRequestBody & { refresh?: boolean },
    @Response() res: EResponse,
    @Next() next: NextFunction
  ) {
    try {
      const topProducts = await this.productService.getTopProducts(
        data.refresh
      );
      res.json(new ResponseModel({ topProducts }));
    } catch (error) {
      next(error);
    }
  }
}
