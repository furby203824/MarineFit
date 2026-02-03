import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

// Lazy-load route components for smaller initial bundle
const PTCoach = lazy(() => import('./components/PTCoach'));
const ExerciseLibrary = lazy(() => import('./components/ExerciseLibrary'));
const PFTPrep = lazy(() => import('./components/PFTPrep'));
const Nutrition = lazy(() => import('./components/Nutrition'));
const InjuryPrevention = lazy(() => import('./components/InjuryPrevention'));
const SleepOptimizer = lazy(() => import('./components/SleepOptimizer'));
const BodyComp = lazy(() => import('./components/BodyComp'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[40vh]">
    <div className="text-center">
      <div className="w-10 h-10 border-4 border-marine-red border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navigation />
          <main id="main-content" className="flex-1 md:ml-[240px] p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/pt-coach" element={<ErrorBoundary><PTCoach /></ErrorBoundary>} />
                    <Route path="/exercises" element={<ErrorBoundary><ExerciseLibrary /></ErrorBoundary>} />
                    <Route path="/pft-prep" element={<ErrorBoundary><PFTPrep /></ErrorBoundary>} />
                    <Route path="/nutrition" element={<ErrorBoundary><Nutrition /></ErrorBoundary>} />
                    <Route path="/injury-prevention" element={<ErrorBoundary><InjuryPrevention /></ErrorBoundary>} />
                    <Route path="/sleep" element={<ErrorBoundary><SleepOptimizer /></ErrorBoundary>} />
                    <Route path="/body-comp" element={<ErrorBoundary><BodyComp /></ErrorBoundary>} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
              <Footer />
            </div>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
