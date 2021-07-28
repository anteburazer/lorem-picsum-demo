import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from '@fortawesome/free-solid-svg-icons';
import styles from 'apps/images/components/imagePlaceholder/ImagePlaceholder.module.scss';

const ImagePlaceholder: React.FC = () => {
  return (
    <div className={`
      w-100
      d-flex
      justify-content-center
      align-items-center
      position-relative
      ${styles.imagePlacefolder}`
    }>
      <FontAwesomeIcon
        icon={ faImage }
        size='3x'
      />
    </div>
  );
};

export default ImagePlaceholder;