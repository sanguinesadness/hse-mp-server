import { ProductInfoRequestModel } from './product-info-request.model';

type TDetailedProductInfoRequest = {
  productsInfo?: Array<ProductInfoRequestModel>;
};

export class DetailedProductInfoRequestModel
  implements TDetailedProductInfoRequest
{
  productsInfo: Array<ProductInfoRequestModel> = [];

  constructor(data: Partial<DetailedProductInfoRequestModel>) {
    Object.keys(data).forEach((key: string) => {
      if (key in this) {
        this[key] = data[key];
      }
    });
  }
}
