import { Image, ImageSettings, ImageWithSettings } from 'apps/images/models';

export interface ImageMachineContext {
  images: Image[] | undefined;
  imageWithSettings: ImageWithSettings | undefined;
}

export type ImageMachineState =
  | {
      value: 'Idle';
      context: ImageMachineContext;
    }
  | {
      value: 'FetchingList';
      context: ImageMachineContext;
    }
  | {
    value: 'FetchingItem';
    context: ImageMachineContext;
  }
  | {
    value: 'Updatingtem';
    context: ImageMachineContext & { selectedImage: Image };
  }
  | {
    value: 'DownloadingItem';
    context: ImageMachineContext;
  }
  | {
    value: 'Failed';
    context: ImageMachineContext;
  }

export type FetchListEvent = { type: 'FETCH_LIST' }
export type UpdateItemEvent = { type: 'UPDATE_ITEM'; data: ImageSettings }
export type FetchItemEvent = { type: 'FETCH_ITEM'; data: string }
export type DownloadtemEvent = { type: 'DOWNLOAD_ITEM'; data: string }
export type SelectImageEvent = { type: 'SELECT_IMAGE'; data: Image };
export type SetImageSettingsEvent = { type: 'SET_IMAGE_SETTINGS'; data: ImageSettings };
export type SetImageWithSettingsEvent = { type: 'SET_IMAGE_WITH_SETTINGS'; data: ImageWithSettings | undefined };

export type ImageMachineEvent =
  | FetchListEvent
  | UpdateItemEvent
  | FetchItemEvent
  | SelectImageEvent
  | SetImageSettingsEvent
  | SetImageWithSettingsEvent
  | DownloadtemEvent;

export enum ImageMachineErrorMessage {
  'error.platform.fetchImages' = 'Something went wront while fetching the images',
};

export enum ImageMachineSuccessMessage {
  'done.invoke.fetchImages' = 'Success'
};