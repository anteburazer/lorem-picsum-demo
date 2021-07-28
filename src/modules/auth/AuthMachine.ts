import { createMachine, assign } from 'xstate';

export interface AuthContext {
  token?: string;
}

export type AuthState =
  | {
      value: 'Idle';
      context: AuthContext & {
        token: undefined;
      };
    }
  | {
      value: 'Loading';
      context: AuthContext;
    }
  | {
    value: 'Authenticated';
    context: AuthContext & { token: string };
  }
  | {
    value: 'NotAuthenticated';
    context: AuthContext & { token: undefined };
  }

export type AuthEvent =
  | { type: 'LOGIN'; data: Object }
  | { type: 'LOGOUT'; data: Object };

export const authMachine = createMachine<AuthContext, AuthEvent, AuthState>(
  {
    initial: 'Idle',
    context: {
      token: undefined,
    },
    states: {
      Idle: {
        id: 'Idle',
        on: {
          LOGIN: {
            actions: 'assignToken',
            target: 'Loading'
          },
        },
      },
      Loading: {
        id: 'Loading'
      },
      Authenticated: {
        id: 'Authenticated'
      },
      NotAuthenticated: {
        id: 'NotAuthenticated'
      }
    }
  },
  {
    actions: {
      assignToken: assign<AuthContext, AuthEvent>({
        token: (context: AuthContext, event: AuthEvent) => (event.data as any).token
      })
    }
  }
);