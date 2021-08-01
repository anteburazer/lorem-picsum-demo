type Modify<T, R> = Omit<T, keyof R> & R;

export interface Image {
  author: string;
  download_url: string;
  height: number;
  id: string;
  url: string;
  width: number;
}

export type EditImageParams = {
  imageId: string;
};

export interface ImageFormData {
  width: number;
  height: number;
  mode: ImageModeOption[] | undefined;
  blurValue?: number;
}

export type ImageSettings = Modify<ImageFormData, {
  mode: Partial<Array<ImageMode>>;
}>

export interface ImageWithSettings extends ImageSettings {
  imageSrc: string;
  imageId: string;
  author: string;
}

export interface ImageUpdateData extends ImageSettings {
  imageId: string;
}

export interface ImageModeOption {
  key: string;
  value: string;
}

export enum ImageMode {
  greyscale = 'greyscale',
  blur = 'blur'
}

export enum ImageLocalStorageKeys {
  imageWithSettings = 'IMAGE_WITH_SETTINGS'
}

export interface ImageListParams {
  page: string;
  limit: string;
}