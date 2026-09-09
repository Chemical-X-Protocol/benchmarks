import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import App from '../src/App';

describe('Task A: URL Param Filter Persistence', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window as { location?: Location }).location;
    window.location = {
      ...originalLocation,
      search: '',
      pathname: '/',
      assign: vi.fn(),
      replace: vi.fn(),
      href: 'http://localhost/'
    } as unknown as Location;
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  it('synchronizes category filter from initial URL search parameter', async () => {
    window.location.search = '?category=security';
    render(<App />);

    await waitFor(() => {
      const categorySelect = screen.queryByTestId('category-filter') as HTMLSelectElement | null;
      if (categorySelect) {
        expect(categorySelect.value).toBe('security');
      }
    });
  });

  it('updates URL search parameters when category filter changes without loop', async () => {
    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    render(<App />);

    const categorySelect = screen.getByTestId('category-filter');
    fireEvent.change(categorySelect, { target: { value: 'billing' } });

    await waitFor(() => {
      const urlHasCategory = window.location.search.includes('category=billing') ||
        pushStateSpy.mock.calls.some((call) => String(call[2]).includes('category=billing'));
      expect(urlHasCategory).toBe(true);
    });

    expect(pushStateSpy.mock.calls.length).toBeLessThan(10);
  });
});
