import React, { useState } from 'react';
import VideoDropZone from './components/VideoDropZone';
import ProcessingStatus from './components/ProcessingStatus';
import NotesOutput from './components/NotesOutput';
import './App.css';

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const handleVideoUpload = async (file: File) => {
    setIsProcessing(true);
    setProcessingStatus('Processing video...');
    
    try {
      // For drag-and-drop, we need to get the file path
      let videoPath = '';
      if ((file as any).path) {
        videoPath = (file as any).path;
      } else {
        // If no path available, use file dialog
        const selectedPath = await window.electronAPI.selectVideoFile();
        if (!selectedPath) {
          setProcessingStatus('No video selected');
          setIsProcessing(false);
          return;
        }
        videoPath = selectedPath;
      }
      
      const result = await window.electronAPI.processVideo(videoPath);
      
      if (result.success) {
        setProcessingStatus('Video processed successfully!');
        setGeneratedNotes(result.summary || result.transcription || 'Processing completed');
      } else {
        setProcessingStatus(`Error: ${result.error}`);
      }
      
      setIsProcessing(false);
    } catch (error) {
      setProcessingStatus('Error processing video');
      setIsProcessing(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Smart Note</h1>
        <p>Transform your videos into structured notes</p>
      </header>
      
      <main className="app-main">
        <VideoDropZone onFileUpload={handleVideoUpload} />
        <ProcessingStatus 
          isProcessing={isProcessing} 
          status={processingStatus} 
        />
        <NotesOutput notes={generatedNotes} />
      </main>
    </div>
  );
};

declare global {
  interface Window {
    electronAPI: {
      processVideo: (videoPath: string) => Promise<any>;
      selectVideoFile: () => Promise<string | null>;
    };
  }
}

export default App;