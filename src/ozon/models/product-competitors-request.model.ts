type TProductCompetitorsRequest = {
  productId: string;
  refresh?: boolean;
};

export class ProductCompetitorsRequestModel
  implements TProductCompetitorsRequest
{
  productId: string;
  refresh?: boolean;

  constructor(data: Partial<ProductCompetitorsRequestModel>) {
    Object.keys(data).forEach((key: string) => {
      if (key in this) {
        this[key] = data[key];
      }
    });
  }
}
