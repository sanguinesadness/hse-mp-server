import { Injectable } from '@nestjs/common';
import { DetailedProductInfoRequestModel } from 'ozon/models';
import { ozonProductService } from 'ozon/ozon-product-service';
import { TUserCredentials } from 'types';

@Injectable()
export class ProductService {
  public async getDetailedList(
    products: DetailedProductInfoRequestModel['products'],
    credentials: TUserCredentials
  ): Promise<any> {
    if (!products || products.length < 1) {
      const allProducts = await ozonProductService.productList(credentials);
      products = allProducts.items.map(({ product_id }) => ({ product_id }));
    }

    const promises = products.map((product) =>
      ozonProductService.productInfo(credentials, product)
    );
    return await Promise.all(promises);
  }
}
