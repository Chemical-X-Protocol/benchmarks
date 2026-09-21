import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MDashboardExportModal } from './m-dashboard-export-modal';

describe('MDashboardExportModal Capsule', () => {
  it('controls submission via CONFIRM token', () => {
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();

    render(
      <MDashboardExportModal
        isOpen={true}
        recordCount={5}
        onClose={handleClose}
        onConfirmExport={handleConfirm}
      />
    );

    const submitBtn = screen.getByTestId('submit-export-button') as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);

    const input = screen.getByTestId('confirm-export-input');
    fireEvent.change(input, { target: { value: 'CONFIRM' } });
    expect(submitBtn.disabled).toBe(false);

    fireEvent.click(submitBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
