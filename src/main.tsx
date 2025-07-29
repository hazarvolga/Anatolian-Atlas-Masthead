
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Main.tsx starting...');

const container = document.getElementById("root");
if (!container) {
  console.error('Failed to find the root element');
  throw new Error('Failed to find the root element');
}

console.log('Root container found, creating React root...');

try {
  const root = createRoot(container);
  console.log('React root created successfully');
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error during app initialization:', error);
  
  // Fallback error display
  container.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial, sans-serif;">
      <h1>Application Failed to Load</h1>
      <p>Error: ${error?.message || 'Unknown error occurred'}</p>
      <p>Please check the browser console for more details.</p>
    </div>
  `;
}
