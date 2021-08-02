import React, { useEffect, useState } from 'react';
import { useService, useMachine } from '@xstate/react';
import { imageListMachine } from 'apps/images/machines';
import Gallery from 'apps/images/components/gallery/Gallery';
import SearchInput from 'components/SearchInput';
import Pagination from 'components/Pagination';
import Spinner from 'components/Spinner';
import {
  Image,
  ImagesMachineContext,
  ImagesMachineEvent,
  ImagesMachineState,
} from 'apps/images/models';
import { PaginationDirection } from 'core/models';
import { useQuery } from 'core/hooks';
import { ImagesServiceContext } from 'apps/images/App';

const Images: React.FC = () => {
  // Initialize local state machine
  const [state, send, service] = useMachine(imageListMachine);

  // Consume the global state machine through React context
  const imagesMachineService = React.useContext(ImagesServiceContext);
  const [globalState, sendToGlobal] = useService<ImagesMachineContext, ImagesMachineEvent, ImagesMachineState>(imagesMachineService);

  const [imagesFiltered, setImagesFiltered] = useState<Image[]>([]);
  const query = useQuery();

  /* eslint-disable */
  useEffect(() => {
    const pageQueryParam = query.get('page');
    const limitQueryParam = query.get('limit');

    // Read the query string and initialize the machine
    send({
      type: 'INIT',
      data: {
        page: pageQueryParam ? parseInt(pageQueryParam, 10) : globalState.context.currentPage,
        limit: limitQueryParam ? parseInt(limitQueryParam, 10) : 20,
        images: globalState.context.images || []
      }
    });

    // Subscribe to local machine changes
    const subscription = service.subscribe((newState) => {
      // Send current page to the global machine
      if (globalState.context.currentPage !== newState.context.pagination.current) {
        sendToGlobal({
          type: 'SET_CURRENT_PAGE',
          data: newState.context.pagination.current
        });
      }
    });

    service.onEvent((event: any) => {
      if (event.type === 'done.invoke.fetchImages') {
        // Send the images to the global machine after we fetch them
        sendToGlobal({
          type: 'SET_IMAGES',
          data: event.data.images
        });
      }
    });
  
    return subscription.unsubscribe;
  }, []);
  /* eslint-enable */

  useEffect(() => {
    if (state.context.images) {
      setImagesFiltered(state.context.images);
    }
  }, [state.context.images]);

  /**
   * Handle changes from the search input and filter the images
   */
  const searchImages = (searchTerm: string) => (
    setImagesFiltered(state.context.images
      ? state.context.images.filter((image: Image) => image.author.toLowerCase().includes(searchTerm.toLowerCase()))
      : []
    )
  );

  /**
   * Handle the pagination links click and send events to the state machine to fetch new items
   */
  const handlePageChange = (e: React.MouseEvent<HTMLAnchorElement>, direction: PaginationDirection) => {
    e.preventDefault();

    if (direction === PaginationDirection.prev && state.context.pagination.current > 1) {
      send({
        type: 'GO_PREV',
        data: {
          page: state.context.pagination.current - 1,
          limit: state.context.pagination.limit
        }
      });
    }

    if (direction === PaginationDirection.next && state.context.pagination.next > state.context.pagination.current) {
      send({
        type: 'GO_NEXT',
        data: {
          page: state.context.pagination.current + 1,
          limit: state.context.pagination.limit
        }
      });
    }

    sendToGlobal({
      type: 'SET_CURRENT_PAGE',
      data: state.context.pagination.current
    });
  };

  const renderErrorPage = () => (
    <h3 className="mt-5 text-center">Sorry, something went wrong</h3>
  );

  const renderLoader = () => (
    <div className="pt-5 d-flex justify-content-center align-items-center">
      <Spinner />
    </div>
  );

  const renderContent = () => (
    <>
      <SearchInput
        className="mb-4"
        onChange={searchImages}
      />

      <Gallery images={imagesFiltered} />

      <span>Current Page: {state.context.pagination.current}</span>

      <Pagination
        className="d-flex justify-content-center"
        isPrevDisabled={state.context.pagination.current === state.context.pagination.prev}
        isNextDisabled={state.context.pagination.current === state.context.pagination.next}
        onPrevClick={(e: React.MouseEvent<HTMLAnchorElement>) => handlePageChange(e, PaginationDirection.prev)}
        onNextClick={(e: React.MouseEvent<HTMLAnchorElement>) => handlePageChange(e, PaginationDirection.next)}
      />
    </>
  );

  return (
    <div className="container mt-5">
      <div className="mb-5">
        <h1 className="text-center">Synthesia image demo</h1>
        <p className="text-center">Click on the image to edit</p>
      </div>

      {state.matches('FetchingList') && !state.context.images?.length && renderLoader()}
      {state.matches('Idle') && renderContent()}
      {state.matches('Failed') && renderErrorPage()}
    </div>
  );
};

export default Images;