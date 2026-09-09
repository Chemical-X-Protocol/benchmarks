import React from 'react';
import type { RecordCategory, DashboardFilterState } from '../../../types/dashboard';

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
  return (
    <section style={{ display: 'flex', gap: '16px', marginBottom: '20px', background: '#131e3a', padding: '16px', borderRadius: '8px' }}>
      <div style={{ flex: 1 }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Category</label>
        <select
          data-testid="category-filter"
          value={filters.category}
          onChange={(e) => onCategoryChange(e.target.value as RecordCategory)}
          style={{ width: '100%', padding: '8px', background: '#0b1329', color: '#fff', border: '1px solid #334155', borderRadius: '4px' }}
        >
          <option value="all">All Categories</option>
          <option value="billing">Billing Operations</option>
          <option value="security">Security Events</option>
          <option value="operations">Core Operations</option>
        </select>
      </div>

      <div style={{ flex: 2 }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Search Records</label>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search by name or category..."
          value={filters.searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: '100%', padding: '8px', background: '#0b1329', color: '#fff', border: '1px solid #334155', borderRadius: '4px' }}
        />
      </div>

      <div style={{ width: '140px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Page Size</label>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ width: '100%', padding: '8px', background: '#0b1329', color: '#fff', border: '1px solid #334155', borderRadius: '4px' }}
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
