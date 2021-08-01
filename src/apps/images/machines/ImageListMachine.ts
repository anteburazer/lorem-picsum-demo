import { createMachine, assign, actions, send } from 'xstate';
import toast from 'react-hot-toast';
import {
  ImageListMachineContext,
  ImageListMachineState,
  ImageListMachineEvent,
  ImageListMachineSuccessMessage,
  ImageListMachineErrorMessage,
  Image,
} from 'apps/images/models';
import { imagesRestClient } from 'apps/images/restClients';
import { getPagination, getInitialPagination } from 'apps/images/utils';

export const imageListMachine = createMachine<ImageListMachineContext, ImageListMachineEvent, ImageListMachineState>(
  {
    initial: 'Initialize',
    context: {
      images: [],
      pagination: {
        limit: 20,
        current: 1,
        prev: 1,
        next: 2
      }
    },
    states: {
      Initialize: {
        id: 'Initialize',
        on: {
          INIT: {
            actions: [
              'setPagination',
              actions.pure((context, event) => {
                if (event.data.images) {
                  // There's no images stored in the global machine so fetch them from the API
                  return send({
                    type: 'FETCH_LIST',
                    data: { page: event.data.page || 1, limit: event.data.limit } 
                  });
                } else {
                  // Images are available from the blobal machine so use them to hidrate the child machine
                  return send({
                    type: 'SET_IMAGES',
                    data: { images: event.data.images }
                  });
                }
              })
            ],
            target: '#Idle'
          }
        }
      },
      Idle: {
        id: 'Idle',
        on: {
          FETCH_LIST: {              
            target: '#FetchingList'
          },
          SET_IMAGES: {              
            actions: 'assignImages'
          },
          SET_PAGINATION: {
            actions: 'setPagination'
          },
          GO_NEXT: {
            target: '#FetchingList'
          },
          GO_PREV: {
            target: '#FetchingList'
          }
        },
      },
      FetchingList: {
        id: 'FetchingList',
        invoke: {
          src: 'fetchImages',
          onDone: {
            actions: [
              'assignImages',
              'assignPagination'
            ],
            target: '#Idle'
          },
          onError: {
            actions: 'handleError',
            target: '#Failed',            
          },
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
      fetchImages: (context, event: any) => imagesRestClient.getImages(event.data.page, event.data.limit)
    },
    actions: {
      assignImages: assign<ImageListMachineContext, ImageListMachineEvent>({
        images: (context: ImageListMachineContext, event: any) => event.data.images as Image[]
      }),
      assignPagination: assign<ImageListMachineContext, ImageListMachineEvent>({
        pagination: (context: ImageListMachineContext, event: any) => {
          return {
            ...getPagination(event.data.link)
          };
        }
      }),
      setPagination: assign<ImageListMachineContext, ImageListMachineEvent>({
        pagination: (context: ImageListMachineContext, event: any) => {
          if (event.type === 'GO_NEXT') {
            return {
              ...context.pagination,
              current: context.pagination.next > context.pagination.current
                ? context.pagination.current + 1
                : context.pagination.current
            }
          }

          if (event.type === 'GO_PREV') {
            return {
              ...context.pagination,
              current: context.pagination.current > 1
                ? context.pagination.current - 1
                : context.pagination.current
            }
          }

          return getInitialPagination(event.data.page, event.data.limit);
        }
      }),
      handleSuccess: (context: ImageListMachineContext, event: ImageListMachineEvent) => {
        return toast.success(ImageListMachineSuccessMessage[event.type as keyof typeof ImageListMachineSuccessMessage])
      },
      handleError: (context: ImageListMachineContext, event: ImageListMachineEvent) => {
        return toast.error(ImageListMachineErrorMessage[event.type as keyof typeof ImageListMachineErrorMessage])
      }
    }
  },
);