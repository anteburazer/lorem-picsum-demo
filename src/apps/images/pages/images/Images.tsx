import React, { useEffect, useState } from 'react';
import { useService } from '@xstate/react';
import { imageMachineService } from 'apps/images/machines';
import Gallery from 'apps/images/components/gallery/Gallery';
import SearchInput from 'components/SearchInput';
import Pagination from 'components/Pagination';
import { Image } from 'apps/images/models';
import { PaginationDirection } from 'core/models';
import { useQuery } from 'core/hooks';

const Images: React.FC = () => {
  const [state, send] = useService(imageMachineService);

  const [imagesFiltered, setImagesFiltered] = useState<Image[]>([]);
  const query = useQuery();

  /**
   * Fetch images on component mount
   */
  useEffect(() => {
    send({
      type: 'SET_PAGINATION',
      data: {
        page: query.get('page'),
        limit: query.get('limit')
      }
    });

    send({ type: 'FETCH_LIST' });
  }, [send]);

  useEffect(() => {
    if (state.context.images) {
      setImagesFiltered(state.context.images);
    }
  }, [state.context.images]);

  const searchImages = (searchTerm: string) => (
    setImagesFiltered(state.context.images
      ? state.context.images.filter((image: Image) => image.author.toLowerCase().includes(searchTerm.toLowerCase()))
      : []
    )
  );

  const handlePageChange = (e: React.MouseEvent<HTMLAnchorElement>, direction: PaginationDirection) => {
    e.preventDefault();

    if (direction === PaginationDirection.prev) {
      send({ type: 'GO_PREV' });
    }

    if (direction === PaginationDirection.next) {
      send({ type: 'GO_NEXT' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="mb-5">
        <h1 className="text-center">Synthesia image demo</h1>
        <p className="text-center">Click on the image to edit</p>
        {JSON.stringify(state.context.pagination)}
      </div>

      <div className="mb-4">
        <SearchInput onChange={searchImages} />
      </div>

      <Gallery images={imagesFiltered} />

      <div className="d-flex justify-content-center">
        <Pagination
          isPrevDisabled={state.context.pagination.current === state.context.pagination.prev}
          isNextDisabled={state.context.pagination.current === state.context.pagination.next}
          onPrevClick={(e: React.MouseEvent<HTMLAnchorElement>) => handlePageChange(e, PaginationDirection.prev)}
          onNextClick={(e: React.MouseEvent<HTMLAnchorElement>) => handlePageChange(e, PaginationDirection.next)}
        />
      </div>
    </div>
  );
};

export default Images;