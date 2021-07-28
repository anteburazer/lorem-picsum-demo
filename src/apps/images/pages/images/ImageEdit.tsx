import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useService } from '@xstate/react';
import { imageMachineService } from 'apps/images/machines';
import { EditImageParams, Image, ImageFormData, ImageSettings, ImageMode } from 'apps/images/models';
import ImageEditSkeleton from 'apps/images/components/ImageEditSkeleton';
import ImageForm from 'apps/images/components/imageForm/ImageForm';
import { getImageListRoute } from 'apps/images/utils';

const ImageEdit: React.FC = () => {
  const [state, send] = useService(imageMachineService);
  const { imageId } = useParams<EditImageParams>();

  useEffect(() => {
    if (state.context.images?.length) {
      const img = state.context.images.find(image => image.id === imageId);

      if (img) {
        send({ type: 'SELECT_IMAGE', data: img });      
      } else {
        send({ type: 'FETCH_ITEM', data: imageId });
      }
    } else {
      send({ type: 'FETCH_ITEM', data: imageId });
    }
  }, [state.context.images, imageId, send]);

  const submitChanges = (imageData: ImageFormData) => {
    const data: ImageSettings = {
      ...imageData,
      mode: imageData.mode ? imageData.mode.map(mode => mode.key as ImageMode) : []
    };
    console.log(data);
    send({
      type: 'UPDATE_ITEM',
      data
    });
  };

  const getImageSource = () => (
    state.context.imageUpdated
      ? `data:image/jpeg;base64,${state.context.imageUpdated}`
      : state.context.selectedImage?.download_url
  );

  const renderContent = (image: Image) => (
    <div className="row">
      <div className="col-7">
        <img src={getImageSource()} className="w-100" alt={image.id} />
      </div>

      <div className="col-5">
        <ImageForm
          image={image}
          disabled={state.matches('Updatingtem')}
          onSubmit={submitChanges}
        />
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
        {state.context.selectedImage
          ? renderContent(state.context.selectedImage)
          : <ImageEditSkeleton />
        }
      </div>
    </div>    
  );
};

export default ImageEdit;