import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.tsx';
import {lazy, Suspense} from 'react';
import './index.css';

const AnalyzePage = lazy(() => import('./AnalyzePage.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/analyze" element={
          <Suspense fallback={<div className="min-h-screen bg-[#030712]" />}>
            <AnalyzePage />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
