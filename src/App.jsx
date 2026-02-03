import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
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
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pt-coach" element={<PTCoach />} />
                <Route path="/exercises" element={<ExerciseLibrary />} />
                <Route path="/pft-prep" element={<PFTPrep />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/injury-prevention" element={<InjuryPrevention />} />
                <Route path="/sleep" element={<SleepOptimizer />} />
                <Route path="/body-comp" element={<BodyComp />} />
              </Routes>
              <Footer />
            </div>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
