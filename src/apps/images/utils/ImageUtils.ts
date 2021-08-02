import { isUndefined } from 'lodash';
import {
  ImageMode,
  ImageSettings,
  ImageModeOption,
  ImageLocalStorageKeys,
  ImageWithSettings  
} from 'apps/images/models';
import {
  PaginationDirection,
  Pagination
} from 'core/models';
import Config from 'apps/images/Config';
import AppConfig from 'core/Config';
import { localStorage } from 'core/storage/LocalStorage';

export const defaultImageSettings = {
  width: 1,
  height: 1,
  mode: [],
  blurValue: 1,
};

export const getImageUrl = (imageId: string, settings: ImageSettings): string => {
  let baseUrl = new URL(
    '/',
    `${AppConfig.apiUrl}`
  );

  const imageUrl = new URL(`${Config.apiEndpoints.image}/${imageId}/${settings.width}/${settings.height}`, baseUrl);

  settings.mode?.forEach(mode => {
    if (mode === ImageMode.blur) {
      imageUrl.searchParams.append('blur', settings.blurValue?.toString() || '');
    }

    if (mode === ImageMode.greyscale) {
      imageUrl.searchParams.append('grayscale', '');
    }
  });

  return imageUrl.href;
};

export const getImageSrcByDimension = (url: string, width: number, height: number) => {
  const urlChunks = url.split('/');
  urlChunks.splice(urlChunks.length - 2, 1);
  urlChunks.splice(-1, 1)

  const urlWithoutDimensions = urlChunks.join('/');
  return `${urlWithoutDimensions}/${width}/${height}`
};

export const getImageModeOptions = (): ImageModeOption[] => (
  Object.keys(ImageMode).map(mode => ({
    key: mode,
    value: mode
  }))
);

export const loadImageWithSettingsFromStorage = (): ImageWithSettings | undefined => {
  const imageWithSettingsStringified = localStorage.getItemSync(ImageLocalStorageKeys.imageWithSettings);

  if (imageWithSettingsStringified) {
    try {
      const imageWithSettings = JSON.parse(imageWithSettingsStringified);
      console.log('Settings loaded From Storage');          
      return imageWithSettings;
    } catch {
      console.log('Parsing image settings failed');
      return undefined;
    }
  }

  return undefined;
};

export const getInitialPagination = (page: string, limit: string): Pagination => {
  const defaultLimit = AppConfig.defaultPageSize ? parseInt(AppConfig.defaultPageSize, 10) : 20;
  const currentPage = page ? parseInt(page, 10) : 1;

  const pagination = {
    limit: limit ? parseInt(limit, 10) : defaultLimit,
    current: currentPage,
    prev: currentPage < 2 ? 1 : currentPage - 1,
    next: currentPage + 1
  };

  console.log('getInitialPagination', pagination);

  return pagination;
};

export const getPagination = (apiHeaderLink: string): Pagination => {
  const links = apiHeaderLink.split(',');
  const pagination = {
    limit: AppConfig.defaultPageSize ? parseInt(AppConfig.defaultPageSize, 10) : 20,
    prev: 0,
    next: 0
  };

  links.forEach((link: string) => {
    const urls = link.split(/[<>]/).filter(url => url.trim() !== '');
    const url = new URL(urls[0]);
    const page = url.searchParams.get('page');
    const pageLimit = url.searchParams.get('limit');
    const direction = urls[1].substring(
      /* eslint-disable */
      urls[1].indexOf('\"') + 1, 
      urls[1].lastIndexOf('\"')
      /* eslint-enable */
    );

    if (pageLimit) {
      pagination.limit = parseInt(pageLimit, 10);
    }

    if (!isUndefined(page) && (direction === PaginationDirection.prev || direction === PaginationDirection.next)) {
      pagination[direction] = parseInt((page as string), 10);
    }
  });

  const prev = pagination.prev || pagination.next - 1;
  const next = pagination.next || pagination.prev + 1;

  console.log('getPagination', {
    ...pagination,
    current: pagination.next ? next - 1 : prev + 1,
    prev,
    next
  })

  return {
    ...pagination,
    current: pagination.next ? next - 1 : prev + 1,
    prev,
    next
  };
};