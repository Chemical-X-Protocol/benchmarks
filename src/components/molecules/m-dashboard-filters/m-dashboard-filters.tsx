import React from 'react';
import type { RecordCategory, DashboardFilterState } from '../../../types/dashboard';
import './m-dashboard-filters.css';

export interface MDashboardFiltersProps {
  readonly filters: DashboardFilterState;
  readonly pageSize: number;
  readonly onCategoryChange: (cat: RecordCategory) => void;
  readonly onSearchChange: (query: string) => void;
  readonly onPageSizeChange: (size: number) => void;
}

export const MDashboardFilters: React.FC<MDashboardFiltersProps> = ({
  filters,
  pageSize,
  onCategoryChange,
  onSearchChange,
  onPageSizeChange
}) => {
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(event.target.value as RecordCategory);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(event.target.value));
  };

  return (
    <section className="m-dashboard-filters">
      <div className="m-dashboard-filters__group-category">
        <label className="m-dashboard-filters__label">Category</label>
        <select
          data-testid="category-filter"
          value={filters.category}
          onChange={handleCategoryChange}
          className="m-dashboard-filters__select"
        >
          <option value="all">All Categories</option>
          <option value="billing">Billing Operations</option>
          <option value="security">Security Events</option>
          <option value="operations">Core Operations</option>
        </select>
      </div>

      <div className="m-dashboard-filters__group-search">
        <label className="m-dashboard-filters__label">Search Records</label>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search by name or category..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="m-dashboard-filters__input"
        />
      </div>

      <div className="m-dashboard-filters__group-page-size">
        <label className="m-dashboard-filters__label">Page Size</label>
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="m-dashboard-filters__select"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
        </select>
      </div>
    </section>
  );
};

export default MDashboardFilters;
