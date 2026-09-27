import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MDashboardPagination } from './m-dashboard-pagination';

describe('MDashboardPagination Capsule', () => {
  it('disables boundary buttons and handles page navigation', () => {
    const handlePageChange = vi.fn();

    const { rerender } = render(
      <MDashboardPagination
        currentPage={1}
        totalPages={3}
        totalItems={25}
        onPageChange={handlePageChange}
      />
    );

    const prevBtn = screen.getByRole('button', { name: /previous/i }) as HTMLButtonElement;
    const nextBtn = screen.getByRole('button', { name: /next/i }) as HTMLButtonElement;

    expect(prevBtn.disabled).toBe(true);
    expect(nextBtn.disabled).toBe(false);

    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);

    rerender(
      <MDashboardPagination
        currentPage={3}
        totalPages={3}
        totalItems={25}
        onPageChange={handlePageChange}
      />
    );

    expect(nextBtn.disabled).toBe(true);
  });
});
