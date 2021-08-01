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
      images: [],
      currentPage: 1
    },
    states: {
      Idle: {
        id: 'Idle',
        on: {
          SET_IMAGES: {              
            actions: 'assignImages'
          },
          SET_CURRENT_PAGE: {
            actions: 'assignCurrentPage'
          }
        }
      }
    }
  },
  {
    actions: {
      assignImages: assign<ImagesMachineContext, ImagesMachineEvent>({
        images: (context: ImagesMachineContext, event: any) => event.data as Image[]
      }),
      assignCurrentPage: assign<ImagesMachineContext, ImagesMachineEvent>({
        currentPage: (context: ImagesMachineContext, event: any) => event.data as number
      }),
    }
  }
);