import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MDashboardErrorBanner } from './m-dashboard-error-banner';

describe('MDashboardErrorBanner Capsule', () => {
  it('renders auth error banner with retry trigger', () => {
    const handleRetry = vi.fn();

    const { rerender } = render(
      <MDashboardErrorBanner
        authError="Session expired"
        isRetrying={false}
        onRetryAuth={handleRetry}
      />
    );

    expect(screen.getByTestId('auth-error-banner')).toBeInTheDocument();
    expect(screen.getByText('Session expired')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('retry-auth-button'));
    expect(handleRetry).toHaveBeenCalledTimes(1);

    rerender(
      <MDashboardErrorBanner
        authError={null}
        isRetrying={true}
        onRetryAuth={handleRetry}
      />
    );

    expect(screen.getByTestId('rate-limit-retry-indicator')).toBeInTheDocument();
  });
});
