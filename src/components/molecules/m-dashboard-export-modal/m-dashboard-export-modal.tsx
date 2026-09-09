import React, { useState } from 'react';

export interface MDashboardExportModalProps {
  readonly isOpen: boolean;
  readonly recordCount: number;
  readonly onClose: () => void;
  readonly onConfirmExport: () => void;
}

export const MDashboardExportModal: React.FC<MDashboardExportModalProps> = ({
  isOpen,
  recordCount,
  onClose,
  onConfirmExport
}) => {
  const [confirmationInput, setConfirmationInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Stage 1: Atomic concept booleans
  const isConfirmed = confirmationInput === 'CONFIRM';
  const hasRecords = recordCount > 0;

  // Stage 2: Unified decision variable
  const canSubmit = isConfirmed && !isSubmitting && hasRecords;

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Stage 3: Early-return guard clause
    if (!canSubmit) return;

    setIsSubmitting(true);
    onConfirmExport();
    setIsSubmitting(false);
    setConfirmationInput('');
    onClose();
  };

  const handleCancel = () => {
    setConfirmationInput('');
    onClose();
  };

  return (
    <div
      data-testid="export-modal"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
    >
      <div style={{ background: '#131e3a', padding: '24px', borderRadius: '8px', width: '420px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 12px', color: '#fff' }}>Confirm Data Export</h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
          Type <strong>CONFIRM</strong> to download {recordCount} filtered records as JSON.
        </p>
        <input
          data-testid="confirm-export-input"
          type="text"
          placeholder="Type CONFIRM..."
          value={confirmationInput}
          onChange={(e) => setConfirmationInput(e.target.value)}
          style={{ width: '100%', padding: '10px', background: '#0b1329', border: '1px solid #334155', borderRadius: '4px', color: '#fff', boxSizing: 'border-box', marginBottom: '20px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            data-testid="cancel-export-button"
            onClick={handleCancel}
            style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            data-testid="submit-export-button"
            disabled={!canSubmit}
            onClick={handleConfirm}
            style={{ padding: '8px 16px', background: canSubmit ? '#0284c7' : '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: canSubmit ? 'pointer' : 'not-allowed' }}
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default MDashboardExportModal;
