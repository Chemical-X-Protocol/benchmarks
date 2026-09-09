import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';

describe('Task C: Expired Token Error Boundary (toResult)', () => {
  let unhandledRejections: unknown[] = [];

  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    unhandledRejections.push(event.reason);
  };

  beforeEach(() => {
    unhandledRejections = [];
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
  });

  afterEach(() => {
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    vi.restoreAllMocks();
  });

  it('renders inline retry banner on 401 Unauthorized with zero unhandled rejections', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Token expired' })
      })
    );
    global.fetch = fetchMock;

    render(<App />);

    await waitFor(() => {
      const banner = screen.queryByTestId('auth-error-banner');
      expect(banner).toBeInTheDocument();
    });

    expect(unhandledRejections.length).toBe(0);

    const retryBtn = screen.getByTestId('retry-auth-button');
    expect(retryBtn).toBeInTheDocument();

    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          success: true,
          data: [
            { id: '1', name: 'Item 1', category: 'billing', amount: 100, status: 'active', createdAt: '2026-01-01' }
          ]
        })
      })
    );

    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('auth-error-banner')).not.toBeInTheDocument();
    });
  });
});
