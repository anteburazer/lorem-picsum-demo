import React from 'react';

interface PaginationProps {
  className?: string;
  isPrevDisabled?: boolean,
  isNextDisabled?: boolean,
  onPrevClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onNextClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  className,
  isPrevDisabled,
  isNextDisabled,
  onPrevClick,
  onNextClick
}) => {
  return (
    <nav aria-label="Navigation" className={className}>
      <ul className="pagination">
        <li className={`page-item ${isPrevDisabled ? 'disabled' : ''}`}>
          <a className="page-link" href="/" onClick={onPrevClick}>
            Previous
          </a>
        </li>
        <li className={`page-item ${isNextDisabled ? 'disabled' : ''}`}>
          <a className="page-link" href="/" onClick={onNextClick}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;