import React from 'react';

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

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#0f172a', borderTop: '1px solid #1e293b' }}>
      <span style={{ fontSize: '13px', color: '#94a3b8' }}>
        Page {currentPage} of {totalPages} ({totalItems} total records)
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
          style={{ padding: '6px 12px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px', cursor: isFirstPage ? 'not-allowed' : 'pointer' }}
        >
          Previous
        </button>
        <button
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
          style={{ padding: '6px 12px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px', cursor: isLastPage ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MDashboardPagination;
