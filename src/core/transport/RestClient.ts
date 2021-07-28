import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Config from 'core/Config';
import { ApiResponsePayload, ApiResponseStatus } from 'core/models';
// import { notificationManager } from 'core/modules/notifications';
import { isUrlMatch } from 'core/utils';

export interface ApiRequestConfig extends AxiosRequestConfig {}
export interface ApiInstance extends AxiosInstance {}
export interface ApiResponse<T> extends AxiosResponse<T> {}

const whitelistUrls: string[] = [];

// const genericErrorMessage = 'Something went wrong. Please contact your administrator';

export class RestClient {
  api: ApiInstance;

  protected _apiUrl = Config.apiUrl;

  constructor(config: ApiRequestConfig) {
    this.api = axios.create(config);

    this.api.interceptors.request.use((param) => ({
      ...param,
      headers: {
        ...param.headers,
        // Authorization: `Bearer ${authStore.jwtToken}`,
      },
    }));

    this.api.interceptors.response.use(
      (response: ApiResponse<ApiResponsePayload<any>>) => {
        if (response.data.status === ApiResponseStatus.Error && response.config.url) {
          // Any status code that lie within the range of 2xx cause this function to trigger
          const url = new URL(response.config.url );

          if (!isUrlMatch(url.pathname, whitelistUrls)) {
            // notificationManager.error(
            //   response.data.message || genericErrorMessage,
            // );
          }
        }

        return response;
      },
      (error) => {
        const url = new URL(error.config.url);
        // const serverMessage = error.response.data.message;
        // const messageToDisplay = error.response.status === 500 || !serverMessage
        //   ? genericErrorMessage
        //   : serverMessage;

        // Show error notification if url is not whitelisted
        // (we don't want to show errors for all requests)
        // and status is not 401 (unauthorized) - because access token has expired
        if (!isUrlMatch(url.pathname, whitelistUrls) && error.response.status !== 401) {
          // notificationManager.error(messageToDisplay);
        }
      },
    );
  }

  /**
   * T - `TYPE`: expected object
   * R - `RESPONSE`: expected object inside a axios response format
   */
  request = <T, R = ApiResponse<T>>(config: ApiRequestConfig): Promise<R> => this.api
    .request(config)
    .then((response) => response.data)
    .catch(() => ({ status: ApiResponseStatus.Error, result: {} }));

  get = <T>(url: string, config?: ApiRequestConfig): Promise<T> => this.api
    .get(url, config)
    .then((response) => response.data)
    .catch(() => ({ status: ApiResponseStatus.Error, result: {} }));

  options = <T, R = ApiResponse<T>>(
    url: string,
    config?: ApiRequestConfig,
  ): Promise<R> => this.api
    .options(url, config)
    .then((response) => response.data)
    .catch(() => ({ status: ApiResponseStatus.Error, result: {} }));

  delete = <T, R = ApiResponse<T>>(
    url: string,
    config?: ApiRequestConfig,
  ): Promise<R> => this.api
    .delete(url, config)
    .then((response) => response.data)
    .catch(() => ({ status: ApiResponseStatus.Error, result: {} }));

  head = <T, R = ApiResponse<T>>(
    url: string,
    config?: ApiRequestConfig,
  ): Promise<R> => this.api
    .head(url, config)
    .then((response) => response.data)
    .catch(() => ({ status: ApiResponseStatus.Error, result: {} }));

  /**
   * T - `TYPE`: expected object
   * B - `BODY`: body request object
   * R - `RESPONSE`: expected object inside a axios response format
   */
  post = <B, R>(url: string, data?: B, config?: ApiRequestConfig): Promise<R> => this.api
    .post(url, data, config)
    .then((response) => response.data)
    .catch(() => ({ status: ApiResponseStatus.Error, result: {} }));

  put = <B, R>(url: string, data?: B, config?: ApiRequestConfig): Promise<R> => this.api
    .put(url, data, config)
    .then((response) => response.data)
    .catch(() => ({ status: ApiResponseStatus.Error, result: {} }));

  patch = <B, R>(
    url: string,
    data?: B,
    config?: ApiRequestConfig,
  ): Promise<R> => this.api
    .patch(url, data, config)
    .then((response) => response.data)
    .catch(() => ({ status: ApiResponseStatus.Error, result: {} }));

  all = (values: unknown[]): Promise<any> => axios.all(values);
}
