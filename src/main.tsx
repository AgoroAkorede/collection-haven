import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress MetaMask connection errors caused by browser extensions in the iframe
const suppressMetaMaskError = (msg: any) => {
  if (typeof msg === 'string' && (msg.includes('MetaMask') || msg.includes('Failed to connect to MetaMask'))) return true;
  if (msg && typeof msg === 'object' && msg.message && (msg.message.includes('MetaMask') || msg.message.includes('Failed to connect to MetaMask'))) return true;
  return false;
};

const originalConsoleError = console.error;
console.error = (...args) => {
  if (suppressMetaMaskError(args[0])) return;
  originalConsoleError(...args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (suppressMetaMaskError(args[0])) return;
  originalConsoleWarn(...args);
};

window.addEventListener('error', (e) => {
  if (suppressMetaMaskError(e.message)) {
    e.preventDefault();
    e.stopPropagation();
  }
});

window.addEventListener('unhandledrejection', (e) => {
  if (suppressMetaMaskError(e.reason)) {
    e.preventDefault();
    e.stopPropagation();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
