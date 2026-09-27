import React from 'react';
import './m-dashboard-header.css';

export interface MDashboardHeaderProps {
  readonly title: string;
  readonly onRefresh: () => void;
  readonly onOpenExportModal: () => void;
}

export const MDashboardHeader: React.FC<MDashboardHeaderProps> = ({
  title,
  onRefresh,
  onOpenExportModal
}) => {
  return (
    <header className="m-dashboard-header">
      <div>
        <h1 className="m-dashboard-header__title">{title}</h1>
        <p className="m-dashboard-header__description">
          Chemical X Architecture Capsule: Table of Contents & Isolated Molecules
        </p>
      </div>
      <div className="m-dashboard-header__actions">
        <button
          data-testid="refresh-button"
          onClick={onRefresh}
          className="m-dashboard-header__btn-refresh"
        >
          Refresh
        </button>
        <button
          data-testid="open-export-modal-button"
          onClick={onOpenExportModal}
          className="m-dashboard-header__btn-export"
        >
          Export Records
        </button>
      </div>
    </header>
  );
};

export default MDashboardHeader;
