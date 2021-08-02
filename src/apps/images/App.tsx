import React from 'react';
import { useMachine } from '@xstate/react';
import Router from 'apps/images/components/Router';
import { imagesMachine } from 'apps/images/machines/ImagesMachine';
import {
  ImagesMachineContext,
  ImagesMachineEvent,
  ImagesMachineState,
} from 'apps/images/models';

export const ImagesServiceContext = React.createContext<any>({});

const App: React.FC = () => {
  // Create the context and pass the global state machine
  /* eslint-disable */
  const [_state, _send, service] = useMachine<ImagesMachineContext, ImagesMachineEvent, ImagesMachineState>(imagesMachine);
  /* eslint-enable */

  return (
    <ImagesServiceContext.Provider value={service as any}>
      <Router />
    </ImagesServiceContext.Provider>
  );
};

export default App;
