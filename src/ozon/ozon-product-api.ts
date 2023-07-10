import { TUserCredentials } from 'common/types';
import { OzonBaseApi } from 'ozon/ozon-base-api';
import {
  ProductInfoRequestModel,
  ProductModel,
  TProductDescriptionRequest,
  TProductDescriptionResponse
} from './models';
import { OzonEndpointsEnum } from './ozon-endpoints.enum';

class OzonProductApi {
  public async productDescription(
    credentials: TUserCredentials,
    data: TProductDescriptionRequest
  ): Promise<TProductDescriptionResponse> {
    const request = new OzonBaseApi(credentials);
    const url =
      process.env.OZON_API_URL + OzonEndpointsEnum.PRODUCT_DESCRIPTION;
    const resp = await request.axios.post(url, data);
    return resp.data.result;
  }

  public async productInfo(
    credentials: TUserCredentials,
    data: ProductInfoRequestModel
  ): Promise<ProductModel> {
    const request = new OzonBaseApi(credentials);
    const url = process.env.OZON_API_URL + OzonEndpointsEnum.PRODUCT_INFO;
    const resp = await request.axios.post(url, data);
    return resp.data.result;
  }

  public async productList(
    credentials: TUserCredentials,
    data?: any
  ): Promise<any> {
    const request = new OzonBaseApi(credentials);
    const url = process.env.OZON_API_URL + OzonEndpointsEnum.PRODUCT_LIST;
    const resp = await request.axios.post(url, data);
    return resp.data.result;
  }
}

export const ozonProductApi = new OzonProductApi();
