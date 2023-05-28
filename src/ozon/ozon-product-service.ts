import { TUserCredentials } from 'types';
import { TProductInfoRequestModel } from './models';
import { OzonEndpointsEnum } from './ozon-endpoints.enum';
import { OzonRequestService } from './ozon-request-service';

class OzonProductService {
  public async productInfo(
    credentials: TUserCredentials,
    data: TProductInfoRequestModel
  ): Promise<any> {
    const request = new OzonRequestService(credentials);
    const url = process.env.OZON_API_URL + OzonEndpointsEnum.PRODUCT_INFO;
    return await request.axios.post(url, data);
  }

  public async productList(
    credentials: TUserCredentials,
    data: any
  ): Promise<any> {
    const request = new OzonRequestService(credentials);
    const url = process.env.OZON_API_URL + OzonEndpointsEnum.PRODUCT_LIST;
    return await request.axios.post(url, data);
  }
}

export const ozonProductService = new OzonProductService();
