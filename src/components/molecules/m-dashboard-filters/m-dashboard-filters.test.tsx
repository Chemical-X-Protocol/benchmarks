import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MDashboardFilters } from './m-dashboard-filters';

describe('MDashboardFilters Capsule', () => {
  it('updates filters and triggers callbacks', () => {
    const handleCategoryChange = vi.fn();
    const handleSearchChange = vi.fn();
    const handlePageSizeChange = vi.fn();

    render(
      <MDashboardFilters
        filters={{ category: 'all', searchQuery: '' }}
        pageSize={10}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onPageSizeChange={handlePageSizeChange}
      />
    );

    fireEvent.change(screen.getByTestId('category-filter'), { target: { value: 'billing' } });
    expect(handleCategoryChange).toHaveBeenCalledWith('billing');

    fireEvent.change(screen.getByTestId('search-input'), { target: { value: 'audit' } });
    expect(handleSearchChange).toHaveBeenCalledWith('audit');
  });
});
