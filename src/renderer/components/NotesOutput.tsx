import React from 'react';
import './NotesOutput.css';

interface NotesOutputProps {
  notes: string;
  transcription?: string;
}

const NotesOutput: React.FC<NotesOutputProps> = ({ notes, transcription }) => {
  if (!notes) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(notes);
  };

  const downloadTranscript = () => {
    if (!transcription) return;
    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="notes-output">
      <div className="notes-header">
        <h3>Generated Notes</h3>
        <div className="button-group">
          <button className="copy-button" onClick={copyToClipboard}>
            📋 Copy to Clipboard
          </button>
          {transcription && (
            <button className="download-button" onClick={downloadTranscript}>
              📄 Download Transcript
            </button>
          )}
        </div>
      </div>
      <div className="notes-content">
        <pre>{notes}</pre>
      </div>
    </div>
  );
};

export default NotesOutput;