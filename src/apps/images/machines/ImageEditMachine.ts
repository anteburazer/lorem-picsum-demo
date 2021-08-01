import { createMachine, assign, actions, send } from 'xstate';
import toast from 'react-hot-toast';
import {
  ImageEditMachineContext,
  ImageEditMachineState,
  ImageEditMachineEvent,
  ImageEditMachineSuccessMessage,
  ImageEditMachineErrorMessage,
  ImageWithSettings,
  ImageLocalStorageKeys,
  InitEvent
} from 'apps/images/models';
import { imagesRestClient } from 'apps/images/restClients';
import { localStorage } from 'core/storage/LocalStorage';
import { defaultImageSettings, loadImageWithSettingsFromStorage } from 'apps/images/utils';
import { downloadImage } from 'core/utils';

const errorIdleHandler = {
  actions: 'handleError',
  target: '#Idle',
};

export const imageEditMachine = createMachine<ImageEditMachineContext, ImageEditMachineEvent, ImageEditMachineState>(
  {
    initial: 'Initialize',
    context: {
      imageWithSettings: undefined
    },
    states: {
      Initialize: {
        id: 'Initialize',
        on: {
          INIT: {              
            actions: actions.pure((context: ImageEditMachineContext, event: InitEvent) => {
              if (!context.imageWithSettings) {
                const imageWithSettings = loadImageWithSettingsFromStorage();
            
                // We have data from storage and we can hidrate the state machine
                if (imageWithSettings && imageWithSettings.imageId === event.data.imageId) {
                  console.log('Image found in the storage');
            
                  return send({
                    type: 'SET_IMAGE_WITH_SETTINGS',
                    data: imageWithSettings
                  });
                }
            
                // There is no data from storage and we need to fetch it
                // 1. Look at the images array and if it exists get the image from there
                if (event.data.images?.length) {
                  const img = event.data.images.find(image => image.id === event.data.imageId);
            
                  // 1.1. We found the image in images array so we can hidrate the state machine
                  if (img) {
                    console.log('Image found in the list');
            
                    return send({
                      type: 'SET_IMAGE_WITH_SETTINGS',
                      data: {
                        ...defaultImageSettings,
                        width: img.width,
                        height: img.height,
                        author: img.author,
                        imageSrc: img.download_url,
                        imageId: img.id
                      }
                    });
            
                  } else {
                    console.log('List is present but Image not found in the list');  
                    // 1.2. Image not found in the images array so fetch it from the API
                    return send({ type: 'FETCH_ITEM', data: event.data.imageId });
                  }
                } else {
                  console.log('List not present. Fetching the image');  
                  // 2. images array is empty so fetch it from the API
                  return send({ type: 'FETCH_ITEM', data: event.data.imageId });
                }
              }
            }),
            target: '#Idle'
          },
        },
      },
      Idle: {
        id: 'Idle',
        on: {
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
          }
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
      fetchImage: (context, event: any) => imagesRestClient.getImage((event.data as string)),
      updateImage: (context, event: any) => imagesRestClient.getImageBySettings(context.imageWithSettings?.imageId || '', event.data),
      downloadImage: (context, event: any) => imagesRestClient.downloadImage(event.data),
    },
    actions: {
      assignImageWithSettings: assign<ImageEditMachineContext, ImageEditMachineEvent>({
        imageWithSettings: (context: ImageEditMachineContext, event: any) => event.data as ImageWithSettings
      }),
      updateImageWithSettingsAfterUpdate: assign<ImageEditMachineContext, ImageEditMachineEvent>({
        imageWithSettings: (context: ImageEditMachineContext, event: any) => {
          const settings = context.imageWithSettings
          ? {
              ...context.imageWithSettings,
              imageSrc: `data:image/jpeg;base64,${Buffer.from(event.data, 'binary').toString('base64')}`
            }
          : context.imageWithSettings;

          console.log('updateImageWithSettingsAfterUpdate', settings);
          return settings;
        }
      }),
      updateImageWithSettingsAfterFetch: assign<ImageEditMachineContext, ImageEditMachineEvent>({
        imageWithSettings: (context: ImageEditMachineContext, event: any) => {
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
      handleSuccess: (context: ImageEditMachineContext, event: ImageEditMachineEvent) => {
        return toast.success(ImageEditMachineSuccessMessage[event.type as keyof typeof ImageEditMachineSuccessMessage])
      },
      handleError: (context: ImageEditMachineContext, event: ImageEditMachineEvent) => {
        return toast.error(ImageEditMachineErrorMessage[event.type as keyof typeof ImageEditMachineErrorMessage])
      }
    }
  },
);
