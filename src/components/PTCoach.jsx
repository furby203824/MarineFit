import React, { useState, useEffect, useMemo } from 'react';
import { Activity, ExternalLink, Phone, Mail, Dumbbell, RefreshCw, Filter, PlayCircle, Printer, Clock, Target, Save, ThumbsUp, ThumbsDown, History, Trash2, CheckCircle, Search, BookOpen, X, Plus, GripVertical, ChevronDown, ChevronUp, Edit3, PlusCircle, FileText, FileSpreadsheet, File, Download } from 'lucide-react';
import { equipmentTags, goals, hittExercises, categories } from '../data/hittData';
import { generateWorkout } from '../utils/workoutGenerator';
import { exportToPDF, exportToExcel, exportToWord } from '../utils/workoutExport';
import { motion, AnimatePresence } from 'framer-motion';

const PTCoach = () => {
  const [workout, setWorkout] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator', 'history', 'library', or 'custom'
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false); // For export dropdown
  const [showCustomExportMenu, setShowCustomExportMenu] = useState(false); // For custom workout export

  // Custom Workout Builder State
  const [customWorkout, setCustomWorkout] = useState({
    title: 'Custom Workout',
    blocks: [{ id: Date.now(), name: 'BLOCK 1', exercises: [] }]
  });
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [customCategoryFilter, setCustomCategoryFilter] = useState('');
  const [activeBlockId, setActiveBlockId] = useState(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null); // { blockId, exerciseIndex }

  // Exercise Library filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  
  // Advanced Filters
  const [time, setTime] = useState('30');
  const [goal, setGoal] = useState(goals.STANDARD);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  
  // Available Equipment Options (excluding Bodyweight which is default)
  const equipOptions = Object.values(equipmentTags).filter(e => e !== 'Bodyweight');

  // Exercise Library - filtered exercises
  const filteredExercises = useMemo(() => {
    return hittExercises.filter(ex => {
      // Search by name
      if (searchQuery && !ex.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Filter by category
      if (categoryFilter && ex.category !== categoryFilter) {
        return false;
      }
      // Filter by equipment
      if (equipmentFilter && ex.equipment !== equipmentFilter) {
        return false;
      }
      // Filter by difficulty
      if (difficultyFilter && ex.difficulty !== parseInt(difficultyFilter)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, categoryFilter, equipmentFilter, difficultyFilter]);

  // Get unique values for filter dropdowns
  const allCategories = [...new Set(hittExercises.map(ex => ex.category))];
  const allEquipment = [...new Set(hittExercises.map(ex => ex.equipment))];
  const allDifficulties = [1, 2, 3];

  const clearLibraryFilters = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setEquipmentFilter('');
    setDifficultyFilter('');
  };

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

  const handleSwapExercise = (blockIndex, exerciseIndex) => {
    if (!workout) return;

    const block = workout.blocks[blockIndex];
    const currentExercise = block.exercises[exerciseIndex];

    // Get all exercise IDs currently in the workout to avoid duplicates
    const usedExerciseIds = workout.blocks.flatMap(b => b.exercises.map(ex => ex.id));

    // Find exercises in the same category that aren't already used
    const availableExercises = hittExercises.filter(ex => {
      // Must be same category
      if (ex.category !== currentExercise.category) return false;
      // Can't already be in the workout
      if (usedExerciseIds.includes(ex.id)) return false;
      // Must match equipment constraints (bodyweight always allowed)
      const isBodyweight = ex.equipment === 'Bodyweight';
      const equipmentAvailable = selectedEquipment.length === 0 ||
        selectedEquipment.includes(ex.equipment) ||
        isBodyweight;
      return equipmentAvailable;
    });

    if (availableExercises.length === 0) {
      alert("No alternative exercises available for this category with your current equipment selection.");
      return;
    }

    // Pick a random alternative
    const newExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];

    // Update the workout state
    const updatedWorkout = { ...workout };
    updatedWorkout.blocks = [...workout.blocks];
    updatedWorkout.blocks[blockIndex] = { ...block };
    updatedWorkout.blocks[blockIndex].exercises = [...block.exercises];
    updatedWorkout.blocks[blockIndex].exercises[exerciseIndex] = newExercise;

    setWorkout(updatedWorkout);
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

  // ===== CUSTOM WORKOUT BUILDER FUNCTIONS =====

  // Filtered exercises for custom workout picker
  const customFilteredExercises = useMemo(() => {
    return hittExercises.filter(ex => {
      if (customSearchQuery && !ex.name.toLowerCase().includes(customSearchQuery.toLowerCase())) {
        return false;
      }
      if (customCategoryFilter && ex.category !== customCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [customSearchQuery, customCategoryFilter]);

  const addBlock = () => {
    const newBlock = {
      id: Date.now(),
      name: `BLOCK ${customWorkout.blocks.length + 1}`,
      exercises: []
    };
    setCustomWorkout(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const removeBlock = (blockId) => {
    if (customWorkout.blocks.length === 1) {
      alert("You need at least one block in your workout.");
      return;
    }
    setCustomWorkout(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== blockId)
    }));
  };

  const updateBlockName = (blockId, newName) => {
    setCustomWorkout(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId ? { ...b, name: newName } : b
      )
    }));
  };

  const openExercisePicker = (blockId) => {
    setActiveBlockId(blockId);
    setShowExercisePicker(true);
    setCustomSearchQuery('');
    setCustomCategoryFilter('');
  };

  const addExerciseToBlock = (exercise) => {
    if (!activeBlockId) return;

    const exerciseWithPrescription = {
      ...exercise,
      uniqueId: `${exercise.id}-${Date.now()}`,
      prescription: {
        sets: 3,
        reps: '10',
        rest: '60s',
        notes: ''
      }
    };

    setCustomWorkout(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === activeBlockId
          ? { ...b, exercises: [...b.exercises, exerciseWithPrescription] }
          : b
      )
    }));
    setShowExercisePicker(false);
  };

  const removeExerciseFromBlock = (blockId, exerciseIndex) => {
    setCustomWorkout(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId
          ? { ...b, exercises: b.exercises.filter((_, i) => i !== exerciseIndex) }
          : b
      )
    }));
  };

  const updateExercisePrescription = (blockId, exerciseIndex, field, value) => {
    setCustomWorkout(prev => ({
      ...prev,
      blocks: prev.blocks.map(b =>
        b.id === blockId
          ? {
              ...b,
              exercises: b.exercises.map((ex, i) =>
                i === exerciseIndex
                  ? { ...ex, prescription: { ...ex.prescription, [field]: value } }
                  : ex
              )
            }
          : b
      )
    }));
  };

  const moveExercise = (blockId, exerciseIndex, direction) => {
    setCustomWorkout(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => {
        if (b.id !== blockId) return b;
        const newExercises = [...b.exercises];
        const newIndex = exerciseIndex + direction;
        if (newIndex < 0 || newIndex >= newExercises.length) return b;
        [newExercises[exerciseIndex], newExercises[newIndex]] = [newExercises[newIndex], newExercises[exerciseIndex]];
        return { ...b, exercises: newExercises };
      })
    }));
  };

  const saveCustomWorkout = () => {
    const totalExercises = customWorkout.blocks.reduce((sum, b) => sum + b.exercises.length, 0);
    if (totalExercises === 0) {
      alert("Add at least one exercise to your workout before saving.");
      return;
    }

    const workoutToSave = {
      id: Date.now(),
      title: customWorkout.title,
      date: new Date().toISOString(),
      blocks: customWorkout.blocks,
      isCustom: true
    };

    const newHistory = [workoutToSave, ...savedWorkouts];
    setSavedWorkouts(newHistory);
    localStorage.setItem('marine_fitness_history', JSON.stringify(newHistory));
    alert("Custom workout saved to History Log!");
  };

  const resetCustomWorkout = () => {
    if (window.confirm("Are you sure you want to clear this workout and start fresh?")) {
      setCustomWorkout({
        title: 'Custom Workout',
        blocks: [{ id: Date.now(), name: 'BLOCK 1', exercises: [] }]
      });
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
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
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex-wrap">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'generator' ? 'bg-white dark:bg-gray-600 text-marine-red shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <RefreshCw size={16} /> <span className="hidden sm:inline">Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'custom' ? 'bg-white dark:bg-gray-600 text-marine-red shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <PlusCircle size={16} /> <span className="hidden sm:inline">Create Custom</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'library' ? 'bg-white dark:bg-gray-600 text-marine-red shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <BookOpen size={16} /> <span className="hidden sm:inline">Library</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white dark:bg-gray-600 text-marine-red shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <History size={16} /> <span className="hidden sm:inline">History</span>
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
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                      <Clock size={16} /> Duration
                    </label>
                    <div className="flex gap-2">
                      {['30', '60'].map(val => (
                        <button
                          key={val}
                          onClick={() => setTime(val)}
                          className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                            time === val ? 'bg-marine-red text-white shadow-sm' : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 border border-gray-200 dark:border-gray-500'
                          }`}
                        >
                          {val} Min
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal Selection */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                      <Target size={16} /> Training Goal
                    </label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-gray-100 focus:ring-marine-red focus:border-marine-red"
                    >
                      {Object.values(goals).map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Equipment Selection */}
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
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
                            : 'bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-500 hover:border-gray-300 dark:hover:border-gray-400'
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
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-600 pb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {workout.title}
                      </h3>
                      <div className="flex gap-2 items-center">
                        <button onClick={saveWorkout} className="p-2 text-gray-500 hover:text-marine-red transition-colors" title="Save Workout">
                          <Save size={18} />
                        </button>
                        <button onClick={() => window.print()} className="p-2 text-gray-500 hover:text-marine-red transition-colors" title="Print Card">
                          <Printer size={18} />
                        </button>
                        {/* Export Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="p-2 text-gray-500 hover:text-marine-red transition-colors flex items-center gap-1"
                            title="Export Workout"
                          >
                            <Download size={18} />
                          </button>
                          {showExportMenu && (
                            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-50 min-w-[140px]">
                              <button
                                onClick={() => { exportToPDF(workout); setShowExportMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <FileText size={16} className="text-red-600" /> PDF
                              </button>
                              <button
                                onClick={() => { exportToExcel(workout); setShowExportMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <FileSpreadsheet size={16} className="text-green-600" /> Excel
                              </button>
                              <button
                                onClick={() => { exportToWord(workout); setShowExportMenu(false); }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <File size={16} className="text-blue-600" /> Word
                              </button>
                            </div>
                          )}
                        </div>
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
                              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600 hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-gray-900">{ex.name}</span>
                                    <span className="text-xs bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500 text-gray-500">
                                      {ex.equipment}
                                    </span>
                                  </div>
                                  {/* Prescription Display */}
                                  {ex.prescription && (
                                    <div className="flex items-center gap-3 mt-2 text-sm">
                                      <span className="bg-marine-red/10 text-marine-red px-2 py-0.5 rounded font-medium">
                                        {ex.prescription.sets} x {ex.prescription.reps}
                                      </span>
                                      {ex.prescription.rest !== '0s' && (
                                        <span className="text-gray-500">
                                          Rest: {ex.prescription.rest}
                                        </span>
                                      )}
                                      {ex.prescription.notes && (
                                        <span className="text-gray-400 italic text-xs hidden sm:inline">
                                          {ex.prescription.notes}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 ml-2">
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
                          className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center"
                        >
                          <p className="font-semibold text-gray-900 mb-3">How was the mission?</p>
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleFeedback('good')}
                              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:border-marine-red hover:text-marine-red transition-all"
                            >
                              <ThumbsUp size={18} /> Good to Go
                            </button>
                            <button
                              onClick={() => handleFeedback('hard')}
                              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg hover:border-red-500 hover:text-red-500 transition-all"
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
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                    <Dumbbell className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Configure parameters to generate your mission card.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : activeTab === 'library' ? (
            // EXERCISE LIBRARY TAB
            <div className="space-y-4">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 m-0 flex items-center gap-2">
                    <BookOpen className="text-marine-red" /> Exercise Library
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredExercises.length} of {hittExercises.length} exercises
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search exercises by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-marine-red focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-gray-100 focus:ring-marine-red focus:border-marine-red"
                  >
                    <option value="">All Categories</option>
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                  <select
                    value={equipmentFilter}
                    onChange={(e) => setEquipmentFilter(e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-gray-100 focus:ring-marine-red focus:border-marine-red"
                  >
                    <option value="">All Equipment</option>
                    {allEquipment.map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>

                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md py-2 px-3 text-sm text-gray-900 dark:text-gray-100 focus:ring-marine-red focus:border-marine-red"
                  >
                    <option value="">All Difficulties</option>
                    {allDifficulties.map(d => (
                      <option key={d} value={d}>Level {d} {d === 1 ? '(Easy)' : d === 2 ? '(Medium)' : '(Hard)'}</option>
                    ))}
                  </select>
                </div>

                {(searchQuery || categoryFilter || equipmentFilter || difficultyFilter) && (
                  <button
                    onClick={clearLibraryFilters}
                    className="text-sm text-marine-red hover:underline mb-4"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {/* Exercise Grid */}
              {filteredExercises.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                  <Search className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No exercises match your filters.</p>
                  <button
                    onClick={clearLibraryFilters}
                    className="mt-2 text-sm text-marine-red hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredExercises.map((ex) => (
                    <motion.div
                      key={ex.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-semibold text-gray-900">{ex.name}</span>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                              {ex.equipment}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              ex.difficulty === 1 ? 'bg-green-100 text-green-700' :
                              ex.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              Lvl {ex.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{ex.category}</p>
                          {ex.tags && ex.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {ex.tags.map((tag, i) => (
                                <span key={i} className="text-xs bg-marine-red/10 text-marine-red px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {ex.url && (
                          <a
                            href={ex.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 bg-marine-red text-white text-sm rounded-lg hover:bg-marine-red/90 transition-colors ml-3"
                          >
                            <PlayCircle size={16} /> Watch
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'custom' ? (
            // CUSTOM WORKOUT BUILDER TAB
            <div className="space-y-4">
              <div className="card border-t-4 border-t-marine-gold">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h2 className="text-xl font-bold text-gray-900 m-0 flex items-center gap-2">
                    <PlusCircle className="text-marine-red" /> Custom Workout Builder
                  </h2>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={resetCustomWorkout}
                      className="px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={saveCustomWorkout}
                      className="btn flex items-center gap-2 text-sm"
                    >
                      <Save size={16} /> Save
                    </button>
                    {/* Export Dropdown for Custom Workout */}
                    <div className="relative">
                      <button
                        onClick={() => setShowCustomExportMenu(!showCustomExportMenu)}
                        className="btn flex items-center gap-2 text-sm"
                        title="Export Workout"
                      >
                        <Download size={16} /> Export
                      </button>
                      {showCustomExportMenu && (
                        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-50 min-w-[140px]">
                          <button
                            onClick={() => {
                              const workoutToExport = { ...customWorkout, date: new Date().toISOString() };
                              exportToPDF(workoutToExport);
                              setShowCustomExportMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <FileText size={16} className="text-red-600" /> PDF
                          </button>
                          <button
                            onClick={() => {
                              const workoutToExport = { ...customWorkout, date: new Date().toISOString() };
                              exportToExcel(workoutToExport);
                              setShowCustomExportMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <FileSpreadsheet size={16} className="text-green-600" /> Excel
                          </button>
                          <button
                            onClick={() => {
                              const workoutToExport = { ...customWorkout, date: new Date().toISOString() };
                              exportToWord(workoutToExport);
                              setShowCustomExportMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <File size={16} className="text-blue-600" /> Word
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Workout Title */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Workout Title
                  </label>
                  <input
                    type="text"
                    value={customWorkout.title}
                    onChange={(e) => setCustomWorkout(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-marine-red focus:border-transparent"
                    placeholder="e.g., Monday Upper Body"
                  />
                </div>

                {/* Blocks */}
                <div className="space-y-4">
                  {customWorkout.blocks.map((block, blockIndex) => (
                    <div key={block.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      {/* Block Header */}
                      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between">
                        <input
                          type="text"
                          value={block.name}
                          onChange={(e) => updateBlockName(block.id, e.target.value)}
                          className="font-bold text-sm uppercase tracking-wider text-marine-red bg-transparent border-none focus:outline-none focus:ring-0 w-40"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openExercisePicker(block.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-marine-red text-white rounded-md hover:bg-marine-red/90 transition-colors"
                          >
                            <Plus size={14} /> Add Exercise
                          </button>
                          <button
                            onClick={() => removeBlock(block.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            title="Remove Block"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Block Exercises */}
                      <div className="p-4">
                        {block.exercises.length === 0 ? (
                          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                            <Dumbbell className="mx-auto h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">No exercises yet. Click "Add Exercise" to get started.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {block.exercises.map((ex, exIndex) => (
                              <div
                                key={ex.uniqueId}
                                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                      <button
                                        onClick={() => moveExercise(block.id, exIndex, -1)}
                                        disabled={exIndex === 0}
                                        className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <ChevronUp size={14} />
                                      </button>
                                      <button
                                        onClick={() => moveExercise(block.id, exIndex, 1)}
                                        disabled={exIndex === block.exercises.length - 1}
                                        className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        <ChevronDown size={14} />
                                      </button>
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-gray-900">{ex.name}</span>
                                        <span className="text-xs bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500 text-gray-500">
                                          {ex.equipment}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-500 mt-0.5">{ex.category}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => removeExerciseFromBlock(block.id, exIndex)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                {/* Prescription Controls */}
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">Sets</label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={ex.prescription.sets}
                                        onChange={(e) => updateExercisePrescription(block.id, exIndex, 'sets', parseInt(e.target.value) || 1)}
                                        className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">Reps</label>
                                      <input
                                        type="text"
                                        value={ex.prescription.reps}
                                        onChange={(e) => updateExercisePrescription(block.id, exIndex, 'reps', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., 10 or 30s"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-500 mb-1">Rest</label>
                                      <input
                                        type="text"
                                        value={ex.prescription.rest}
                                        onChange={(e) => updateExercisePrescription(block.id, exIndex, 'rest', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., 60s"
                                      />
                                    </div>
                                    <div className="col-span-3 sm:col-span-1">
                                      <label className="block text-xs text-gray-500 mb-1">Notes</label>
                                      <input
                                        type="text"
                                        value={ex.prescription.notes}
                                        onChange={(e) => updateExercisePrescription(block.id, exIndex, 'notes', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-500 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                                        placeholder="Optional"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Block Button */}
                  <button
                    onClick={addBlock}
                    className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-marine-red hover:text-marine-red transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add Another Block
                  </button>
                </div>
              </div>

              {/* Exercise Picker Modal */}
              <AnimatePresence>
                {showExercisePicker && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowExercisePicker(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Exercise</h3>
                          <button
                            onClick={() => setShowExercisePicker(false)}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                              type="text"
                              placeholder="Search exercises..."
                              value={customSearchQuery}
                              onChange={(e) => setCustomSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                            />
                          </div>
                          <select
                            value={customCategoryFilter}
                            onChange={(e) => setCustomCategoryFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          >
                            <option value="">All Categories</option>
                            {allCategories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Exercise List */}
                      <div className="flex-1 overflow-y-auto p-4">
                        <div className="grid gap-2">
                          {customFilteredExercises.map((ex) => (
                            <button
                              key={ex.id}
                              onClick={() => addExerciseToBlock(ex)}
                              className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-transparent hover:border-marine-red"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">{ex.name}</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">{ex.category}</span>
                                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                      {ex.equipment}
                                    </span>
                                  </div>
                                </div>
                                <Plus size={18} className="text-marine-red" />
                              </div>
                            </button>
                          ))}
                        </div>
                        {customFilteredExercises.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            No exercises found matching your search.
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : activeTab === 'history' ? (
            // HISTORY TAB
            <div className="space-y-4">
              {savedWorkouts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                  <History className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">No saved missions yet.</p>
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
          ) : null}
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
