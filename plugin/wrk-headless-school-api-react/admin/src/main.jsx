import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const el = document.getElementById('wrk-hsa-admin-root');
if (el) {
  createRoot(el).render(React.createElement(App));
}
