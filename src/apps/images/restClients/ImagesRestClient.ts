import { RestClient, ApiRequestConfig, ApiResponse } from 'core/transport/RestClient';
import Config from 'apps/images/Config';
import { ApiResponsePayload } from 'core/models';
import { ImageSettings } from 'apps/images/models';
import { getImageUrl, getImageInfoEndpoint } from 'apps/images/utils';

class ImagesRestClient extends RestClient {
  constructor(config: ApiRequestConfig) {
    super(config);
  
    this.api.interceptors.response.use(
      (response: ApiResponse<ApiResponsePayload<any>>) => {
        if (response.config.url) {
          const url = new URL(response.config.url);

          if (url.pathname === Config.apiEndpoints.images) {            
            return {
              ...response,
              data: {
                images: response.data,
                link: response.headers.link
              }
            };
          }
        }

        return response;
      }
    );
  }

  getImages = (page: number, pageSize: number) => (
    this.get<any>(
      `${this._apiUrl}${Config.apiEndpoints.images}?page=${page}&limit=${pageSize}`,
    )
  );

  getImageBySettings = (id: string, imageSettings: ImageSettings) => (
    this.get<any>(getImageUrl(id, imageSettings), { responseType: 'arraybuffer' })
  );

  getImage = (id: string) => (
    this.get<any>(`${this._apiUrl}${getImageInfoEndpoint(id)}`)
  );

  downloadImage = (url: string) => (
    this.get<any>(url, { responseType: 'arraybuffer' })
  );
}

export const imagesRestClient = new ImagesRestClient({});