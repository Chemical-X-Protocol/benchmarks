import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';

describe('Task E: Table Column Reordering & Sort Toggle', () => {
  it('cycles tri-state amount sort toggle (NONE -> ASC -> DESC -> NONE)', async () => {
    const mockData = [
      { id: '1', name: 'Alpha', category: 'billing', amount: 300, status: 'active', createdAt: '2026-01-01' },
      { id: '2', name: 'Beta', category: 'security', amount: 100, status: 'active', createdAt: '2026-01-02' },
      { id: '3', name: 'Gamma', category: 'operations', amount: 200, status: 'active', createdAt: '2026-01-03' }
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true, data: mockData })
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('record-row-amount').length).toBe(3);
    });

    const sortHeader = screen.getByTestId('sort-header-amount');

    // Click 1: ASC (100, 200, 300)
    fireEvent.click(sortHeader);
    let amounts = screen.getAllByTestId('record-row-amount').map((el) => Number(el.textContent));
    expect(amounts).toEqual([100, 200, 300]);

    // Click 2: DESC (300, 200, 100)
    fireEvent.click(sortHeader);
    amounts = screen.getAllByTestId('record-row-amount').map((el) => Number(el.textContent));
    expect(amounts).toEqual([300, 200, 100]);

    // Click 3: NONE (natural order: 300, 100, 200)
    fireEvent.click(sortHeader);
    amounts = screen.getAllByTestId('record-row-amount').map((el) => Number(el.textContent));
    expect(amounts).toEqual([300, 100, 200]);
  });
});
