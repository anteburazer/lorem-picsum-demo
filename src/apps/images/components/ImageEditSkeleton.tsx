import React from 'react';
import ImagePlaceholder from 'apps/images/components/imagePlaceholder/ImagePlaceholder';
import Spinner from 'components/Spinner';

const ImageEditSkeleton: React.FC = () => {
  return (
    <div className="row">
      <div className="col-7">
        <ImagePlaceholder />
      </div>
      <Spinner />
    </div>
  );
};

export default ImageEditSkeleton;