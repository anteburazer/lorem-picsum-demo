import {
  Image,
  ImageSettings,
  ImageWithSettings,
} from 'apps/images/models';
import { Pagination } from 'core/models';

export interface ImageMachineContext {
  images: Image[] | undefined;
  imageWithSettings: ImageWithSettings | undefined;
  pagination: Pagination;
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
export type SetPaginationEvent = { type: 'SET_PAGINATION'; data: { page: string | null, limit: string | null } };
export type GoNextEvent = { type: 'GO_NEXT' };
export type GoPrevEvent = { type: 'GO_PREV' };

export type ImageMachineEvent =
  | FetchListEvent
  | UpdateItemEvent
  | FetchItemEvent
  | SelectImageEvent
  | SetImageSettingsEvent
  | SetImageWithSettingsEvent
  | DownloadtemEvent
  | SetPaginationEvent
  | GoNextEvent
  | GoPrevEvent;

export enum ImageMachineErrorMessage {
  'error.platform.fetchImages' = 'Something went wront while fetching the images',
};

export enum ImageMachineSuccessMessage {
  'done.invoke.fetchImages' = 'Success'
};