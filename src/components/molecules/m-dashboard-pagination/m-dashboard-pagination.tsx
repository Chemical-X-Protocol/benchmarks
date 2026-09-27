import React from 'react';
import './m-dashboard-pagination.css';

export interface MDashboardPaginationProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly onPageChange: (page: number) => void;
}

export const MDashboardPagination: React.FC<MDashboardPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) => {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  const prevBtnClass = isFirstPage
    ? 'm-dashboard-pagination__btn m-dashboard-pagination__btn--disabled'
    : 'm-dashboard-pagination__btn';

  const nextBtnClass = isLastPage
    ? 'm-dashboard-pagination__btn m-dashboard-pagination__btn--disabled'
    : 'm-dashboard-pagination__btn';

  return (
    <div className="m-dashboard-pagination">
      <span className="m-dashboard-pagination__info">
        Page {currentPage} of {totalPages} ({totalItems} total records)
      </span>
      <div className="m-dashboard-pagination__actions">
        <button
          disabled={isFirstPage}
          onClick={handlePrevious}
          className={prevBtnClass}
        >
          Previous
        </button>
        <button
          disabled={isLastPage}
          onClick={handleNext}
          className={nextBtnClass}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MDashboardPagination;
