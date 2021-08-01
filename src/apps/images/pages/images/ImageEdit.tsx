import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useService, useMachine } from '@xstate/react';
import { imageEditMachine } from 'apps/images/machines';
import {
  EditImageParams,
  ImageFormData,
  ImageSettings,
  ImageMode,
  ImageWithSettings,
  ImagesMachineContext,
  ImagesMachineEvent,
  ImagesMachineState,
} from 'apps/images/models';
import ImageEditSkeleton from 'apps/images/components/ImageEditSkeleton';
import ImageForm from 'apps/images/components/imageForm/ImageForm';
import ImageWithCaption from 'apps/images/components/imageWithCaption/ImageWithCaption';
import { getImageListRoute } from 'apps/images/utils';
import styles from 'apps/images/pages/images/ImageEdit.module.scss';
import Spinner from 'components/Spinner';
import { ImagesServiceContext } from 'apps/images/App';

const ImageEdit: React.FC = () => {
  const [state, send] = useMachine(imageEditMachine);
  const { imageId } = useParams<EditImageParams>();

  const service = React.useContext(ImagesServiceContext);
  const [globalState] = useService<ImagesMachineContext, ImagesMachineEvent, ImagesMachineState>(service);

  useEffect(() => {
    // Initialize the machine. Load the image and it's settings
    send({
      type: 'INIT',
      data: {
        images: globalState.context.images || [],
        imageId
      }
    });
    
  }, [send, globalState.context.images, imageId]);

  /**
   * Handles the form submission
   * Saves the data to state machine and requests the image updates from the API
   */
  const submitChanges = (imageData: ImageFormData) => {
    console.log('submitChanges', imageData);

    const imageSettingsData: ImageSettings = {
      ...imageData,
      mode: imageData.mode ? imageData.mode.map(mode => mode.key as ImageMode) : [],
      blurValue: imageData.blurValue || 1
    };    

    send({
      type: 'SET_IMAGE_WITH_SETTINGS',
      data: {
        ...imageSettingsData,        
        imageSrc: state.context.imageWithSettings?.imageSrc || '',
        imageId: state.context.imageWithSettings?.imageId || '',
        author: state.context.imageWithSettings?.author || ''
      }
    });

    send({
      type: 'UPDATE_ITEM',
      data: imageSettingsData
    });
  };

  /**
   * Renders the page content when data is ready
   */
  const renderContent = (imageWithSettings: ImageWithSettings) => (
    <div className="row">
      <div className={`col-7 d-flex justify-content-center align-items-center ${styles.imageContainer}`}>
        <ImageWithCaption
          src={imageWithSettings.imageSrc}
          alt={imageWithSettings.imageId}
          caption={imageWithSettings.author}
        />

        {state.matches('UpdatingItem') && (
          <div className="position-absolute w-100 d-flex justify-content-center align-items-center">
            <Spinner />
          </div>
        )}
      </div>

      <div className="col-5">
        <ImageForm
          imageSettings={{
            width: imageWithSettings.width,
            height: imageWithSettings.height,
            mode: imageWithSettings.mode,
            blurValue: imageWithSettings.blurValue,            
          }}
          disabled={state.matches('UpdatingItem')}
          onSubmit={submitChanges}
        />

        <button
          className="btn btn-primary mt-4"
          type="button"
          onClick={() => send({ type: 'DOWNLOAD_ITEM', data: imageWithSettings.imageSrc })}
        >
          Download image
        </button>

        <div className="mt-4">
          <Link className="text-light text-decoration-none" to={getImageListRoute()}>
            <span>Back to list</span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      {state.context.imageWithSettings
        ? renderContent(state.context.imageWithSettings)
        : <ImageEditSkeleton />
      }
    </div>   
  );
};

export default ImageEdit;