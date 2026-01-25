import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './components/Dashboard';
import './main.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
