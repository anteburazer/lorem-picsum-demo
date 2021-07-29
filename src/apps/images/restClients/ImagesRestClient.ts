import { RestClient } from 'core/transport/RestClient';
import Config from 'apps/images/Config';
import AppConfig from 'core/Config';
import { ImageSettings } from 'apps/images/models';
import { getImageUrl, getImageInfoEndpoint } from 'apps/images/utils';

class ImagesRestClient extends RestClient {
  getImages = (page: number, pageSize = AppConfig.defaultPageSize) => (
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