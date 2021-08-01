import { createMachine, assign } from 'xstate';
import {
  ImagesMachineContext,
  ImagesMachineEvent,
  ImagesMachineState,
  Image
} from 'apps/images/models';

export const imagesMachine = createMachine<ImagesMachineContext, ImagesMachineEvent, ImagesMachineState>(
  {
    initial: 'Idle',
    context: {
      images: []
    },
    states: {
      Idle: {
        id: 'Idle',
        on: {
          SET_IMAGES: {              
            actions: 'assignImages'
          }
        }
      }
    }
  },
  {
    actions: {
      assignImages: assign<ImagesMachineContext, ImagesMachineEvent>({
        images: (context: ImagesMachineContext, event: any) => event.data.images as Image[]
      }),
    }
  }
);