import { Image, ImageSettings } from 'apps/images/models';

export interface ImageMachineContext {
  images: Image[] | undefined;
  selectedImage: Image | undefined;
  imageSettings: ImageSettings;
  imageUpdated: string | undefined;
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
    value: 'Failed';
    context: ImageMachineContext;
  }

export type FetchListEvent = { type: 'FETCH_LIST' }
export type UpdateItemEvent = { type: 'UPDATE_ITEM'; data: ImageSettings }
export type FetchItemEvent = { type: 'FETCH_ITEM'; data: string }
export type SelectImageEvent = { type: 'SELECT_IMAGE'; data: Image };
export type SetImageSettingsEvent = { type: 'SET_IMAGE_SETTINGS'; data: ImageSettings };

export type ImageMachineEvent =
  | FetchListEvent
  | UpdateItemEvent
  | FetchItemEvent
  | SelectImageEvent
  | SetImageSettingsEvent;

export enum ImageMachineErrorMessage {
  'error.platform.fetchImages' = 'Something went wront while fetching the images'
};

export enum ImageMachineSuccessMessage {
  'done.invoke.fetchImages' = 'Success'
};