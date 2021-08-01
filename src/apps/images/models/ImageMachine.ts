import {
  Image,
  ImageSettings,
  ImageWithSettings,
} from 'apps/images/models';

export interface ImageEditMachineContext {
  imageWithSettings: ImageWithSettings | undefined;
}

export type ImageEditMachineState =
  | { 
    value: 'Initialize';
    context: ImageEditMachineContext;
  }
  | {
      value: 'Idle';
      context: ImageEditMachineContext;
    }
  | {
      value: 'FetchingList';
      context: ImageEditMachineContext;
    }
  | {
    value: 'FetchingItem';
    context: ImageEditMachineContext;
  }
  | {
    value: 'UpdatingItem';
    context: ImageEditMachineContext & { selectedImage: Image };
  }
  | {
    value: 'DownloadingItem';
    context: ImageEditMachineContext;
  }
  | {
    value: 'Failed';
    context: ImageEditMachineContext;
  }

export type InitEvent = { type: 'INIT'; data: { images: Image[], imageId: string } }
export type UpdateItemEvent = { type: 'UPDATE_ITEM'; data: ImageSettings }
export type FetchItemEvent = { type: 'FETCH_ITEM'; data: string }
export type DownloadtemEvent = { type: 'DOWNLOAD_ITEM'; data: string }
export type SelectImageEvent = { type: 'SELECT_IMAGE'; data: Image };
export type SetImageSettingsEvent = { type: 'SET_IMAGE_SETTINGS'; data: ImageSettings };
export type SetImageWithSettingsEvent = { type: 'SET_IMAGE_WITH_SETTINGS'; data: ImageWithSettings | undefined };

export type ImageEditMachineEvent =
  | InitEvent
  | UpdateItemEvent
  | FetchItemEvent
  | SelectImageEvent
  | SetImageSettingsEvent
  | SetImageWithSettingsEvent
  | DownloadtemEvent;

export enum ImageEditMachineErrorMessage {
  'error.platform.fetchImages' = 'Something went wront while fetching the images',
};

export enum ImageEditMachineSuccessMessage {
  'done.invoke.fetchImages' = 'Success'
};