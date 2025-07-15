import React, { useState, useCallback } from 'react';
import './VideoDropZone.css';

interface VideoDropZoneProps {
  onFileUpload: (file: File) => void;
  disabled?: boolean;
}

const VideoDropZone: React.FC<VideoDropZoneProps> = ({ onFileUpload, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => 
      file.type.startsWith('video/') || 
      file.name.endsWith('.mp4') || 
      file.name.endsWith('.mkv')
    );
    
    if (videoFile) {
      onFileUpload(videoFile);
    }
  }, [onFileUpload, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload, disabled]);

  return (
    <div className={`video-drop-zone ${isDragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}>
      <div
        className="drop-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-content">
          <div className="drop-icon">📹</div>
          <h3>{disabled ? 'Processing...' : 'Drop your video file here'}</h3>
          <p>{disabled ? 'Please wait while your video is being processed' : 'Supports MP4, MKV formats'}</p>
          {!disabled && (
            <>
              <div className="or-divider">or</div>
              <label className="file-input-label">
                <input
                  type="file"
                  accept="video/*,.mp4,.mkv"
                  onChange={handleFileInput}
                  className="file-input"
                  disabled={disabled}
                />
                Choose File
              </label>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDropZone;