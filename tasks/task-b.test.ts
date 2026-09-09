import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../src/App';

describe('Task B: Export-to-JSON Modal with Validation', () => {
  it('requires typing CONFIRM before unlocking export button', async () => {
    render(<App />);

    const openModalBtn = screen.getByTestId('open-export-modal-button');
    fireEvent.click(openModalBtn);

    const modal = screen.getByTestId('export-modal');
    expect(modal).toBeInTheDocument();

    const confirmInput = screen.getByTestId('confirm-export-input');
    const submitBtn = screen.getByTestId('submit-export-button') as HTMLButtonElement;

    expect(submitBtn.disabled).toBe(true);

    fireEvent.change(confirmInput, { target: { value: 'confirm' } });
    expect(submitBtn.disabled).toBe(true);

    fireEvent.change(confirmInput, { target: { value: 'CONFIRM' } });
    expect(submitBtn.disabled).toBe(false);

    const downloadSpy = vi.fn();
    (window as unknown as { mockDownloadFn?: () => void }).mockDownloadFn = downloadSpy;

    fireEvent.click(submitBtn);
    expect(screen.queryByTestId('export-modal')).not.toBeInTheDocument();
  });

  it('resets confirmation input state when modal is cancelled', async () => {
    render(<App />);

    const openModalBtn = screen.getByTestId('open-export-modal-button');
    fireEvent.click(openModalBtn);

    const confirmInput = screen.getByTestId('confirm-export-input') as HTMLInputElement;
    fireEvent.change(confirmInput, { target: { value: 'CONFI' } });

    const cancelBtn = screen.getByTestId('cancel-export-button');
    fireEvent.click(cancelBtn);

    expect(screen.queryByTestId('export-modal')).not.toBeInTheDocument();

    fireEvent.click(openModalBtn);
    const reopenedInput = screen.getByTestId('confirm-export-input') as HTMLInputElement;
    expect(reopenedInput.value).toBe('');
  });
});
