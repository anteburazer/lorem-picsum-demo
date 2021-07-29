import React from 'react';
import styles from 'apps/images/components/imageWithCaption/ImageWithCaption.module.scss';

interface ImageWithCaptionProps {
  src: string;
  caption: string;
  alt?: string;
}

const ImageWithCaption: React.FC<ImageWithCaptionProps> = ({ src, caption, alt }) => {
  return (
    <div className="position-relative">
      <img src={src} alt={alt} />
      <div className={styles.caption}>
        <span>{caption}</span>
      </div>
    </div>
  );
};

export default ImageWithCaption;