import React, { useState, useMemo, useEffect } from 'react';
import PullupProgram from './PullupProgram';
import {
    calculatePFTScore,
    calculateCFTScore,
    getAgeGroup,
    getRequiredRunTime,
    getRequiredUpperBodyReps,
    getRequiredPlankTime,
    getRequiredMTC,
    getRequiredAmmoLifts,
    getRequiredMANUF
} from '../utils/pftScoring';
import { returnToRunData } from '../data/rehabData';
import { hittExercises } from '../data/hittData';
import { Calculator, Activity, Trophy, AlertCircle, Target, Calendar, ChevronDown, ChevronUp, CheckCircle2, Dumbbell, PlayCircle, TrendingUp, FileText, ChevronLeft, ChevronRight, Shield, Thermometer, HeartPulse, Footprints, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Exercise recommendations based on weak PFT/CFT events
const exerciseRecommendations = {
    pft: {
        upper: {
            pullups: {
                title: "Pull-up Improvement",
                focus: "Upper body pulling strength and grip endurance",
                tags: ['Upper Pull', 'Back', 'Lats'],
                exercises: ['Pull-up', 'Row', 'Dead Hang', 'Negative'],
                tips: [
                    "Practice pull-up negatives (slow lowering) to build strength",
                    "Grease the groove: do submaximal sets throughout the day",
                    "Focus on grip strength with dead hangs"
                ]
            },
            pushups: {
                title: "Push-up Improvement",
                focus: "Upper body pushing endurance and core stability",
                tags: ['Upper Push', 'Chest', 'Triceps'],
                exercises: ['Push-up', 'Press', 'Dip', 'Plank'],
                tips: [
                    "Practice push-up pyramids: 1-2-3-4-5-4-3-2-1",
                    "Focus on core engagement during the movement",
                    "Build tricep endurance with close-grip variations"
                ]
            }
        },
        plank: {
            title: "Plank Improvement",
            focus: "Core endurance and anti-extension strength",
            tags: ['Core', 'Abs', 'Stability'],
            exercises: ['Plank', 'Side Plank', 'Dead Bug', 'Bird Dog', 'Hollow Body Hold', 'Rollout'],
            tips: [
                "Practice daily planks, gradually increasing duration",
                "Focus on proper form: straight line from head to heels",
                "Breathe steadily - don't hold your breath"
            ]
        },
        run: {
            title: "3-Mile Run Improvement",
            focus: "Aerobic capacity and running economy",
            tags: ['Cardio', 'Legs', 'Plyometric'],
            exercises: ['High Knees', 'Butt Kicks', 'A-Skip', 'B-Skip', 'Bounding', 'Sprint', 'Lunge'],
            tips: [
                "Mix long slow runs with interval training",
                "Include tempo runs at goal pace",
                "Don't neglect recovery between hard sessions"
            ]
        }
    },
    cft: {
        mtc: {
            title: "Movement to Contact Improvement",
            focus: "Sprint speed and anaerobic capacity",
            tags: ['Cardio', 'Speed', 'Agility'],
            exercises: ['Sprint', 'High Knees', 'A-Skip', 'Bounding', 'Shuttle Run', 'Hill Sprint'],
            tips: [
                "Practice 440yd repeats at race pace",
                "Include hill sprints for power development",
                "Work on sprint mechanics with drills"
            ]
        },
        al: {
            title: "Ammo Can Lift Improvement",
            focus: "Shoulder endurance and overhead pressing power",
            tags: ['Shoulders', 'Upper Push', 'Ammo Can'],
            exercises: ['Overhead Press', 'Push Press', 'Dumbbell Shoulder Press', 'Ammo Can Press', 'Front Raise', 'Lateral Raise', 'Clean'],
            tips: [
                "Practice with actual ammo can weight (30 lbs)",
                "Build shoulder endurance with EMOM workouts",
                "Strengthen your pressing lockout"
            ]
        },
        manuf: {
            title: "Maneuver Under Fire Improvement",
            focus: "Full body conditioning and functional movement",
            tags: ['Full Body', 'Metabolic', 'Agility'],
            exercises: ['Buddy Drag', 'Bear Crawl', 'Sprint', 'Farmer Carry', 'Sandbag Carry', 'Agility Ladder'],
            tips: [
                "Practice each component separately at race pace",
                "Build grip strength for carries and drags",
                "Work on transitions between movements"
            ]
        }
    }
};

// Helper function to get recommended exercises from HITT database
const getRecommendedExercises = (criteria) => {
    if (!criteria) return [];
    
    // Filter exercises that match ANY of the tags or names
    return hittExercises.filter(ex => {
        // Check if any tag matches
        const tagMatch = criteria.tags && ex.tags && ex.tags.some(tag => 
            criteria.tags.some(criteriaTag => 
                tag.toLowerCase().includes(criteriaTag.toLowerCase())
            )
        );

        // Check if name matches (fallback)
        const nameMatch = criteria.exercises && criteria.exercises.some(name =>
            ex.name.toLowerCase().includes(name.toLowerCase())
        );

        return tagMatch || nameMatch;
    }).slice(0, 5); // Limit to 5 exercises
};

// Component to show improvement recommendations based on weak events
const ImprovementRecommendations = ({ result, testType, upperBodyType }) => {
    // Identify all weak events (score < 80)
    const getWeakEvents = () => {
        const threshold = 80;
        let scores = [];
        
        if (testType === 'pft') {
            scores = [
                { event: 'upper', score: result.upperBodyScore, label: 'Upper Body' },
                { event: 'plank', score: result.plankScore, label: 'Plank' },
                { event: 'run', score: result.runScore, label: '3-Mile Run' }
            ];
        } else {
            scores = [
                { event: 'mtc', score: result.mtcScore, label: 'Movement to Contact' },
                { event: 'al', score: result.alScore, label: 'Ammo Can Lifts' },
                { event: 'manuf', score: result.manufScore, label: 'Maneuver Under Fire' }
            ];
        }

        // Filter for scores below threshold, or if none, take the absolute lowest
        const weakEvents = scores.filter(s => s.score < threshold);
        
        if (weakEvents.length === 0) {
            // If all are above 80 but still not 1st class (unlikely but possible if < 235 total)
            // Or if user just wants to improve the lowest one
            return [scores.reduce((min, curr) => curr.score < min.score ? curr : min)];
        }
        
        return weakEvents;
    };

    const weakEvents = getWeakEvents();
    const pointsToFirstClass = Math.max(0, 235 - result.totalScore);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-orange-600" />
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    Performance Coaching
                </h4>
                {result.totalScore < 235 && (
                    <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium">
                        {pointsToFirstClass} pts to 1st Class
                    </span>
                )}
            </div>

            {weakEvents.map((weakest, index) => {
                // Get recommendations based on event
                let recommendations;
                if (testType === 'pft') {
                    if (weakest.event === 'upper') {
                        recommendations = exerciseRecommendations.pft.upper[upperBodyType];
                    } else {
                        recommendations = exerciseRecommendations.pft[weakest.event];
                    }
                } else {
                    recommendations = exerciseRecommendations.cft[weakest.event];
                }

                // Get matching exercises from HITT database
                const matchingExercises = getRecommendedExercises(recommendations);

                return (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                        {/* Limiting Factor Header */}
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 border-b border-orange-100 dark:border-orange-800/30">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle size={18} className="text-orange-600" />
                                <span className="font-bold text-orange-800 dark:text-orange-300">
                                    Focus Area: {weakest.label}
                                </span>
                                <span className="ml-auto text-sm font-bold text-orange-700 dark:text-orange-400 bg-white dark:bg-black/20 px-2 py-0.5 rounded">
                                    Score: {weakest.score}/100
                                </span>
                            </div>
                            <p className="text-sm text-orange-700 dark:text-orange-400 pl-6">
                                {weakest.score < 80 
                                    ? `Your score is below the 80-point proficiency threshold. Prioritize this event.`
                                    : `This is your lowest scoring event. Improving this will yield the most points.`}
                            </p>
                        </div>

                        {/* Recommendations Content */}
                        <div className="p-5">
                            <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <Dumbbell size={18} className="text-marine-red" />
                                {recommendations.title}
                            </h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
                                "{recommendations.focus}"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Tips */}
                                <div>
                                    <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pro Tips</h6>
                                    <ul className="space-y-2">
                                        {recommendations.tips.map((tip, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Recommended HITT Exercises */}
                                {matchingExercises.length > 0 && (
                                    <div>
                                        <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            HITT Center Tools
                                        </h6>
                                        <div className="space-y-2">
                                            {matchingExercises.map((ex) => (
                                                <div key={ex.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-marine-red/30 transition-colors">
                                                    <div className="min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{ex.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{ex.equipment}</div>
                                                    </div>
                                                    {ex.url && (
                                                        <a
                                                            href={ex.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-xs font-medium text-marine-red hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded transition-colors"
                                                        >
                                                            <PlayCircle size={14} /> View
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Training Plan Templates
const trainingPlans = {
    pft: {
        title: "8-Week PFT Improvement Plan",
        description: "Progressive overload program targeting all three PFT events",
        weeks: [
            {
                week: 1,
                focus: "Baseline & Foundation",
                days: [
                    { day: "Mon", workout: "Run: 2 miles easy pace + Pull-up pyramid 1-2-3-2-1" },
                    { day: "Tue", workout: "Core: 3 sets max plank, 3x15 leg raises" },
                    { day: "Wed", workout: "Cross-training or Rest" },
                    { day: "Thu", workout: "Run: 4x400m intervals at goal pace" },
                    { day: "Fri", workout: "Full Body: Bodyweight circuit (pushups, lunges, plank)" },
                    { day: "Sat", workout: "Long Run: 3 miles steady pace" },
                    { day: "Sun", workout: "Active Recovery (Walk/Stretch)" }
                ]
            },
            {
                week: 4,
                focus: "Volume Increase",
                days: [
                    { day: "Mon", workout: "Run: 3 miles moderate + Pull-up pyramid 1-2-3-4-3-2-1" },
                    { day: "Tue", workout: "Core: Plank tabata (20s on/10s off) x 8 rounds" },
                    { day: "Wed", workout: "Swim or Bike 30 mins" },
                    { day: "Thu", workout: "Run: 4x800m intervals" },
                    { day: "Fri", workout: "Full Body: Weighted circuit" },
                    { day: "Sat", workout: "Long Run: 4 miles easy" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 8,
                focus: "Peak & Taper",
                days: [
                    { day: "Mon", workout: "Run: 2 miles race pace + Pull-ups 3x50% max" },
                    { day: "Tue", workout: "Core: Light planking + stretching" },
                    { day: "Wed", workout: "Rest" },
                    { day: "Thu", workout: "Run: 1 mile easy + 4 strides" },
                    { day: "Fri", workout: "Rest" },
                    { day: "Sat", workout: "Mock PFT" },
                    { day: "Sun", workout: "Rest" }
                ]
            }
        ]
    },
    cft: {
        title: "6-Week CFT Prep",
        description: "High-intensity functional training for combat fitness",
        weeks: [
            {
                week: 1,
                focus: "Aerobic Base & Technique",
                days: [
                    { day: "Mon", workout: "800m run + Ammo Can Press technique work" },
                    { day: "Tue", workout: "Agility ladder drills + Sprints" },
                    { day: "Wed", workout: "Active Recovery" },
                    { day: "Thu", workout: "MANUF breakdown: Practice crawls and drags" },
                    { day: "Fri", workout: "Circuit: 5 rounds of [200m run, 15 ammo lifts, 10 burpees]" },
                    { day: "Sat", workout: "3 mile hike with light pack" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 6,
                focus: "Test Specificity",
                days: [
                    { day: "Mon", workout: "MTC simulation: 880m sprint" },
                    { day: "Tue", workout: "Ammo Can: Max set in 2 mins" },
                    { day: "Wed", workout: "Rest" },
                    { day: "Thu", workout: "MANUF full run-through (75% effort)" },
                    { day: "Fri", workout: "Rest" },
                    { day: "Sat", workout: "Mock CFT" },
                    { day: "Sun", workout: "Rest" }
                ]
            }
        ]
    }
};

const visualPlans = {
    pft: {
        title: "PFT Visual Training Cards",
        path: "/pft/",
        count: 14, // Assuming there are 14 cards based on typical sets
        description: "Official visual training guides for PFT events"
    },
    cft: {
        title: "CFT Visual Training Cards",
        path: "/cft/",
        count: 125, // Updated to 125 pages
        description: "Comprehensive CFT preparation guide and daily schedule",
        // Map specific days/phases to page numbers if needed
        // For linear documents, we can just let them browse
        fileOffset: 2 // Start from file 3 since 1 and 2 were deleted
    }
};

const PFTPrep = () => {
    const [testType, setTestType] = useState('pft'); // 'pft' or 'cft'
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState(25);
    const [altitude, setAltitude] = useState(false);
    const [expandedWeek, setExpandedWeek] = useState(null);
    const [activeTab, setActiveTab] = useState('calculator'); // 'calculator', 'training', 'visual'
    const [trainingSubTab, setTrainingSubTab] = useState('general'); // 'general', 'pullup'

    // PFT State
    const [pullups, setPullups] = useState(15);
    const [pushups, setPushups] = useState(60);
    const [crunches, setCrunches] = useState(100); // Deprecated but kept for legacy if needed
    const [plankTime, setPlankTime] = useState(240); // Seconds
    const [runTime, setRunTime] = useState(1260); // Seconds (21:00)
    const [rowTime, setRowTime] = useState(300); // Seconds (5:00)
    const [upperBodyType, setUpperBodyType] = useState('pullups'); // 'pullups' or 'pushups'
    const [cardioType, setCardioType] = useState('run'); // 'run' or 'row'

    // CFT State
    const [mtcTime, setMtcTime] = useState(180); // Seconds (3:00)
    const [alReps, setAlReps] = useState(90);
    const [manufTime, setManufTime] = useState(180); // Seconds (3:00)

    // Visual Resource State
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    // Add state for CFT page navigation
    const [cftPageInput, setCftPageInput] = useState('');

    // Mapping for Reload and Rest days to specific pages
    const pageMapping = useMemo(() => {
        const mapping = {};
        // Map Reload days (every 7th day roughly, or specific schedule)
        // This is an estimation, you might need to adjust based on the actual PDF content
        const reloadPages = [9, 16, 23, 30, 37, 44, 51, 58, 65, 72, 79, 86, 93, 100, 107, 114, 121];
        reloadPages.forEach(page => {
            mapping[`Reload`] = page; // This might need to be specific to the week if they differ
        });
        return mapping;
    }, []);

    // Helper to get the actual image filename/index
    const getPage = (index, type) => {
        if (type === 'cft') {
            // Apply offset because first 2 files were deleted
            const offset = visualPlans.cft.fileOffset || 0;
            return index + 1 + offset; 
        }
        return index + 1;
    };

    const handleJumpToPage = (e) => {
        e.preventDefault();
        const pageNum = parseInt(cftPageInput);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= visualPlans.cft.count) {
            setCurrentCardIndex(pageNum - 1);
            setCftPageInput('');
        }
    };

    const result = useMemo(() => {
        const ageGroup = getAgeGroup(age);

        if (testType === 'pft') {
            const inputs = {
                upperBodyType,
                upperBodyReps: upperBodyType === 'pullups' ? pullups : pushups,
                plankMinutes: Math.floor(plankTime / 60),
                plankSeconds: plankTime % 60,
                runMinutes: Math.floor(runTime / 60),
                runSeconds: runTime % 60
            };

            const scores = calculatePFTScore(gender, ageGroup, inputs);

            return {
                upperBodyScore: scores.upperBodyScore,
                plankScore: scores.plankScore,
                runScore: scores.runScore,
                totalScore: scores.totalScore,
                scoreClass: scores.classification.name
            };
        } else {
            const inputs = {
                mtcMinutes: Math.floor(mtcTime / 60),
                mtcSeconds: mtcTime % 60,
                ammoLifts: alReps,
                manufMinutes: Math.floor(manufTime / 60),
                manufSeconds: manufTime % 60,
                isAltitude: altitude
            };

            const scores = calculateCFTScore(gender, ageGroup, inputs);

            return {
                mtcScore: scores.mtcScore,
                alScore: scores.alScore,
                manufScore: scores.manufScore,
                totalScore: scores.totalScore,
                scoreClass: scores.classification.name
            };
        }
    }, [testType, gender, age, altitude, pullups, pushups, plankTime, runTime, upperBodyType, mtcTime, alReps, manufTime]);

    // Format time (seconds to MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-marine-red to-red-900 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                    <Activity className="text-yellow-400" size={28} />
                    <h2 className="text-2xl font-bold">Physical Fitness Calculator</h2>
                </div>
                <p className="text-red-100">Calculate scores, view requirements, and access training plans.</p>
                
                {/* Test Type Toggle */}
                <div className="flex gap-2 mt-6 bg-black/20 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setTestType('pft')}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                            testType === 'pft' 
                                ? 'bg-white text-marine-red shadow-sm' 
                                : 'text-red-100 hover:bg-white/10'
                        }`}
                    >
                        PFT
                    </button>
                    <button
                        onClick={() => setTestType('cft')}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                            testType === 'cft' 
                                ? 'bg-white text-marine-red shadow-sm' 
                                : 'text-red-100 hover:bg-white/10'
                        }`}
                    >
                        CFT
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('calculator')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'calculator'
                            ? 'border-marine-red text-marine-red'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Calculator size={16} />
                        Calculator
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('training')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'training'
                            ? 'border-marine-red text-marine-red'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Training Plan
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('visual')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'visual'
                            ? 'border-marine-red text-marine-red'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <FileText size={16} />
                        Visual Cards
                    </div>
                </button>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {activeTab === 'calculator' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Inputs Column */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Personal Details */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Target size={20} className="text-marine-red" />
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                                        <select
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red"
                                        >
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                                        <input
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(parseInt(e.target.value))}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <input
                                                type="checkbox"
                                                checked={altitude}
                                                onChange={(e) => setAltitude(e.target.checked)}
                                                className="rounded border-gray-300 text-marine-red focus:ring-marine-red"
                                            />
                                            High Altitude (>4500ft)
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Score Inputs */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Activity size={20} className="text-marine-red" />
                                    Performance Metrics
                                </h3>
                                
                                {testType === 'pft' ? (
                                    <div className="space-y-6">
                                        {/* Upper Body */}
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Upper Body</label>
                                                <div className="flex gap-2 text-xs">
                                                    <button
                                                        onClick={() => setUpperBodyType('pullups')}
                                                        className={`px-2 py-0.5 rounded ${upperBodyType === 'pullups' ? 'bg-marine-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        Pull-ups
                                                    </button>
                                                    <button
                                                        onClick={() => setUpperBodyType('pushups')}
                                                        className={`px-2 py-0.5 rounded ${upperBodyType === 'pushups' ? 'bg-marine-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        Push-ups
                                                    </button>
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max={upperBodyType === 'pullups' ? "30" : "100"}
                                                value={upperBodyType === 'pullups' ? pullups : pushups}
                                                onChange={(e) => upperBodyType === 'pullups' ? setPullups(parseInt(e.target.value)) : setPushups(parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-marine-red"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">0</span>
                                                <span className="font-bold text-marine-red">
                                                    {upperBodyType === 'pullups' ? pullups : pushups} reps
                                                </span>
                                                <span className="text-xs text-gray-500">{upperBodyType === 'pullups' ? "30" : "100"}</span>
                                            </div>
                                        </div>

                                        {/* Plank */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plank (seconds)</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="285"
                                                value={plankTime}
                                                onChange={(e) => setPlankTime(parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-marine-red"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">0:00</span>
                                                <span className="font-bold text-marine-red">{formatTime(plankTime)}</span>
                                                <span className="text-xs text-gray-500">4:45</span>
                                            </div>
                                        </div>

                                        {/* Run */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">3-Mile Run</label>
                                            <input
                                                type="range"
                                                min="1080"
                                                max="2100"
                                                step="10"
                                                value={runTime}
                                                onChange={(e) => setRunTime(parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-marine-red"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">18:00</span>
                                                <span className="font-bold text-marine-red">{formatTime(runTime)}</span>
                                                <span className="text-xs text-gray-500">35:00</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* MTC */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Movement to Contact (880 yds)</label>
                                            <input
                                                type="range"
                                                min="120"
                                                max="300"
                                                step="1"
                                                value={mtcTime}
                                                onChange={(e) => setMtcTime(parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-marine-red"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">2:00</span>
                                                <span className="font-bold text-marine-red">{formatTime(mtcTime)}</span>
                                                <span className="text-xs text-gray-500">5:00</span>
                                            </div>
                                        </div>

                                        {/* Ammo Lifts */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ammo Can Lifts (2 mins)</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="150"
                                                value={alReps}
                                                onChange={(e) => setAlReps(parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-marine-red"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">0</span>
                                                <span className="font-bold text-marine-red">{alReps} reps</span>
                                                <span className="text-xs text-gray-500">150</span>
                                            </div>
                                        </div>

                                        {/* MANUF */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Maneuver Under Fire</label>
                                            <input
                                                type="range"
                                                min="120"
                                                max="300"
                                                step="1"
                                                value={manufTime}
                                                onChange={(e) => setManufTime(parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-marine-red"
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-500">2:00</span>
                                                <span className="font-bold text-marine-red">{formatTime(manufTime)}</span>
                                                <span className="text-xs text-gray-500">5:00</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results Column */}
                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-marine-red">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Trophy size={20} className="text-yellow-500" />
                                    Results
                                </h3>
                                
                                <div className="text-center mb-6">
                                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">{result.totalScore}</div>
                                    <div className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${
                                        result.scoreClass === "1st Class" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                                        result.scoreClass === "2nd Class" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" :
                                        result.scoreClass === "3rd Class" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" :
                                        "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    }`}>
                                        {result.scoreClass}
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                                    {testType === 'pft' ? (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Upper Body</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.upperBodyScore} pts</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Plank</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.plankScore} pts</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Run</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.runScore} pts</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">MTC</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.mtcScore} pts</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Ammo Lifts</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.alScore} pts</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">MANUF</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.manufScore} pts</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Recommendations (Conditional) */}
                            {result.totalScore < 300 && (
                                <ImprovementRecommendations 
                                    result={result} 
                                    testType={testType} 
                                    upperBodyType={upperBodyType} 
                                />
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'training' && (
                    <div className="space-y-6">
                        {/* Sub-tab Navigation for PFT */}
                        {testType === 'pft' && (
                            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg w-fit mb-4">
                                <button
                                    onClick={() => setTrainingSubTab('general')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        trainingSubTab === 'general'
                                            ? 'bg-white dark:bg-gray-700 shadow-sm text-marine-red'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}
                                >
                                    General Plan
                                </button>
                                <button
                                    onClick={() => setTrainingSubTab('pullup')}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                        trainingSubTab === 'pullup'
                                            ? 'bg-white dark:bg-gray-700 shadow-sm text-marine-red'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                    }`}
                                >
                                    Pull-up Progression
                                </button>
                            </div>
                        )}

                        {(trainingSubTab === 'general' || testType === 'cft') ? (
                            <>
                                {/* Plan Header */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{trainingPlans[testType].title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{trainingPlans[testType].description}</p>
                                </div>

                                {/* Weeks Accordion */}
                                <div className="space-y-4">
                                    {trainingPlans[testType].weeks.map((weekData) => (
                                        <div key={weekData.week} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => setExpandedWeek(expandedWeek === weekData.week ? null : weekData.week)}
                                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-marine-red text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                                        {weekData.week}
                                                    </div>
                                                    <div className="text-left">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">Week {weekData.week}</h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{weekData.focus}</p>
                                                    </div>
                                                </div>
                                                {expandedWeek === weekData.week ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                            </button>

                                            {expandedWeek === weekData.week && (
                                                <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                                                    <div className="space-y-3">
                                                        {weekData.days.map((day, idx) => (
                                                            <div key={idx} className="flex gap-4 p-2 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors">
                                                                <span className="w-12 font-medium text-gray-500 dark:text-gray-400 text-sm">{day.day}</span>
                                                                <span className="text-sm text-gray-900 dark:text-gray-300">{day.workout}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <PullupProgram />
                        )}
                    </div>
                )}

                {activeTab === 'visual' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText size={20} className="text-marine-red" />
                                        {visualPlans[testType].title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {visualPlans[testType].description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Card {currentCardIndex + 1} of {visualPlans[testType].count}
                                    </span>
                                </div>
                            </div>

                            {/* Viewer Controls - Top (for CFT) */}
                            {testType === 'cft' && (
                                <div className="flex items-center gap-2 mb-4 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                                    <form onSubmit={handleJumpToPage} className="flex gap-2 w-full">
                                        <input
                                            type="number"
                                            min="1"
                                            max={visualPlans[testType].count}
                                            placeholder="Go to page..."
                                            value={cftPageInput}
                                            onChange={(e) => setCftPageInput(e.target.value)}
                                            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                                        />
                                        <button 
                                            type="submit"
                                            className="bg-marine-red text-white px-3 py-1 rounded text-sm font-medium whitespace-nowrap"
                                        >
                                            Go
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Card Viewer */}
                            <div className="relative aspect-[3/4] md:aspect-[4/3] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center group">
                                <img
                                    src={`${visualPlans[testType].path}Slide${getPage(currentCardIndex, testType)}.JPG`}
                                    alt={`${testType.toUpperCase()} Card ${currentCardIndex + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                    }}
                                />

                                {/* Navigation Overlay */}
                                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentCardIndex === 0}
                                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentCardIndex(prev => Math.min(visualPlans[testType].count - 1, prev + 1))}
                                        disabled={currentCardIndex === visualPlans[testType].count - 1}
                                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnails / Progress */}
                            <div className="mt-4 flex justify-center gap-1 flex-wrap">
                                {Array.from({ length: Math.min(visualPlans[testType].count, 14) }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentCardIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            i === currentCardIndex 
                                                ? 'bg-marine-red w-4' 
                                                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                                {visualPlans[testType].count > 14 && (
                                    <span className="text-xs text-gray-400 flex items-center">...</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PFTPrep;