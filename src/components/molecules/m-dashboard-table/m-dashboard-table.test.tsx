import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MDashboardTable } from './m-dashboard-table';
import type { DashboardRecord, DashboardSortState } from '../../../types/dashboard';

describe('MDashboardTable Capsule', () => {
  const dummyItems: DashboardRecord[] = [
    { id: 'REC-1', name: 'Alpha Stream', category: 'billing', amount: 150, status: 'active', createdAt: '2026-01-01' },
    { id: 'REC-2', name: 'Beta Signal', category: 'security', amount: 350, status: 'active', createdAt: '2026-01-02' }
  ];

  const defaultSort: DashboardSortState = { column: 'amount', direction: 'none' };

  it('renders loading indicator when isLoading is true', () => {
    render(
      <MDashboardTable
        items={[]}
        isLoading={true}
        sortState={defaultSort}
        onToggleAmountSort={vi.fn()}
      />
    );

    expect(screen.getByText('Loading records...')).toBeInTheDocument();
  });

  it('renders records and handles sort toggle click', () => {
    const handleSortToggle = vi.fn();

    render(
      <MDashboardTable
        items={dummyItems}
        isLoading={false}
        sortState={{ column: 'amount', direction: 'asc' }}
        onToggleAmountSort={handleSortToggle}
      />
    );

    expect(screen.getByText('Alpha Stream')).toBeInTheDocument();
    expect(screen.getByText('Beta Signal')).toBeInTheDocument();

    const sortHeader = screen.getByTestId('sort-header-amount');
    fireEvent.click(sortHeader);
    expect(handleSortToggle).toHaveBeenCalledTimes(1);
  });
});
