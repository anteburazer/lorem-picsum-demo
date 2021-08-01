import { Image } from 'apps/images/models';

export interface ImagesMachineContext {
  images: Image[] | undefined;
}

export type ImagesMachineState =
  | {
    value: 'Idle';
    context: ImagesMachineContext;
  };

export type SetImagesEvent = { type: 'SET_IMAGES'; data: Image[] }

export type ImagesMachineEvent =
  | SetImagesEvent;