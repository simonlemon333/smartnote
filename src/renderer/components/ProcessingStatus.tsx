import React from 'react';
import './ProcessingStatus.css';

interface ProcessingStatusProps {
  isProcessing: boolean;
  status: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ isProcessing, status }) => {
  if (!status) return null;

  return (
    <div className="processing-status">
      <div className="status-content">
        {isProcessing && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
        <span className="status-text">{status}</span>
      </div>
    </div>
  );
};

export default ProcessingStatus;