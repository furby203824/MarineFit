import React, { useState, useEffect } from 'react';
import { Activity, ExternalLink, Phone, Mail, Dumbbell, RefreshCw, Filter, PlayCircle, Printer, Clock, Target, Save, ThumbsUp, ThumbsDown, History, Trash2, CheckCircle } from 'lucide-react';
import { equipmentTags, goals, hittExercises } from '../data/hittData';
import { generateWorkout } from '../utils/workoutGenerator';
import { motion, AnimatePresence } from 'framer-motion';

const PTCoach = () => {
  const [workout, setWorkout] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' or 'history'
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  
  // Advanced Filters
  const [time, setTime] = useState('30');
  const [goal, setGoal] = useState(goals.STANDARD);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  
  // Available Equipment Options (excluding Bodyweight which is default)
  const equipOptions = Object.values(equipmentTags).filter(e => e !== 'Bodyweight');

  // Load history on mount
  useEffect(() => {
    const history = localStorage.getItem('marine_fitness_history');
    if (history) {
      setSavedWorkouts(JSON.parse(history));
    }
  }, []);

  const handleEquipmentToggle = (item) => {
    setSelectedEquipment(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleGenerate = () => {
    // Get user profile for difficulty modifier
    const userProfile = JSON.parse(localStorage.getItem('marine_user_profile') || '{}');
    const difficultyModifier = userProfile.difficultyModifier || 0;

    const newWorkout = generateWorkout({
      time,
      goal,
      equipment: selectedEquipment,
      difficultyModifier
    });
    setWorkout(newWorkout);
    setShowFeedback(false);
    setActiveTab('generator');
  };

  const saveWorkout = () => {
    if (!workout) return;
    
    const newHistory = [workout, ...savedWorkouts];
    setSavedWorkouts(newHistory);
    localStorage.setItem('marine_fitness_history', JSON.stringify(newHistory));
    
    // Visual feedback could be added here
    alert("Mission saved to History Log.");
  };

  const deleteWorkout = (id) => {
    const newHistory = savedWorkouts.filter(w => w.id !== id);
    setSavedWorkouts(newHistory);
    localStorage.setItem('marine_fitness_history', JSON.stringify(newHistory));
  };

  const handleFeedback = (rating) => { // rating: 'good' | 'hard'
    // 1. Update the current workout with feedback
    const feedbackData = {
      rating,
      timestamp: new Date().toISOString(),
      notes: rating === 'hard' ? 'User requested regression for next session.' : 'Standard progression.'
    };

    // If workout is saved, update it in history
    if (workout) {
      const updatedWorkout = { ...workout, feedback: feedbackData };
      setWorkout(updatedWorkout);
      
      // Update in history if it exists there
      const historyIndex = savedWorkouts.findIndex(w => w.id === workout.id);
      if (historyIndex >= 0) {
        const newHistory = [...savedWorkouts];
        newHistory[historyIndex] = updatedWorkout;
        setSavedWorkouts(newHistory);
        localStorage.setItem('marine_fitness_history', JSON.stringify(newHistory));
      } else {
        // If not saved yet, save it now with feedback
        const newHistory = [updatedWorkout, ...savedWorkouts];
        setSavedWorkouts(newHistory);
        localStorage.setItem('marine_fitness_history', JSON.stringify(newHistory));
      }
    }

    // 2. Update User Profile (Semper Admin Feedback Loop)
    const userProfile = JSON.parse(localStorage.getItem('marine_user_profile') || '{}');
    if (rating === 'hard') {
      userProfile.difficultyModifier = (userProfile.difficultyModifier || 0) - 1;
    } else {
      userProfile.difficultyModifier = (userProfile.difficultyModifier || 0) + 1; // Progressive Overload
    }
    localStorage.setItem('marine_user_profile', JSON.stringify(userProfile));

    setShowFeedback(false);
    alert("AAR Submitted. Training variables updated for next cycle.");
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-marine-red/10 rounded-xl">
            <Activity className="w-8 h-8 text-marine-red" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 m-0">PT Coach & HITT</h1>
            <p className="text-gray-500 mt-1">High Intensity Tactical Training Program</p>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'generator' ? 'bg-white text-marine-red shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <RefreshCw size={16} /> Generator
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white text-marine-red shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <History size={16} /> History Log
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Takes up 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'generator' ? (
            <div className="card border-t-4 border-t-marine-gold">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 m-0 flex items-center gap-2 mb-4">
                  <Dumbbell className="text-marine-red" /> Dynamic Workout Generator
                </h2>
                
                {/* Controls Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Time Selection */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Clock size={16} /> Duration
                    </label>
                    <div className="flex gap-2">
                      {['30', '60'].map(val => (
                        <button
                          key={val}
                          onClick={() => setTime(val)}
                          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                            time === val ? 'bg-marine-red text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'
                          }`}
                        >
                          {val} Min
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal Selection */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Target size={16} /> Training Goal
                    </label>
                    <select 
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm focus:ring-marine-red focus:border-marine-red"
                    >
                      {Object.values(goals).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Equipment Selection */}
                <div className="bg-gray-50 p-3 rounded-lg mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Filter size={16} /> Available Equipment
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {equipOptions.map(eq => (
                      <button
                        key={eq}
                        onClick={() => handleEquipmentToggle(eq)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                          selectedEquipment.includes(eq)
                            ? 'bg-marine-red text-white border-marine-red'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {eq}
                      </button>
                    ))}
                  </div>
                </div>

                <button className="btn w-full flex items-center justify-center gap-2 py-3" onClick={handleGenerate}>
                  <RefreshCw size={20} />
                  Generate Mission Card
                </button>
              </div>

              <AnimatePresence mode="wait">
                {workout ? (
                  <motion.div 
                    key={workout.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {workout.title}
                      </h3>
                      <div className="flex gap-2">
                        <button onClick={saveWorkout} className="p-2 text-gray-500 hover:text-marine-red transition-colors" title="Save Workout">
                          <Save size={18} />
                        </button>
                        <button onClick={() => window.print()} className="p-2 text-gray-500 hover:text-marine-red transition-colors" title="Print Card">
                          <Printer size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {workout.blocks.map((block, bIdx) => (
                      <div key={bIdx} className="space-y-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-marine-red border-l-4 border-marine-red pl-3">
                          {block.name}
                        </h4>
                        <div className="grid gap-3">
                          {block.exercises.map((ex, idx) => (
                            <motion.div 
                              key={ex.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-gray-900">{ex.name}</span>
                                  <span className="text-xs bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-500">
                                    {ex.equipment}
                                  </span>
                                </div>
                                <div className="flex gap-2 mt-1">
                                  {ex.tags.map(tag => (
                                    <span key={tag} className="text-[10px] text-gray-400 bg-gray-100 px-1.5 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleSwapExercise(bIdx, idx)}
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                  title="Swap Exercise"
                                >
                                  <RefreshCw size={18} />
                                </button>
                                {ex.url && (
                                  <a 
                                    href={ex.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="p-2 text-gray-400 hover:text-marine-red hover:bg-white rounded-full transition-colors"
                                    title="Watch Demo"
                                  >
                                    <PlayCircle size={20} />
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Feedback Loop */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      {!showFeedback && !workout.feedback ? (
                        <button 
                          onClick={() => setShowFeedback(true)}
                          className="w-full py-2 text-sm text-gray-500 hover:text-marine-red transition-colors underline"
                        >
                          Complete Workout & Provide Feedback
                        </button>
                      ) : workout.feedback ? (
                         <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
                            <p className="flex items-center justify-center gap-2 font-semibold text-green-800">
                              <CheckCircle size={18} /> AAR Submitted
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              Rating: {workout.feedback.rating === 'good' ? 'Good to Go' : 'Too Hard'}
                            </p>
                         </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-gray-50 p-4 rounded-lg text-center"
                        >
                          <p className="font-semibold text-gray-900 mb-3">How was the mission?</p>
                          <div className="flex justify-center gap-4">
                            <button 
                              onClick={() => handleFeedback('good')}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-marine-red hover:text-marine-red transition-all"
                            >
                              <ThumbsUp size={18} /> Good to Go
                            </button>
                            <button 
                              onClick={() => handleFeedback('hard')}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
                            >
                              <ThumbsDown size={18} /> Too Hard
                            </button>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">Feedback helps optimize your future cards.</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Dumbbell className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">Configure parameters to generate your mission card.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // HISTORY TAB
            <div className="space-y-4">
              {savedWorkouts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <History className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No saved missions yet.</p>
                </div>
              ) : (
                savedWorkouts.map((w) => (
                  <div key={w.id} className="card flex items-center justify-between hover:shadow-md transition-all">
                    <div>
                      <h3 className="font-bold text-gray-900">{w.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(w.date).toLocaleDateString()} at {new Date(w.date).toLocaleTimeString()}
                      </p>
                      {w.feedback && (
                         <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full ${w.feedback.rating === 'good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           AAR: {w.feedback.rating === 'good' ? 'Good' : 'Hard'}
                         </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => { setWorkout(w); setActiveTab('generator'); }}
                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                         title="Load Workout"
                       >
                         <RefreshCw size={18} />
                       </button>
                       <button 
                         onClick={() => deleteWorkout(w.id)}
                         className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                         title="Delete"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info - Takes up 1 column */}
        <div className="space-y-6">
          <div className="card bg-marine-red text-white">
            <h2 className="text-white text-xl font-bold mb-4">HITT Methodology</h2>
            <p className="text-red-100 mb-4 leading-relaxed">
              Semper Fit’s HITT is a comprehensive, combat-focused Strength and Conditioning program specifically for Marines.
              Aiming to make Marines <strong>COMBAT FIT. COMBAT READY.</strong>
            </p>
            <div className="space-y-3 mt-6">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <h3 className="text-marine-gold text-sm font-bold uppercase mb-1">For FFIs</h3>
                <p className="text-xs text-red-50">Consult your installation HITT Coordinator for programming help.</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <h3 className="text-marine-gold text-sm font-bold uppercase mb-1">For Commanders</h3>
                <p className="text-xs text-red-50">Ask about unit support and dedicated strength professionals.</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
              <ExternalLink size={20} className="text-marine-red" /> 
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="https://www.usmc-mccs.org/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-marine-red transition-colors p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <ExternalLink size={14} />
                  </div>
                  <span className="font-medium">Local MCCS Website</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-600 p-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <Phone size={14} />
                  </div>
                  <span className="font-medium">703-432-0732</span>
                </div>
              </li>
              <li>
                <a href="mailto:Lynda.Rummel@usmc-mccs.org" className="flex items-center gap-3 text-gray-600 hover:text-marine-red transition-colors p-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                    <Mail size={14} />
                  </div>
                  <span className="font-medium text-sm truncate">Lynda.Rummel@usmc-mccs.org</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PTCoach;
