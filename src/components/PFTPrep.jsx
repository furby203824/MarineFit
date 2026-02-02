import React, { useState, useMemo, useEffect } from 'react';
import {
    calculatePFTScore,
    calculateCFTScore,
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
            exercises: ['Plank', 'Dead Bug', 'Bird Dog', 'Rollout'],
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
            exercises: ['High Knees', 'Butt Kicks', 'Sprint', 'Lunge'],
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
            exercises: ['Sprint', 'Shuttle', 'Bounding'],
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
            exercises: ['Press', 'Raise', 'Clean'],
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
            exercises: ['Carry', 'Crawl', 'Drag', 'Agility'],
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
                    { day: "Tue", workout: "Core: 3x30s plank, 3x15 crunches, 3x10 leg raises" },
                    { day: "Wed", workout: "Run: 4x400m intervals @ 90% effort, 90s rest" },
                    { day: "Thu", workout: "Upper: Max pull-ups x3 sets, 50 push-ups (any rep scheme)" },
                    { day: "Fri", workout: "Run: 3 miles steady state" },
                    { day: "Sat", workout: "Active recovery: mobility work, light swim or bike" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 2,
                focus: "Volume Building",
                days: [
                    { day: "Mon", workout: "Run: 2.5 miles + Pull-up pyramid 1-2-3-4-3-2-1" },
                    { day: "Tue", workout: "Core: 3x45s plank, 3x20 crunches, 3x12 leg raises" },
                    { day: "Wed", workout: "Run: 5x400m intervals @ 90%, 75s rest" },
                    { day: "Thu", workout: "Upper: Max pull-ups x4 sets, 75 push-ups total" },
                    { day: "Fri", workout: "Run: 3.5 miles steady" },
                    { day: "Sat", workout: "Active recovery" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 3,
                focus: "Intensity Increase",
                days: [
                    { day: "Mon", workout: "Run: 3 miles + Weighted pull-ups 5x3" },
                    { day: "Tue", workout: "Core: 3x60s plank, 4x20 crunches, hollow holds" },
                    { day: "Wed", workout: "Run: 6x400m @ 95%, 60s rest" },
                    { day: "Thu", workout: "Upper: Grease the groove - pull-ups every hour x8" },
                    { day: "Fri", workout: "Run: 4 miles steady" },
                    { day: "Sat", workout: "Light jog + stretching" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 4,
                focus: "Recovery Week",
                days: [
                    { day: "Mon", workout: "Easy 2 mile run + 50% pull-up volume" },
                    { day: "Tue", workout: "Light core work, focus on form" },
                    { day: "Wed", workout: "3x400m easy pace" },
                    { day: "Thu", workout: "Bodyweight circuit - light" },
                    { day: "Fri", workout: "2 mile easy run" },
                    { day: "Sat", workout: "Mobility & stretching" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 5,
                focus: "Speed Development",
                days: [
                    { day: "Mon", workout: "Tempo run: 3 miles at goal pace" },
                    { day: "Tue", workout: "Core: 4x60s plank, dead bugs, bird dogs" },
                    { day: "Wed", workout: "Track: 8x200m sprints, 45s rest" },
                    { day: "Thu", workout: "Pull-ups: 5 sets max reps, 2min rest" },
                    { day: "Fri", workout: "Long run: 4.5 miles" },
                    { day: "Sat", workout: "Active recovery" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 6,
                focus: "Race Pace Practice",
                days: [
                    { day: "Mon", workout: "3 mile time trial (practice test)" },
                    { day: "Tue", workout: "Core: 4x75s plank, weighted crunches" },
                    { day: "Wed", workout: "Fartlek: 3 miles with 6x30s surges" },
                    { day: "Thu", workout: "Max pull-up test, then 3 more sets" },
                    { day: "Fri", workout: "Easy 3 miles" },
                    { day: "Sat", workout: "Mobility" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 7,
                focus: "Peak Week",
                days: [
                    { day: "Mon", workout: "Run: Mile repeats x3 at goal pace" },
                    { day: "Tue", workout: "Core: Max plank test + accessory work" },
                    { day: "Wed", workout: "Short intervals: 10x100m all out" },
                    { day: "Thu", workout: "Pull-up ladders: 1-2-3-4-5-4-3-2-1 x2" },
                    { day: "Fri", workout: "Easy 2 miles, strides" },
                    { day: "Sat", workout: "Light movement" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 8,
                focus: "Taper & Test",
                days: [
                    { day: "Mon", workout: "Easy 2 miles + 2 sets pull-ups at 50%" },
                    { day: "Tue", workout: "Light core, 2x30s plank" },
                    { day: "Wed", workout: "4x200m at race pace, full recovery" },
                    { day: "Thu", workout: "Rest or very light movement" },
                    { day: "Fri", workout: "Rest - hydrate and prepare" },
                    { day: "Sat", workout: "PFT TEST DAY" },
                    { day: "Sun", workout: "Recovery" }
                ]
            }
        ]
    },
    cft: {
        title: "8-Week CFT Improvement Plan",
        description: "Combat-focused conditioning for all three CFT events",
        weeks: [] // Placeholder for interactive plan
    }
};

// CFT Visual Guidance Schedule Structure
const cftSchedule = {
    days: [
        { name: 'Mon', label: 'Warrior', type: 'warrior' },
        { name: 'Tue', label: 'Athlete', type: 'athlete' },
        { name: 'Wed', label: 'Reload', type: 'reload' },
        { name: 'Thu', label: 'Combat', type: 'combat' },
        { name: 'Fri', label: 'Company', type: 'company' },
        { name: 'Sat', label: 'Reload', type: 'reload' },
        { name: 'Sun', label: 'Rest Day', type: 'rest' }
    ],
    // Calculate page number based on week (1-25) and day index (0-6)
    getPage: (week, dayIndex) => {
        if (dayIndex === 6) return null; // Sunday is Rest
        
        const basePage = 1;
        const weekOffset = (week - 1) * 5;
        
        // Map day index to content offset (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=2)
        let contentOffset;
        if (dayIndex === 5) { // Saturday -> Reload (same as Wednesday)
            contentOffset = 2;
        } else {
            contentOffset = dayIndex;
        }
        
        return basePage + weekOffset + contentOffset;
    }
};

const visualPlans = {
    'pft-visual': {
        title: "16-Week PFT Prep Program",
        totalPages: 16,
        basePath: "/MarineFit/pft/PFT Prep Program_page-",
        padLength: 4
    },
    'plank-visual': {
        title: "4-Week Plank Progression",
        totalPages: 4,
        basePath: "/MarineFit/pft/Plank Progression_Wk1-Wk4_page-",
        padLength: 4
    },
    'cft-visual': {
        title: "CFT Prep Guidance",
        totalPages: 125,
        basePath: "/MarineFit/cft/CFT PREP GUIDANCE_page-",
        padLength: 4,
        hasSchedule: true,
        fileOffset: 2
    }
};

const PFTPrep = () => {
    const [testType, setTestType] = useState('pft');
    const [mode, setMode] = useState('calculator'); // calculator, planner, training
    const [expandedWeek, setExpandedWeek] = useState(1);
    const [plannerTarget, setPlannerTarget] = useState(285);
    const [solveFor, setSolveFor] = useState('run'); // run, upper, plank, mtc, al, manuf
    const [activePlan, setActivePlan] = useState('interactive'); // interactive, pft-visual, plank-visual, return-to-run
    const [resourcePage, setResourcePage] = useState(1);
    const [cftWeek, setCftWeek] = useState(1); // Track selected week for CFT schedule navigator
    const [inputs, setInputs] = useState({
        gender: 'male',
        age: '21-25',
        // PFT
        upperBodyType: 'pullups',
        upperBodyReps: '',
        plankMinutes: '',
        plankSeconds: '',
        runMinutes: '',
        runSeconds: '',
        // CFT
        mtcMinutes: '',
        mtcSeconds: '',
        ammoLifts: '',
        manufMinutes: '',
        manufSeconds: '',
        isAltitude: false
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handlePlanChange = (plan) => {
        setActivePlan(plan);
        setResourcePage(1);
        if (plan === 'cft-visual') setCftWeek(1);
    };

    const handleScheduleClick = (week, dayIndex) => {
        const page = cftSchedule.getPage(week, dayIndex);
        if (page) {
            setResourcePage(page);
        }
    };

    // Sync cftWeek with resourcePage
    useEffect(() => {
        if (activePlan === 'cft-visual') {
            const pageOffset = resourcePage - 1; // Page 1 is start of content
            if (pageOffset >= 0) {
                const week = Math.floor(pageOffset / 5) + 1;
                if (week >= 1 && week <= 25) {
                    setCftWeek(week);
                }
            }
        }
    }, [resourcePage, activePlan]);

    const nextResourcePage = () => {
        const currentPlan = visualPlans[activePlan];
        if (resourcePage < currentPlan.totalPages) setResourcePage(p => p + 1);
    };

    const prevResourcePage = () => {
        if (resourcePage > 1) setResourcePage(p => p - 1);
    };

    const getResourceImagePath = (pageNum) => {
        const currentPlan = visualPlans[activePlan];
        const offset = currentPlan.fileOffset || 0;
        const pageStr = (pageNum + offset).toString().padStart(currentPlan.padLength, '0');
        return `${currentPlan.basePath}${pageStr}.jpg`;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setInputs(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCalculate = () => {
        setError(null);
        setResult(null);

        try {
            if (mode === 'planner') {
                const tempInputs = { ...inputs };
                let currentPoints = 0;
                let pointsNeeded = 0;
                let requirement = "";

                if (testType === 'pft') {
                    // PFT Planner Logic
                    const getPFTEventScore = (event) => {
                       const fullScore = calculatePFTScore(inputs.gender, inputs.age, {
                           ...tempInputs,
                           upperBodyReps: parseInt(tempInputs.upperBodyReps) || 0,
                           plankMinutes: parseInt(tempInputs.plankMinutes) || 0,
                           plankSeconds: parseInt(tempInputs.plankSeconds) || 0,
                           runMinutes: parseInt(tempInputs.runMinutes) || 0,
                           runSeconds: parseInt(tempInputs.runSeconds) || 0
                       });
                       
                       if (event === 'upper') return fullScore.upperBodyScore;
                       if (event === 'plank') return fullScore.plankScore;
                       if (event === 'run') return fullScore.runScore;
                       return 0;
                    };

                    if (solveFor !== 'upper') currentPoints += getPFTEventScore('upper');
                    if (solveFor !== 'plank') currentPoints += getPFTEventScore('plank');
                    if (solveFor !== 'run') currentPoints += getPFTEventScore('run');
                    
                    pointsNeeded = plannerTarget - currentPoints;
                    
                    if (solveFor === 'upper') {
                        const reps = getRequiredUpperBodyReps(inputs.gender, inputs.age, inputs.upperBodyType, pointsNeeded);
                        requirement = `${reps} Reps`;
                    } else if (solveFor === 'plank') {
                        const time = getRequiredPlankTime(pointsNeeded);
                        requirement = time;
                    } else if (solveFor === 'run') {
                        const time = getRequiredRunTime(inputs.gender, inputs.age, pointsNeeded);
                        requirement = time;
                    }
                } else {
                    // CFT Planner Logic
                    const getCFTEventScore = (event) => {
                        const fullScore = calculateCFTScore(inputs.gender, inputs.age, {
                            ...tempInputs,
                            mtcMinutes: parseInt(tempInputs.mtcMinutes) || 0,
                            mtcSeconds: parseInt(tempInputs.mtcSeconds) || 0,
                            ammoLifts: parseInt(tempInputs.ammoLifts) || 0,
                            manufMinutes: parseInt(tempInputs.manufMinutes) || 0,
                            manufSeconds: parseInt(tempInputs.manufSeconds) || 0,
                            isAltitude: tempInputs.isAltitude
                        });

                        if (event === 'mtc') return fullScore.mtcScore;
                        if (event === 'al') return fullScore.alScore;
                        if (event === 'manuf') return fullScore.manufScore;
                        return 0;
                    };

                    if (solveFor !== 'mtc') currentPoints += getCFTEventScore('mtc');
                    if (solveFor !== 'al') currentPoints += getCFTEventScore('al');
                    if (solveFor !== 'manuf') currentPoints += getCFTEventScore('manuf');

                    pointsNeeded = plannerTarget - currentPoints;

                    if (solveFor === 'mtc') {
                        const time = getRequiredMTC(inputs.gender, inputs.age, pointsNeeded);
                        requirement = time;
                    } else if (solveFor === 'al') {
                        const reps = getRequiredAmmoLifts(inputs.gender, inputs.age, pointsNeeded);
                        requirement = `${reps} Reps`;
                    } else if (solveFor === 'manuf') {
                        const time = getRequiredMANUF(inputs.gender, inputs.age, pointsNeeded);
                        requirement = time;
                    }
                }

                if (pointsNeeded > 100) {
                    throw new Error(`Impossible! You need ${pointsNeeded} points in the last event, but max is 100.`);
                }
                
                setResult({
                    isPlanner: true,
                    pointsNeeded: Math.max(0, pointsNeeded),
                    requirement,
                    currentPoints
                });
                return;
            }

            // Normal Calculator Logic
            if (testType === 'pft') {
                if (!inputs.upperBodyReps || !inputs.plankMinutes || !inputs.runMinutes) {
                    throw new Error('Please enter valid performance data for all PFT events.');
                }
                const score = calculatePFTScore(inputs.gender, inputs.age, {
                    upperBodyType: inputs.upperBodyType,
                    upperBodyReps: parseInt(inputs.upperBodyReps) || 0,
                    plankMinutes: parseInt(inputs.plankMinutes) || 0,
                    plankSeconds: parseInt(inputs.plankSeconds) || 0,
                    runMinutes: parseInt(inputs.runMinutes) || 0,
                    runSeconds: parseInt(inputs.runSeconds) || 0
                });
                setResult(score);
            } else {
                if (!inputs.mtcMinutes || !inputs.ammoLifts || !inputs.manufMinutes) {
                    throw new Error('Please enter valid performance data for all CFT events.');
                }
                const score = calculateCFTScore(inputs.gender, inputs.age, {
                    mtcMinutes: parseInt(inputs.mtcMinutes) || 0,
                    mtcSeconds: parseInt(inputs.mtcSeconds) || 0,
                    ammoLifts: parseInt(inputs.ammoLifts) || 0,
                    manufMinutes: parseInt(inputs.manufMinutes) || 0,
                    manufSeconds: parseInt(inputs.manufSeconds) || 0,
                    isAltitude: inputs.isAltitude
                });
                setResult(score);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-marine-red/10 rounded-lg">
                        <Calculator className="w-8 h-8 text-marine-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">PFT/CFT Calculator</h1>
                        <p className="text-gray-500 dark:text-gray-400">Calculate your physical fitness score</p>
                    </div>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${testType === 'pft' ? 'bg-white dark:bg-gray-600 text-marine-red dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                        onClick={() => {
                            setTestType('pft');
                            setSolveFor('run');
                            setResult(null);
                            setError(null);
                            setActivePlan('interactive');
                        }}
                    >
                        PFT (Physical Fitness Test)
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${testType === 'cft' ? 'bg-white dark:bg-gray-600 text-marine-red dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                        onClick={() => {
                            setTestType('cft');
                            setSolveFor('mtc');
                            setResult(null);
                            setError(null);
                            setActivePlan('interactive');
                        }}
                    >
                        CFT (Combat Fitness Test)
                    </button>
                </div>
            </header>

            {/* Mode Toggle */}
            <div className="flex justify-center mb-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-lg shadow-sm flex flex-wrap justify-center">
                    <button
                        onClick={() => { setMode('calculator'); setResult(null); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'calculator' ? 'bg-marine-red text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Calculator size={16} /> Calculator
                    </button>
                    <button
                        onClick={() => { setMode('planner'); setResult(null); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'planner' ? 'bg-marine-red text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Target size={16} /> Goal Planner
                    </button>
                    <button
                        onClick={() => { setMode('training'); setResult(null); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'training' ? 'bg-marine-red text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Calendar size={16} /> Training Plans
                    </button>
                </div>
            </div>

            {mode === 'training' ? (
                // Training Plans View
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {testType === 'pft' && (
                        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto mb-4">
                            <button
                                onClick={() => handlePlanChange('interactive')}
                                className={`pb-2 px-4 whitespace-nowrap font-medium transition-colors relative ${
                                    activePlan === 'interactive' 
                                    ? 'text-marine-red' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            >
                                Interactive 8-Week Plan
                                {activePlan === 'interactive' && (
                                    <motion.div layoutId="planTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-marine-red" />
                                )}
                            </button>
                            <button
                                onClick={() => handlePlanChange('pft-visual')}
                                className={`pb-2 px-4 whitespace-nowrap font-medium transition-colors relative ${
                                    activePlan === 'pft-visual' 
                                    ? 'text-marine-red' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            >
                                16-Week Visual Program
                                {activePlan === 'pft-visual' && (
                                    <motion.div layoutId="planTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-marine-red" />
                                )}
                            </button>
                            <button
                                onClick={() => handlePlanChange('plank-visual')}
                                className={`pb-2 px-4 whitespace-nowrap font-medium transition-colors relative ${
                                    activePlan === 'plank-visual' 
                                    ? 'text-marine-red' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            >
                                4-Week Plank Program
                                {activePlan === 'plank-visual' && (
                                    <motion.div layoutId="planTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-marine-red" />
                                )}
                            </button>
                            <button
                                onClick={() => handlePlanChange('return-to-run')}
                                className={`pb-2 px-4 whitespace-nowrap font-medium transition-colors relative ${
                                    activePlan === 'return-to-run' 
                                    ? 'text-marine-red' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            >
                                Return to Run (Rehab)
                                {activePlan === 'return-to-run' && (
                                    <motion.div layoutId="planTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-marine-red" />
                                )}
                            </button>
                        </div>
                    )}

                    {testType === 'cft' && (
                        <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto mb-4">
                            <button
                                onClick={() => handlePlanChange('interactive')}
                                className={`pb-2 px-4 whitespace-nowrap font-medium transition-colors relative ${
                                    activePlan === 'interactive' 
                                    ? 'text-marine-red' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            >
                                Interactive 8-Week Plan
                                {activePlan === 'interactive' && (
                                    <motion.div layoutId="planTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-marine-red" />
                                )}
                            </button>
                            <button
                                onClick={() => handlePlanChange('cft-visual')}
                                className={`pb-2 px-4 whitespace-nowrap font-medium transition-colors relative ${
                                    activePlan === 'cft-visual' 
                                    ? 'text-marine-red' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                                }`}
                            >
                                CFT Prep Guidance (Visual)
                                {activePlan === 'cft-visual' && (
                                    <motion.div layoutId="planTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-marine-red" />
                                )}
                            </button>
                        </div>
                    )}

                    {activePlan === 'interactive' && (
                        <>
                            <div className="card">
                                <div className="flex items-center gap-3 mb-4">
                                    <Calendar className="w-6 h-6 text-marine-red" />
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white m-0">
                                            {trainingPlans[testType].title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {trainingPlans[testType].description}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {trainingPlans[testType].weeks.map((weekData) => (
                                        <div
                                            key={weekData.week}
                                            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                        >
                                            <button
                                                onClick={() => setExpandedWeek(expandedWeek === weekData.week ? null : weekData.week)}
                                                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 bg-marine-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                        {weekData.week}
                                                    </span>
                                                    <div className="text-left">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            Week {weekData.week}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {weekData.focus}
                                                        </p>
                                                    </div>
                                                </div>
                                                {expandedWeek === weekData.week ? (
                                                    <ChevronUp className="text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="text-gray-400" />
                                                )}
                                            </button>

                                            <AnimatePresence>
                                                {expandedWeek === weekData.week && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-4 space-y-2 bg-white dark:bg-gray-800">
                                                            {weekData.days.map((dayData, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                                                >
                                                                    <span className={`w-10 text-xs font-bold py-1 px-2 rounded ${
                                                                        dayData.day === 'Sun' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                                                        dayData.day === 'Sat' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                                                                        'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                                                                    }`}>
                                                                        {dayData.day}
                                                                    </span>
                                                                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                                                        {dayData.workout}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Training Tips */}
                            <div className="card bg-marine-red text-white">
                                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                    <Trophy className="text-marine-gold" /> Training Tips
                                </h4>
                                <ul className="space-y-2 text-red-100 text-sm">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-marine-gold mt-0.5 flex-shrink-0" />
                                        <span>Consistency beats intensity. Show up every day even when motivation is low.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-marine-gold mt-0.5 flex-shrink-0" />
                                        <span>Sleep 7-9 hours nightly. Recovery is where gains happen.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-marine-gold mt-0.5 flex-shrink-0" />
                                        <span>Week 4 recovery is critical. Don't skip it to avoid overtraining.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 size={16} className="text-marine-gold mt-0.5 flex-shrink-0" />
                                        <span>Practice test conditions: same time of day, same warmup routine.</span>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}

                    {activePlan === 'return-to-run' && (
                        <div className="space-y-6">
                            <div className="card">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <Shield className="text-marine-green" /> {returnToRunData.title}
                                </h3>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 italic">
                                    Source: {returnToRunData.source}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    {returnToRunData.intro}
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {returnToRunData.sections.map((section, idx) => {
                                        const Icon = {
                                            Shield: Shield,
                                            AlertTriangle: AlertTriangle,
                                            Thermometer: Thermometer,
                                            Activity: Activity,
                                            FirstAid: HeartPulse
                                        }[section.icon] || Activity;
                                        
                                        return (
                                            <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                    <Icon size={18} className="text-marine-red" />
                                                    {section.title}
                                                </h4>
                                                
                                                {section.content && (
                                                    <ul className="space-y-2">
                                                        {section.content.map((item, i) => (
                                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                                <div className="min-w-[4px] h-[4px] rounded-full bg-marine-red mt-2" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                
                                                {section.subsections && (
                                                    <div className="space-y-4">
                                                        {section.subsections.map((sub, i) => (
                                                            <div key={i}>
                                                                <h5 className={`text-sm font-medium mb-2 ${
                                                                    sub.type === 'danger' ? 'text-red-600 dark:text-red-400' :
                                                                    sub.type === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                                                                    sub.type === 'success' ? 'text-green-600 dark:text-green-400' :
                                                                    'text-gray-800 dark:text-gray-200'
                                                                }`}>
                                                                    {sub.subtitle}
                                                                </h5>
                                                                <ul className="space-y-1">
                                                                    {sub.points.map((pt, j) => (
                                                                        <li key={j} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                                            <span className="text-gray-400">•</span>
                                                                            {pt}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            
                            {/* Phases */}
                            <div className="space-y-4">
                                {returnToRunData.phases.map((phase, idx) => (
                                    <div key={idx} className="card border-l-4 border-l-marine-red">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {phase.phase}: {phase.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                            {phase.description}
                                        </p>
                                        
                                        {phase.exercises && (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                                        <tr>
                                                            <th className="px-4 py-2">Exercise</th>
                                                            <th className="px-4 py-2">Sets</th>
                                                            <th className="px-4 py-2">Contacts/Set</th>
                                                            <th className="px-4 py-2">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {phase.exercises.map((ex, i) => (
                                                            <tr key={i} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                                                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{ex.name}</td>
                                                                <td className="px-4 py-2">{ex.sets}</td>
                                                                <td className="px-4 py-2">{ex.contactsPerSet}</td>
                                                                <td className="px-4 py-2">{ex.totalContacts}</td>
                                                            </tr>
                                                        ))}
                                                        <tr className="bg-gray-50 dark:bg-gray-700 font-bold">
                                                            <td className="px-4 py-2" colSpan={3}>Total Foot Contacts</td>
                                                            <td className="px-4 py-2">{phase.totalContacts}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                
                                                {phase.restBetweenSets && (
                                                    <div className="mt-3 text-xs text-gray-500 flex gap-4">
                                                        <span><strong>Rest Between Sets:</strong> {phase.restBetweenSets}</span>
                                                        <span><strong>Between Exercises:</strong> {phase.restBetweenExercises}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {phase.type === 'interval' && phase.schedule && (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                                        <tr>
                                                            <th className="px-4 py-2">Step</th>
                                                            <th className="px-4 py-2">Walk</th>
                                                            <th className="px-4 py-2">Jog</th>
                                                            <th className="px-4 py-2">Reps</th>
                                                            <th className="px-4 py-2">Total Time</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {phase.schedule.map((row, i) => (
                                                            <tr key={i} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                                                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.step}</td>
                                                                <td className="px-4 py-2">{row.walk}</td>
                                                                <td className="px-4 py-2">{row.jog}</td>
                                                                <td className="px-4 py-2">{row.reps}</td>
                                                                <td className="px-4 py-2">{row.total}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {phase.type === 'continuous' && phase.schedule && (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                                                        <tr>
                                                            <th className="px-4 py-2">Step</th>
                                                            <th className="px-4 py-2">Run Duration</th>
                                                            <th className="px-4 py-2">Frequency</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {phase.schedule.map((row, i) => (
                                                            <tr key={i} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                                                <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{row.step}</td>
                                                                <td className="px-4 py-2">{row.run}</td>
                                                                <td className="px-4 py-2">{row.freq}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {['pft-visual', 'plank-visual', 'cft-visual'].includes(activePlan) && (
                        <div className="card flex flex-col items-center">
                            {/* CFT Schedule Navigator */}
                            {visualPlans[activePlan].hasSchedule && (
                                <div className="w-full mb-6 p-4 bg-marine-green/5 dark:bg-marine-green/10 rounded-lg border border-marine-green/20">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Calendar size={18} className="text-marine-green" />
                                            Schedule Navigator
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => setCftWeek(w => Math.max(1, w - 1))}
                                                disabled={cftWeek === 1}
                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-30"
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <span className="font-medium text-sm">Week {cftWeek}</span>
                                            <button 
                                                onClick={() => setCftWeek(w => Math.min(25, w + 1))}
                                                disabled={cftWeek === 25}
                                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-30"
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                                        {cftSchedule.days.map((day, idx) => {
                                            const pageNum = cftSchedule.getPage(cftWeek, idx);
                                            const isRest = idx === 6;
                                            const isSelected = !isRest && resourcePage === pageNum;
                                            
                                            return (
                                                <button
                                                    key={day.name}
                                                    onClick={() => !isRest && handleScheduleClick(cftWeek, idx)}
                                                    disabled={isRest}
                                                    className={`
                                                        p-2 rounded text-xs flex flex-col items-center gap-1 transition-all
                                                        ${isRest 
                                                            ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-default' 
                                                            : isSelected
                                                                ? 'bg-marine-red text-white shadow-md transform scale-105'
                                                                : 'bg-white dark:bg-gray-800 hover:bg-marine-red/10 border border-gray-200 dark:border-gray-700'
                                                        }
                                                    `}
                                                >
                                                    <span className="font-bold">{day.name}</span>
                                                    <span className={`text-[10px] ${isSelected ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                                        {day.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="w-full flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {visualPlans[activePlan].title}
                                </h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={prevResourcePage}
                                        disabled={resourcePage === 1}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Page {resourcePage} of {visualPlans[activePlan].totalPages}
                                    </span>
                                    <button
                                        onClick={nextResourcePage}
                                        disabled={resourcePage === visualPlans[activePlan].totalPages}
                                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Image Display */}
                            <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 min-h-[400px] flex items-center justify-center relative">
                                <img
                                    key={`${activePlan}-${resourcePage}`}
                                    src={getResourceImagePath(resourcePage)}
                                    alt={`${visualPlans[activePlan].title} Page ${resourcePage}`}
                                    className="max-w-full max-h-[80vh] object-contain"
                                    loading="eager"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/600x800?text=Image+Not+Found";
                                    }}
                                />
                            </div>
                            
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                Use the arrows to navigate through the program cards.
                            </p>
                        </div>
                    )}
                </motion.div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        {mode === 'planner' ? <Target className="w-5 h-5 text-gray-400" /> : <Activity className="w-5 h-5 text-gray-400" />}
                        {mode === 'planner' ? 'Define Your Scenario' : 'Enter Your Stats'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                                <select name="gender" value={inputs.gender} onChange={handleInputChange} className="input-field">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age Group</label>
                                <select name="age" value={inputs.age} onChange={handleInputChange} className="input-field">
                                    <option value="17-20">17-20</option>
                                    <option value="21-25">21-25</option>
                                    <option value="26-30">26-30</option>
                                    <option value="31-35">31-35</option>
                                    <option value="36-40">36-40</option>
                                    <option value="41-45">41-45</option>
                                    <option value="46-50">46-50</option>
                                    <option value="51+">51+</option>
                                </select>
                            </div>
                        </div>

                        {mode === 'planner' && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
                                <label className="block text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">Target Total Score (0-300)</label>
                                <input
                                    type="number"
                                    value={plannerTarget}
                                    onChange={(e) => setPlannerTarget(parseInt(e.target.value) || 0)}
                                    className="input-field text-lg font-bold text-blue-900 dark:text-blue-100"
                                    min="0"
                                    max="300"
                                />
                                <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">First Class: 235+ | Promotion Rec: ~285</p>
                            </div>
                        )}

                        {testType === 'pft' ? (
                            <>
                                {/* Upper Body Section */}
                                <div className={`space-y-3 transition-all ${mode === 'planner' && solveFor === 'upper' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upper Body Event</label>
                                        {mode === 'planner' && (
                                            <button
                                                onClick={() => setSolveFor('upper')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'upper' ? 'bg-marine-red text-white border-marine-red' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}
                                            >
                                                {solveFor === 'upper' ? 'Solving...' : 'Solve for this'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100">
                                            <input type="radio" name="upperBodyType" value="pullups" checked={inputs.upperBodyType === 'pullups'} onChange={handleInputChange} className="text-marine-red focus:ring-marine-red" />
                                            <span>Pull-ups</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100">
                                            <input type="radio" name="upperBodyType" value="pushups" checked={inputs.upperBodyType === 'pushups'} onChange={handleInputChange} className="text-marine-red focus:ring-marine-red" />
                                            <span>Push-ups</span>
                                        </label>
                                    </div>
                                    <input 
                                        type="number" 
                                        name="upperBodyReps" 
                                        value={inputs.upperBodyReps} 
                                        onChange={handleInputChange} 
                                        placeholder={solveFor === 'upper' ? "Calculated automatically..." : "Reps"}
                                        className="input-field" 
                                    />
                                </div>

                                {/* Plank Section */}
                                <div className={`transition-all ${mode === 'planner' && solveFor === 'plank' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plank</label>
                                        {mode === 'planner' && (
                                            <button
                                                onClick={() => setSolveFor('plank')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'plank' ? 'bg-marine-red text-white border-marine-red' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}
                                            >
                                                {solveFor === 'plank' ? 'Solving...' : 'Solve for this'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" name="plankMinutes" placeholder="Minutes" value={inputs.plankMinutes} onChange={handleInputChange} className="input-field" />
                                        <input type="number" name="plankSeconds" placeholder="Seconds" value={inputs.plankSeconds} onChange={handleInputChange} className="input-field" />
                                    </div>
                                </div>

                                {/* Run Section */}
                                <div className={`transition-all ${mode === 'planner' && solveFor === 'run' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">3-Mile Run</label>
                                        {mode === 'planner' && (
                                            <button
                                                onClick={() => setSolveFor('run')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'run' ? 'bg-marine-red text-white border-marine-red' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}
                                            >
                                                {solveFor === 'run' ? 'Solving...' : 'Solve for this'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" name="runMinutes" placeholder="Minutes" value={inputs.runMinutes} onChange={handleInputChange} className="input-field" />
                                        <input type="number" name="runSeconds" placeholder="Seconds" value={inputs.runSeconds} onChange={handleInputChange} className="input-field" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`transition-all ${mode === 'planner' && solveFor === 'mtc' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Movement to Contact (880 yds)</label>
                                        {mode === 'planner' && (
                                            <button
                                                onClick={() => setSolveFor('mtc')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'mtc' ? 'bg-marine-red text-white border-marine-red' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}
                                            >
                                                {solveFor === 'mtc' ? 'Solving...' : 'Solve for this'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" name="mtcMinutes" placeholder="Minutes" value={inputs.mtcMinutes} onChange={handleInputChange} className="input-field" />
                                        <input type="number" name="mtcSeconds" placeholder="Seconds" value={inputs.mtcSeconds} onChange={handleInputChange} className="input-field" />
                                    </div>
                                </div>

                                <div className={`transition-all ${mode === 'planner' && solveFor === 'al' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ammo Can Lifts (2 mins)</label>
                                        {mode === 'planner' && (
                                            <button
                                                onClick={() => setSolveFor('al')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'al' ? 'bg-marine-red text-white border-marine-red' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}
                                            >
                                                {solveFor === 'al' ? 'Solving...' : 'Solve for this'}
                                            </button>
                                        )}
                                    </div>
                                    <input type="number" name="ammoLifts" placeholder="Reps" value={inputs.ammoLifts} onChange={handleInputChange} className="input-field" />
                                </div>

                                <div className={`transition-all ${mode === 'planner' && solveFor === 'manuf' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maneuver Under Fire</label>
                                        {mode === 'planner' && (
                                            <button
                                                onClick={() => setSolveFor('manuf')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'manuf' ? 'bg-marine-red text-white border-marine-red' : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}
                                            >
                                                {solveFor === 'manuf' ? 'Solving...' : 'Solve for this'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" name="manufMinutes" placeholder="Minutes" value={inputs.manufMinutes} onChange={handleInputChange} className="input-field" />
                                        <input type="number" name="manufSeconds" placeholder="Seconds" value={inputs.manufSeconds} onChange={handleInputChange} className="input-field" />
                                    </div>
                                </div>
                                
                                <label className="flex items-center gap-2 cursor-pointer pt-2">
                                    <input type="checkbox" name="isAltitude" checked={inputs.isAltitude} onChange={handleInputChange} className="rounded text-marine-red focus:ring-marine-red" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Test conducted at Altitude (4500ft+)</span>
                                </label>
                            </>
                        )}

                        <button 
                            onClick={handleCalculate}
                            className="w-full btn mt-4"
                        >
                            Calculate Score
                        </button>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
                        >
                            <div className={`p-6 text-center ${result.isPlanner ? 'bg-blue-600' : 'bg-marine-red'} text-white`}>
                                <h3 className="text-white text-lg font-medium opacity-90 mb-1">
                                    {result.isPlanner ? 'Required Performance' : 'Total Score'}
                                </h3>
                                <div className="text-5xl font-bold mb-2">
                                    {result.isPlanner ? result.requirement : result.totalScore}
                                </div>
                                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm">
                                    {result.isPlanner ? `To Hit ${plannerTarget} Points` : `${result.classification?.name || result.classification} Class`}
                                </div>
                            </div>

                            <div className="p-6 space-y-4 flex-1">
                                {result.isPlanner ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600 dark:text-gray-300">Points from Locked Events</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{result.currentPoints}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-300">Points Needed</span>
                                                <span className="font-bold text-blue-600 dark:text-blue-400">{result.pointsNeeded}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
                                            Based on simplified scoring tiers. Aim slightly higher to ensure score.
                                        </p>
                                    </div>
                                ) : (
                                    testType === 'pft' ? (
                                        <>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-gray-600 dark:text-gray-300">Upper Body</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{result.upperBodyScore} pts</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-gray-600 dark:text-gray-300">Plank</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{result.plankScore} pts</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-gray-600 dark:text-gray-300">Run</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{result.runScore} pts</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-gray-600 dark:text-gray-300">MTC</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{result.mtcScore} pts</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-gray-600 dark:text-gray-300">ACL</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{result.alScore} pts</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-gray-600 dark:text-gray-300">MANUF</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{result.manufScore} pts</span>
                                        </div>
                                    </>
                                ))}

                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                    {(result.totalScore >= 235) ? (
                                        <>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                <Trophy size={16} className="text-marine-gold" />
                                                First Class Performance
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                                Outstanding work! Maintain this level of fitness and focus on injury prevention.
                                                Consider working toward a 285+ score for promotion competitiveness.
                                            </p>
                                        </>
                                    ) : (
                                        <ImprovementRecommendations
                                            result={result}
                                            testType={testType}
                                            upperBodyType={inputs.upperBodyType}
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            )}
        </div>
    );
};

export default PFTPrep;