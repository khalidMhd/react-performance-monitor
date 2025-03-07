import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { PerformanceMonitorProvider } from './lib/PerformanceMonitor';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <PerformanceMonitorProvider config={{ 
      enabled: true,
      warningThresholds: {
        renderTime: 1000,
        unnecessaryRenders: 5
      }
    }}>
      <App />
    </PerformanceMonitorProvider>
  </React.StrictMode>
);
