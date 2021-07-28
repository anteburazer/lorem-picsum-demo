import { ImageMode, ImageSettings, ImageModeOption } from 'apps/images/models';
import Config from 'apps/images/Config';
import AppConfig from 'core/Config';

export const defaultImageSettings = {
  width: 0,
  height: 0,
  mode: [],
  blurValue: 0
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