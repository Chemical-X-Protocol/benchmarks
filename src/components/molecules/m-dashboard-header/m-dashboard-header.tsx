import React from 'react';

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
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', color: '#62c9ff' }}>{title}</h1>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Chemical X Architecture Capsule: Table of Contents & Isolated Molecules
        </p>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          data-testid="refresh-button"
          onClick={onRefresh}
          style={{ padding: '8px 16px', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px', cursor: 'pointer' }}
        >
          Refresh
        </button>
        <button
          data-testid="open-export-modal-button"
          onClick={onOpenExportModal}
          style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Export Records
        </button>
      </div>
    </header>
  );
};

export default MDashboardHeader;
