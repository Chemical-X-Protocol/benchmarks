import React, { useState } from 'react';
import './m-dashboard-export-modal.css';

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

  // Stage 2: Unified decision variable
  const canSubmit = isConfirmed && !isSubmitting;

  if (!isOpen) return null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmationInput(event.target.value);
  };

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

  const submitBtnClass = canSubmit
    ? 'm-dashboard-export-modal__btn-submit m-dashboard-export-modal__btn-submit--active'
    : 'm-dashboard-export-modal__btn-submit m-dashboard-export-modal__btn-submit--disabled';

  return (
    <div data-testid="export-modal" className="m-dashboard-export-modal__overlay">
      <div className="m-dashboard-export-modal__content">
        <h3 className="m-dashboard-export-modal__title">Confirm Data Export</h3>
        <p className="m-dashboard-export-modal__description">
          Type <strong>CONFIRM</strong> to download {recordCount} filtered records as JSON.
        </p>
        <input
          data-testid="confirm-export-input"
          type="text"
          placeholder="Type CONFIRM..."
          value={confirmationInput}
          onChange={handleInputChange}
          className="m-dashboard-export-modal__input"
        />
        <div className="m-dashboard-export-modal__actions">
          <button
            data-testid="cancel-export-button"
            onClick={handleCancel}
            className="m-dashboard-export-modal__btn-cancel"
          >
            Cancel
          </button>
          <button
            data-testid="submit-export-button"
            disabled={!canSubmit}
            onClick={handleConfirm}
            className={submitBtnClass}
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default MDashboardExportModal;
