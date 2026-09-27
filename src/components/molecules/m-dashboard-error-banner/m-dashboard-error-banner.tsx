import React from 'react';
import './m-dashboard-error-banner.css';

export interface MDashboardErrorBannerProps {
  readonly authError: string | null;
  readonly isRetrying: boolean;
  readonly onRetryAuth: () => void;
}

export const MDashboardErrorBanner: React.FC<MDashboardErrorBannerProps> = ({
  authError,
  isRetrying,
  onRetryAuth
}) => {
  const hasAuthError = Boolean(authError);
  const shouldRenderBanner = hasAuthError || isRetrying;

  if (!shouldRenderBanner) return null;

  return (
    <div>
      {hasAuthError && (
        <div
          data-testid="auth-error-banner"
          className="m-dashboard-error-banner__alert"
        >
          <div>
            <strong>Authentication Alert: </strong>
            <span>{authError}</span>
          </div>
          <button
            data-testid="retry-auth-button"
            onClick={onRetryAuth}
            className="m-dashboard-error-banner__retry-btn"
          >
            Retry Login
          </button>
        </div>
      )}

      {isRetrying && (
        <div
          data-testid="rate-limit-retry-indicator"
          className="m-dashboard-error-banner__retry-indicator"
        >
          Rate limit encountered (429). Exponential backoff in progress...
        </div>
      )}
    </div>
  );
};

export default MDashboardErrorBanner;
