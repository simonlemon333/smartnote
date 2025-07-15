import React, { useState } from 'react';
import VideoDropZone from './components/VideoDropZone';
import TranscriptInput from './components/TranscriptInput';
import ProcessingStatus from './components/ProcessingStatus';
import NotesOutput from './components/NotesOutput';
import './App.css';

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedNotes, setProcessedNotes] = useState('');
  const [transcription, setTranscription] = useState('');
  const [timestampedSegments, setTimestampedSegments] = useState<any[]>([]);
  const [processingStatus, setProcessingStatus] = useState('');

  const handleVideoProcess = async (videoFile: File) => {
    setIsProcessing(true);
    setProcessingStatus('Uploading video...');
    
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      
      setProcessingStatus('Processing video (this may take a few minutes)...');
      
      const response = await fetch('http://localhost:5000/process-video', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setProcessedNotes(result.formatted_notes);
      setTranscription(result.transcription);
      setTimestampedSegments(result.timestamped_segments || []);
      setProcessingStatus('Complete!');
    } catch (error) {
      console.error('Error processing video:', error);
      setProcessingStatus('Error processing video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranscriptProcess = async (transcript: string) => {
    setIsProcessing(true);
    setProcessingStatus('Processing transcript...');
    
    try {
      const response = await fetch('http://localhost:5000/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setProcessedNotes(result.formatted_notes);
      setTranscription(result.transcription);
      setTimestampedSegments([]); // No timestamps for direct transcript
      setProcessingStatus('Complete!');
    } catch (error) {
      console.error('Error processing transcript:', error);
      setProcessingStatus('Error processing transcript. Please try again.');
    } finally {
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
        <VideoDropZone onFileUpload={handleVideoProcess} disabled={isProcessing} />
        <TranscriptInput onTranscriptSubmit={handleTranscriptProcess} disabled={isProcessing} />
        <ProcessingStatus 
          isProcessing={isProcessing} 
          status={processingStatus} 
        />
        <NotesOutput 
          notes={processedNotes} 
          transcription={transcription} 
          timestamped_segments={timestampedSegments}
        />
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