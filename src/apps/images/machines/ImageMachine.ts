import { createMachine, assign, interpret } from 'xstate';
import toast from 'react-hot-toast';
import {
  ImageMachineContext,
  ImageMachineState,
  ImageMachineEvent,
  ImageMachineSuccessMessage,
  ImageMachineErrorMessage,
  Image
} from 'apps/images/models';
import { defaultImageSettings } from 'apps/images/utils';
import { imagesRestClient } from 'apps/images/restClients';

const errorIdleHandler = {
  actions: 'handleError',
  target: '#Idle',            
};

const imageMachine = createMachine<ImageMachineContext, ImageMachineEvent, ImageMachineState>(
  {
    initial: 'Idle',
    context: {
      images: [],
      selectedImage: undefined,
      imageSettings: defaultImageSettings,
      imageUpdated: undefined
    },
    states: {
      Idle: {
        id: 'Idle',
        on: {
          FETCH_LIST: {              
            target: '#FetchingList'
          },
          FETCH_ITEM: {              
            target: '#FetchingItem'
          },
          UPDATE_ITEM: {              
            target: '#Updatingtem'
          },
          SELECT_IMAGE: {
            actions: 'assignSelectedImage'
          }
        },
      },
      FetchingList: {
        id: 'FetchingList',
        invoke: {
          src: 'fetchImages',
          onDone: {
            actions: 'assignImages',
            target: '#Idle'
          },
          onError: {
            actions: 'handleError',
            target: '#Failed',            
          },
        },
      },
      FetchingItem: {
        id: 'FetchingItem',
        invoke: {
          src: 'fetchImage',
          onDone: {
            actions: 'assignSelectedImage',
            target: '#Idle'
          },
          onError: errorIdleHandler,
        },
      },
      Updatingtem: {
        id: 'Updatingtem',
        invoke: {
          src: 'updateImage',
          onDone: {
            actions: 'assignImageUpdated',
            target: '#Idle'
          },
          onError: errorIdleHandler,
        },
      },
      Failed: {
        id: 'Failed',
        type: 'final'
      }
    }
  },
  {
    services: {
      fetchImages: () => imagesRestClient.getImages(1),
      fetchImage: (context, event: any) => imagesRestClient.getImage((event.data as string)),
      updateImage: (context, event: any) => imagesRestClient.getImageBySettings(context.selectedImage?.id || '', event.data)
    },
    actions: {
      assignImages: assign<ImageMachineContext, ImageMachineEvent>({
        images: (context: ImageMachineContext, event: any) => event.data as Image[]
      }),
      assignSelectedImage: assign<ImageMachineContext, ImageMachineEvent>({
        selectedImage: (context: ImageMachineContext, event: any) => {
          return event.data as Image
        }
      }),
      assignImageUpdated: assign<ImageMachineContext, ImageMachineEvent>({
        imageUpdated: (context: ImageMachineContext, event: any) => {
          console.log(event.data)
          const imgSrc = Buffer.from(event.data, 'binary').toString('base64');
          return imgSrc
        }
      }),      
      handleSuccess: (context: ImageMachineContext, event: ImageMachineEvent) => {
        return toast.success(ImageMachineSuccessMessage[event.type as keyof typeof ImageMachineSuccessMessage])
      },
      handleError: (context: ImageMachineContext, event: ImageMachineEvent) => {
        return toast.error(ImageMachineErrorMessage[event.type as keyof typeof ImageMachineErrorMessage])
      }
    }
  },
);

export const imageMachineService = interpret(imageMachine);
imageMachineService.start();