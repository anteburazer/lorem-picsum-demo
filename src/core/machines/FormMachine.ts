import { createMachine, assign } from 'xstate';
import toast from 'react-hot-toast';

export interface FormContext {
  formData?: Object;
}

export type FormState =
  | {
      value: 'Idle';
      context: FormContext & {
        formData: undefined;
      };
    }
  | {
      value: 'Submitting';
      context: FormContext;
    }
  | {
    value: 'Resolved';
    context: FormContext & { formData: Object; };
  }
  | {
    value: 'Failed';
    context: FormContext & { formData: undefined; };
  }

export type FormEvent = { type: 'SUBMIT'; data: Object };

export const createFormMachine = (successNotification: string, errorNotification: string) => (
  createMachine<FormContext, FormEvent, FormState>(
    {
      initial: 'Idle',
      context: {
        formData: undefined
      },
      states: {
        Idle: {
          on: {
            SUBMIT: {
              actions: 'assignData',
              target: 'Submitting'
            },
          },
        },
        Submitting: {
          invoke: {
            src: 'submit',
            onDone: {
              actions: 'handleSuccess',
              target: 'Resolved'
            },
            onError: {
              actions: 'handleError',
              target: 'Failed',            
            },
          },
        },
        Resolved: {
          type: 'final'
        },
        Failed: {
          on: {
            SUBMIT: {
              actions: 'assignData',
              target: 'Submitting'
            },
          }
        },
      },
    },
    {
      services: {
        submit: () => () => {}
      },
      actions: {
        assignData: () => assign<FormContext, FormEvent>({
          formData: (context: FormContext, event: FormEvent) => event.data
        }),
        handleSuccess: () => toast.success(successNotification),
        handleError: () => toast.error(errorNotification)
      }
    },
  )
);