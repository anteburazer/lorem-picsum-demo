import React, { useEffect } from 'react';
import { useService } from '@xstate/react';
import { imageMachineService } from 'apps/images/machines';
import Gallery from 'apps/images/components/gallery/Gallery';

const Images: React.FC = () => {
  const [state, send] = useService(imageMachineService);

  /**
   * Fetch images on component mount
   */
  useEffect(() => {
    send({ type: 'FETCH_LIST' });
  }, [send]);

  return (
    <div className="container mt-5">
      <div className="mb-5">
        <h1 className="text-center">Synthesia image demo</h1>
        <p className="text-center">Click on the image to edit</p>
      </div>

      <Gallery images={state.context.images || []} />
    </div>
  );
};

export default Images;