type TProductInfoRequest = {
  offer_id?: string;
  product_id?: number;
  sku?: number;
};

export class ProductInfoRequestModel implements TProductInfoRequest {
  offer_id = '';
  product_id = 0;
  sku = 0;

  constructor(data: Partial<ProductInfoRequestModel>) {
    Object.keys(data).forEach((key: string) => {
      if (key in this) {
        this[key] = data[key];
      }
    });
  }
}
