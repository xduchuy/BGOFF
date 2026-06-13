import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register service worker for offline capability (Vite PWA)
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // Service worker update available
    if (confirm('Ứng dụng BGOff có bản cập nhật mới. Tải lại trang để áp dụng?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('BGOff đã sẵn sàng hoạt động ngoại tuyến (offline ready).');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
