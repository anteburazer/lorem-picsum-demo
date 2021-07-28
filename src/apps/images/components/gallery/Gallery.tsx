import React from 'react';
import { Link } from 'react-router-dom';
import styles from 'apps/images/components/gallery/Gallery.module.scss';
import { Image } from 'apps/images/models';
import { getImageEditRoute } from 'apps/images/utils';

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
            <div
              className={`cursor-pointer ${styles.item}`}
              style={{ backgroundImage: `url(${image.download_url})` }} 
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Gallery;