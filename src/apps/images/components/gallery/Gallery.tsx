import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'apps/images/models';
import { getImageEditRoute, getImageSrcByDimension } from 'apps/images/utils';
import ImageWithCaption from 'apps/images/components/imageWithCaption/ImageWithCaption';
import styles from 'apps/images/components/gallery/Gallery.module.scss';

interface GalleryProps {
  images: Image[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className={`row ${styles.gallery}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`col-sm-6 col-md-4 col-lg-3 ${styles.itemContainer}`}                 
        >
          <Link to={getImageEditRoute(image.id)}>
            <ImageWithCaption
              src={getImageSrcByDimension(image.download_url, 300, 200)}
              caption={image.author}
            />
          </Link>
        </div>
      ))}

      {!images.length && (
        <div className="mt-4 mb-4 d-flex justify-content-center">
          <h4>No images</h4>
        </div>
      )}
    </div>
  );
};

export default Gallery;