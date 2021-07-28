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

export type ImageSettings = Modify<ImageFormData , {
  mode: Partial<Array<ImageMode>>;
}>

// export interface ImageSettings extends ImageFormData {
//   mode: string[];
// }

export interface ImageModeOption {
  key: string;
  value: string;
}

export enum ImageMode {
  greyscale = 'greyscale',
  blur = 'blur'
}