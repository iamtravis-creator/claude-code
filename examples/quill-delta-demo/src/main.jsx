import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import QuillDeltaDemo from '../QuillDeltaDemo.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuillDeltaDemo />
  </StrictMode>
);
