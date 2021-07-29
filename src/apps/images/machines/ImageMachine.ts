import { createMachine, assign, interpret } from 'xstate';
import toast from 'react-hot-toast';
import {
  ImageMachineContext,
  ImageMachineState,
  ImageMachineEvent,
  ImageMachineSuccessMessage,
  ImageMachineErrorMessage,
  Image,
  ImageWithSettings,
  ImageLocalStorageKeys
} from 'apps/images/models';
import { imagesRestClient } from 'apps/images/restClients';
import { localStorage } from 'core/storage/LocalStorage';
import { defaultImageSettings } from 'apps/images/utils';
import { downloadImage } from 'core/utils';

const errorIdleHandler = {
  actions: 'handleError',
  target: '#Idle',            
};

const imageMachine = createMachine<ImageMachineContext, ImageMachineEvent, ImageMachineState>(
  {
    initial: 'Idle',
    context: {
      images: [],
      imageWithSettings: undefined
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
            target: '#UpdatingItem'
          },
          SET_IMAGE_WITH_SETTINGS: {
            actions: 'assignImageWithSettings'
          },
          DOWNLOAD_ITEM: {              
            target: '#DownloadingItem'
          },
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
            actions: [
              'updateImageWithSettingsAfterFetch',
              'persistImageWithSettings'
            ],
            target: '#Idle'
          },
          onError: errorIdleHandler,
        },
      },
      UpdatingItem: {
        id: 'UpdatingItem',
        invoke: {
          src: 'updateImage',
          onDone: {
            actions: [
              'updateImageWithSettingsAfterUpdate',
              'persistImageWithSettings'
            ],
            target: '#Idle'
          },
          onError: errorIdleHandler,
        },        
      },
      DownloadingItem: {
        id: 'DownloadingItem',
        invoke: {
          src: 'downloadImage',
          onDone: {
            actions: 'createImage',
            target: '#Idle'
          },
          onError: errorIdleHandler,
        }
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
      updateImage: (context, event: any) => imagesRestClient.getImageBySettings(context.imageWithSettings?.imageId || '', event.data),
      downloadImage: (context, event: any) => imagesRestClient.downloadImage(event.data),
    },
    actions: {
      assignImages: assign<ImageMachineContext, ImageMachineEvent>({
        images: (context: ImageMachineContext, event: any) => event.data as Image[]
      }),
      assignImageWithSettings: assign<ImageMachineContext, ImageMachineEvent>({
        imageWithSettings: (context: ImageMachineContext, event: any) => event.data as ImageWithSettings
      }),
      updateImageWithSettingsAfterUpdate: assign<ImageMachineContext, ImageMachineEvent>({
        imageWithSettings: (context: ImageMachineContext, event: any) => {
          const t = context.imageWithSettings
          ? {
              ...context.imageWithSettings,
              imageSrc: `data:image/jpeg;base64,${Buffer.from(event.data, 'binary').toString('base64')}`
            }
          : context.imageWithSettings;

          console.log('updateImageWithSettingsAfterUpdate', t);
          return t;
        }
      }),
      updateImageWithSettingsAfterFetch: assign<ImageMachineContext, ImageMachineEvent>({
        imageWithSettings: (context: ImageMachineContext, event: any) => {
          return {
            ...defaultImageSettings,
            width: event.data.width,
            height: event.data.height,
            imageId: event.data.id,
            author: event.data.author,
            imageSrc: event.data.download_url,
          };
        }
      }),
      persistImageWithSettings: (context) => {
        console.log('persistImageWithSettings', context.imageWithSettings);
        localStorage.setItem(
          ImageLocalStorageKeys.imageWithSettings,
          JSON.stringify(context.imageWithSettings)
        );
      },
      createImage: async (context, event: any) => {
        downloadImage(event.data);
      },
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