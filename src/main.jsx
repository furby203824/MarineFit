import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Unregister any previously installed service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
}

// INP (Interaction to Next Paint) monitoring — P75
if (typeof PerformanceObserver !== 'undefined') {
  let maxINP = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.interactionId) {
        const duration = entry.duration;
        if (duration > maxINP) {
          maxINP = duration;
          if (navigator.sendBeacon) {
            navigator.sendBeacon(
              '/api/vitals',
              JSON.stringify({
                metric: 'INP',
                value: maxINP,
                rating: maxINP <= 200 ? 'good' : maxINP <= 500 ? 'needs-improvement' : 'poor',
                timestamp: Date.now(),
              })
            );
          }
        }
      }
    }
  });
  try {
    observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
  } catch (e) {
    // Event Timing API not supported in this browser
  }
}
