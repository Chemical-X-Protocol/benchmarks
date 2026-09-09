import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';

describe('Task D: Rate-Limit (429) Backoff in Async Fetch', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('performs exponential backoff on 429 and displays retry indicator', async () => {
    let callCount = 0;
    const fetchMock = vi.fn().mockImplementation(() => {
      callCount += 1;
      if (callCount <= 2) {
        return Promise.resolve({
          ok: false,
          status: 429,
          statusText: 'Too Many Requests',
          json: async () => ({ error: 'Rate limited' })
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({
          success: true,
          data: [
            { id: '1', name: 'Item 1', category: 'operations', amount: 250, status: 'active', createdAt: '2026-01-01' }
          ]
        })
      });
    });

    global.fetch = fetchMock;

    const { unmount } = render(<App />);

    await waitFor(() => {
      const indicator = screen.queryByTestId('rate-limit-retry-indicator');
      expect(indicator).toBeInTheDocument();
    });

    // Advance timer for first backoff (e.g., 500ms - 1000ms)
    vi.advanceTimersByTime(1200);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    // Advance timer for second backoff
    vi.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(screen.queryByTestId('rate-limit-retry-indicator')).not.toBeInTheDocument();
    });

    unmount();
  });
});
