import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

<<<<<<< HEAD
if (typeof window.global === 'undefined') {
  window.global = window;
}

=======
>>>>>>> 9d013e9f83b7fbdc497e41665e5ee3cf6c57851b
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
