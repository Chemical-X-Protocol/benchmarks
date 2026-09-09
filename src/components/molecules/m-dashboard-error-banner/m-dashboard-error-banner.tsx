import React from 'react';

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
          style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '6px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <strong>Authentication Alert: </strong>
            <span>{authError}</span>
          </div>
          <button
            data-testid="retry-auth-button"
            onClick={onRetryAuth}
            style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Retry Login
          </button>
        </div>
      )}

      {isRetrying && (
        <div
          data-testid="rate-limit-retry-indicator"
          style={{ padding: '8px 16px', background: 'rgba(234, 179, 8, 0.2)', border: '1px solid #eab308', borderRadius: '6px', marginBottom: '16px', color: '#fef08a' }}
        >
          Rate limit encountered (429). Exponential backoff in progress...
        </div>
      )}
    </div>
  );
};

export default MDashboardErrorBanner;
