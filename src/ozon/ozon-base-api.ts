import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TUserCredentials } from 'common/types';

export class OzonBaseApi {
  private readonly _axios: AxiosInstance;

  public get axios(): AxiosInstance {
    return this._axios;
  }

  constructor(credentials: TUserCredentials) {
    this._axios = axios.create({
      baseURL: process.env.OZON_API_URL,
      withCredentials: true
    });

    this._axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers['Api-Key'] = credentials.apiKey;
        config.headers['Client-Id'] = credentials.clientId;
        config.headers['Host'] = 'api-seller.ozon.ru';
        return config;
      }
    );
  }
}
