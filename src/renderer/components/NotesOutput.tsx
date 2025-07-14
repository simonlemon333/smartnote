import React from 'react';
import './NotesOutput.css';

interface NotesOutputProps {
  notes: string;
}

const NotesOutput: React.FC<NotesOutputProps> = ({ notes }) => {
  if (!notes) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes);
  };

  return (
    <div className="notes-output">
      <div className="notes-header">
        <h3>Generated Notes</h3>
        <button className="copy-button" onClick={copyToClipboard}>
          📋 Copy to Clipboard
        </button>
      </div>
      <div className="notes-content">
        <pre>{notes}</pre>
      </div>
    </div>
  );
};

export default NotesOutput;