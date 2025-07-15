import React, { useState } from 'react';
import './TranscriptInput.css';

interface TranscriptInputProps {
  onTranscriptSubmit: (transcript: string) => void;
  disabled?: boolean;
}

const TranscriptInput: React.FC<TranscriptInputProps> = ({ onTranscriptSubmit, disabled }) => {
  const [transcript, setTranscript] = useState('');

  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscriptSubmit(transcript.trim());
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTranscript(content);
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Allow default paste behavior
    setTimeout(() => {
      const pastedText = event.currentTarget.value;
      setTranscript(pastedText);
    }, 0);
  };

  return (
    <div className="transcript-input">
      <div className="transcript-input-header">
        <h3>📄 Process Transcript</h3>
        <p>Upload a text file or paste your transcript directly</p>
      </div>
      
      <div className="transcript-input-methods">
        <div className="file-upload-section">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            disabled={disabled}
            id="transcript-file"
            style={{ display: 'none' }}
          />
          <label htmlFor="transcript-file" className={`file-upload-button ${disabled ? 'disabled' : ''}`}>
            📁 Upload Text File
          </label>
        </div>

        <div className="text-input-section">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onPaste={handlePaste}
            placeholder="Or paste your transcript here..."
            disabled={disabled}
            rows={10}
            className="transcript-textarea"
          />
        </div>
      </div>

      <div className="transcript-input-actions">
        <button 
          onClick={handleSubmit}
          disabled={disabled || !transcript.trim()}
          className="process-button"
        >
          🧠 Process Transcript
        </button>
        <button 
          onClick={() => setTranscript('')}
          disabled={disabled}
          className="clear-button"
        >
          🗑️ Clear
        </button>
      </div>

      {transcript && (
        <div className="transcript-preview">
          <p className="preview-label">Preview ({transcript.length} characters):</p>
          <div className="preview-text">
            {transcript.substring(0, 200)}...
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptInput;