import { TUserCredentials } from 'types';
import { ProductInfoRequestModel } from './models';
import { OzonEndpointsEnum } from './ozon-endpoints.enum';
import { OzonRequestService } from './ozon-request-service';

class OzonProductService {
  public async productInfo(
    credentials: TUserCredentials,
    data: ProductInfoRequestModel
  ): Promise<any> {
    const request = new OzonRequestService(credentials);
    const url = process.env.OZON_API_URL + OzonEndpointsEnum.PRODUCT_INFO;
    const resp = await request.axios.post(url, data);
    return resp.data.result;
  }

  public async productList(
    credentials: TUserCredentials,
    data: any
  ): Promise<any> {
    const request = new OzonRequestService(credentials);
    const url = process.env.OZON_API_URL + OzonEndpointsEnum.PRODUCT_LIST;
    const resp = await request.axios.post(url, data);
    return resp.data.result;
  }
}

export const ozonProductService = new OzonProductService();
