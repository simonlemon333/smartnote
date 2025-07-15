import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Starting React app...');

function initApp() {
    const container = document.getElementById('root');
    if (!container) {
        console.error('Root container not found!');
    } else {
        console.log('Root container found, creating React root...');
        const root = createRoot(container);
        root.render(<App />);
        console.log('React app rendered!');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}