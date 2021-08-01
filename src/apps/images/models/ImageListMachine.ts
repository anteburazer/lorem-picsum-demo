import { Image } from 'apps/images/models';
import { Pagination } from 'core/models';

export interface ImageListMachineContext {
  images: Image[] | undefined;
  pagination: Pagination;
}

export type ImageListMachineState =
  | {
    value: 'Initialize';
    context: ImageListMachineContext;
  }
  | {
      value: 'Idle';
      context: ImageListMachineContext;
    }
  | {
      value: 'FetchingList';
      context: ImageListMachineContext;
    }
  | {
    value: 'Failed';
    context: ImageListMachineContext;
  }

type InitEvent = { type: 'INIT', data: { page: number, limit: number, images: Image[] } }
type FetchListEvent = { type: 'FETCH_LIST', data: { page: number, limit: number } }
type SetImagesEvent = { type: 'SET_IMAGES', data: { images: Image[] } }
type SetPaginationEvent = { type: 'SET_PAGINATION'; data: { page: number | null, limit: number | null } };
type GoNextEvent = { type: 'GO_NEXT', data: { page: number, limit: number } };
type GoPrevEvent = { type: 'GO_PREV', data: { page: number, limit: number } };

export type ImageListMachineEvent =
  | InitEvent
  | FetchListEvent
  | SetImagesEvent
  | SetPaginationEvent
  | GoNextEvent
  | GoPrevEvent;

export enum ImageListMachineErrorMessage {
  'error.platform.fetchImages' = 'Something went wront while fetching the images',
};

export enum ImageListMachineSuccessMessage {
  'done.invoke.fetchImages' = 'Success'
};