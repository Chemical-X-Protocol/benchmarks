import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MDashboardHeader } from './m-dashboard-header';

describe('MDashboardHeader Capsule', () => {
  it('renders title and triggers header actions', () => {
    const handleRefresh = vi.fn();
    const handleOpenExport = vi.fn();

    render(
      <MDashboardHeader
        title="Executive Metrics"
        onRefresh={handleRefresh}
        onOpenExportModal={handleOpenExport}
      />
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Executive Metrics');

    fireEvent.click(screen.getByTestId('refresh-button'));
    expect(handleRefresh).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('open-export-modal-button'));
    expect(handleOpenExport).toHaveBeenCalledTimes(1);
  });
});
