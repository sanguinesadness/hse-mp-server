type TProductCompetitorsRequest = {
  productId: string;
  count?: number;
};

export class ProductCompetitorsRequestModel
  implements TProductCompetitorsRequest
{
  count?: number;
  productId: string;

  constructor(data: Partial<ProductCompetitorsRequestModel>) {
    Object.keys(data).forEach((key: string) => {
      if (key in this) {
        this[key] = data[key];
      }
    });
  }
}
