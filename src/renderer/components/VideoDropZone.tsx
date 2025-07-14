import React, { useState, useCallback } from 'react';
import './VideoDropZone.css';

interface VideoDropZoneProps {
  onFileUpload: (file: File) => void;
}

const VideoDropZone: React.FC<VideoDropZoneProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
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
  }, [onFileUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <div className={`video-drop-zone ${isDragOver ? 'drag-over' : ''}`}>
      <div
        className="drop-area"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-content">
          <div className="drop-icon">📹</div>
          <h3>Drop your video file here</h3>
          <p>Supports MP4, MKV formats</p>
          <div className="or-divider">or</div>
          <label className="file-input-label">
            <input
              type="file"
              accept="video/*,.mp4,.mkv"
              onChange={handleFileInput}
              className="file-input"
            />
            Choose File
          </label>
        </div>
      </div>
    </div>
  );
};

export default VideoDropZone;