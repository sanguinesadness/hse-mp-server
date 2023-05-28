import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TUserCredentials } from 'types';

export class OzonRequestService {
  private readonly _axios: AxiosInstance;

  public get axios(): AxiosInstance {
    return this._axios;
  }

  constructor(headers: TUserCredentials) {
    this._axios = axios.create({
      baseURL: process.env.OZON_API_URL,
      withCredentials: true
    });

    this._axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers['Api-Key'] = headers.apiKey;
        config.headers['Client-Id'] = headers.clientId;
        config.headers['Host'] = 'api-seller.ozon.ru';
        return config;
      }
    );
  }
}
