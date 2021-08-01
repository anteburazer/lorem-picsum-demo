import { Image } from 'apps/images/models';

export interface ImagesMachineContext {
  images: Image[] | undefined;
  currentPage: number;
}

export type ImagesMachineState =
  | {
    value: 'Idle';
    context: ImagesMachineContext;
  };

export type SetImagesEvent = { type: 'SET_IMAGES'; data: Image[] };
export type SetCurrentPageEvent = { type: 'SET_CURRENT_PAGE'; data: number };

export type ImagesMachineEvent =
  | SetImagesEvent
  | SetCurrentPageEvent;