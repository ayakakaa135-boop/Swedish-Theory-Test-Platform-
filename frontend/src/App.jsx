import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SectionsPage from './pages/SectionsPage';
import SectionDetailsPage from './pages/SectionDetailsPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import { TestProvider } from './contexts/TestContext';
import './index.css';
// App.jsx
function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <TestProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sections" element={<SectionsPage />} />
          <Route path="/test/:type" element={<TestPage />} />
          <Route path="/test/:type/:sectionId" element={<TestPage />} />
          <Route path="/section/:sectionId" element={<SectionDetailsPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </TestProvider>
    </Router>
  );
}


export default App;

