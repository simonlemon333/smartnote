import React, { useState } from 'react';
// import VideoDropZone from './components/VideoDropZone';
// import ProcessingStatus from './components/ProcessingStatus';
// import NotesOutput from './components/NotesOutput';
import './App.css';

const App: React.FC = () => {
  console.log('App component rendering...');

  return (
    <div className="app" style={{minHeight: '100vh', padding: '20px', background: '#f0f0f0'}}>
      <header className="app-header">
        <h1 style={{color: '#333'}}>Smart Note - TEST</h1>
        <p style={{color: '#666'}}>Transform your videos into structured notes</p>
      </header>
      
      <main className="app-main">
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', margin: '20px 0'}}>
          <h2>Frontend is working!</h2>
          <p>If you can see this, React is rendering correctly.</p>
        </div>
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