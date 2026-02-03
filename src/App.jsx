import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import PTCoach from './components/PTCoach';
import ExerciseLibrary from './components/ExerciseLibrary';
import PFTPrep from './components/PFTPrep';
import Nutrition from './components/Nutrition';
import InjuryPrevention from './components/InjuryPrevention';
import SleepOptimizer from './components/SleepOptimizer';
import BodyComp from './components/BodyComp';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navigation />
          <main className="flex-1 md:ml-[240px] p-4 md:p-8 pt-20 md:pt-8 transition-all duration-300">
            <div className="max-w-7xl mx-auto">
              <ErrorBoundary>
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
