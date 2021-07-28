import React from 'react';
import ImagePlaceholder from 'apps/images/components/imagePlaceholder/ImagePlaceholder';

const ImageEditSkeleton: React.FC = () => {
  return (
    <div className="row">
      <div className="col-7">
        <ImagePlaceholder />
      </div>
      <div className="col-5 d-flex justify-content-center align-items-center">
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default ImageEditSkeleton;