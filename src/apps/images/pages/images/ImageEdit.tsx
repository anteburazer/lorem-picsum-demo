import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useService } from '@xstate/react';
import { imageMachineService } from 'apps/images/machines';
import {
  EditImageParams,
  ImageFormData,
  ImageSettings,
  ImageMode,
  ImageWithSettings
} from 'apps/images/models';
import ImageEditSkeleton from 'apps/images/components/ImageEditSkeleton';
import ImageForm from 'apps/images/components/imageForm/ImageForm';
import ImageWithCaption from 'apps/images/components/imageWithCaption/ImageWithCaption';
import {
  getImageListRoute,
  defaultImageSettings,
  loadImageWithSettingsFromStorage
} from 'apps/images/utils';
import styles from 'apps/images/pages/images/ImageEdit.module.scss';

const ImageEdit: React.FC = () => {
  const [state, send] = useService(imageMachineService);
  const { imageId } = useParams<EditImageParams>();

  useEffect(() => {
    /**
     * Loads the data from different sources
     */
    const pageOrchestrator = () => {
      if (!state.context.imageWithSettings) {
        const imageWithSettings = loadImageWithSettingsFromStorage();
  
        // We have data from storage and we can hidrate the state machine
        if (imageWithSettings && imageWithSettings.imageId === imageId) {
          send({
            type: 'SET_IMAGE_WITH_SETTINGS',
            data: imageWithSettings
          });
  
          console.log('Image found in the storage');  
          return;
        }
  
        // There is no data from storage and we need to fetch it
        // 1. Look at the images array and if it exists get the image from there
        if (state.context.images?.length) {
          const img = state.context.images.find(image => image.id === imageId);
  
          // 1.1. We found the image in images array so we can hidrate the state machine
          if (img) {
            send({
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
  
            console.log('Image found in the list');
          } else {
            // 1.2. Image not found in the images array so fetch it from the API
            send({ type: 'FETCH_ITEM', data: imageId });
            console.log('List is present but Image not found in the list');  
          }
        } else {
          // 2. images array is empty so fetch it from the API
          send({ type: 'FETCH_ITEM', data: imageId });
          console.log('List not present. Fetching the image');  
        }
      }
    };

    pageOrchestrator();
  }, [send, state.context.imageWithSettings, state.context.images, imageId]);

  useEffect(() => {
    return () => {
      send({
        type: 'SET_IMAGE_WITH_SETTINGS',
        data: undefined
      });
    }
  }, [send]);

  /**
   * Handles the form submission
   * Saves the data to state machine and requests the image updates from the API
   */
  const submitChanges = (imageData: ImageFormData) => {
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
      </div>

      <div className="col-5">
        <ImageForm
          imageSettings={{
            width: imageWithSettings.width,
            height: imageWithSettings.height,
            mode: imageWithSettings.mode,
            blurValue: imageWithSettings.blurValue,            
          }}
          disabled={state.matches('Updatingtem')}
          onSubmit={submitChanges}
        />

        <button
          className="btn btn-primary mt-4"
          type="button"
          onClick={() => send({ type: 'DOWNLOAD_ITEM', data: imageWithSettings.imageSrc })}
        >
          Download image
        </button>
      </div>
    </div>
  );

  return (
    <div className="">
      <nav className="navbar navbar-light bg-light">
        <Link to={getImageListRoute()}>
          <span>Back</span>
        </Link>
      </nav>

      <div className="container mt-5">
        {state.context.imageWithSettings
          ? renderContent(state.context.imageWithSettings)
          : <ImageEditSkeleton />
        }
      </div>
    </div>    
  );
};

export default ImageEdit;