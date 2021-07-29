import {
  ImageMode,
  ImageSettings,
  ImageModeOption,
  ImageLocalStorageKeys,
  ImageWithSettings
} from 'apps/images/models';
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

  const imageUrl = new URL(`${Config.apiEndpoints.image}/${imageId}/${settings.width}/${settings.height}`, baseUrl)

  // imageUrl = new URL(Config.apiEndpoints.image, imageUrl);
  // imageUrl = new URL(imageId, imageUrl);

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
      console.log('load Settings From Storage');          
      return imageWithSettings;
    } catch {
      console.log('Parsing image settings failed');
      return undefined;
    }
  }

  return undefined;
};