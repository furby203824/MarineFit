import React, { useState, useMemo } from 'react';
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
import { hittExercises } from '../data/hittData';
import { Calculator, Activity, Trophy, AlertCircle, Target, Calendar, ChevronDown, ChevronUp, CheckCircle2, Dumbbell, PlayCircle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Exercise recommendations based on weak PFT/CFT events
const exerciseRecommendations = {
    pft: {
        upper: {
            pullups: {
                title: "Pull-up Improvement",
                focus: "Upper body pulling strength and grip endurance",
                exercises: ['Bent Over Row', 'Lat Pull Down', 'Inverted Row', 'Dead Hang', 'Scapular Pull-up', 'Negative Pull-up'],
                tips: [
                    "Practice pull-up negatives (slow lowering) to build strength",
                    "Grease the groove: do submaximal sets throughout the day",
                    "Focus on grip strength with dead hangs"
                ]
            },
            pushups: {
                title: "Push-up Improvement",
                focus: "Upper body pushing endurance and core stability",
                exercises: ['Push-up', 'Incline Push-up', 'Diamond Push-up', 'Dumbbell Bench Press', 'Tricep Dip', 'Plank'],
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
            exercises: ['Plank', 'Side Plank', 'Dead Bug', 'Bird Dog', 'Hollow Body Hold', 'Ab Wheel Rollout'],
            tips: [
                "Practice daily planks, gradually increasing duration",
                "Focus on proper form: straight line from head to heels",
                "Breathe steadily - don't hold your breath"
            ]
        },
        run: {
            title: "3-Mile Run Improvement",
            focus: "Aerobic capacity and running economy",
            exercises: ['High Knees', 'Butt Kicks', 'A-Skip', 'B-Skip', 'Bounding', 'Sprint'],
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
            exercises: ['Overhead Press', 'Push Press', 'Dumbbell Shoulder Press', 'Ammo Can Press', 'Front Raise', 'Lateral Raise'],
            tips: [
                "Practice with actual ammo can weight (30 lbs)",
                "Build shoulder endurance with EMOM workouts",
                "Strengthen your pressing lockout"
            ]
        },
        manuf: {
            title: "Maneuver Under Fire Improvement",
            focus: "Full body conditioning and functional movement",
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
const getRecommendedExercises = (exerciseNames) => {
    return hittExercises.filter(ex =>
        exerciseNames.some(name =>
            ex.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(ex.name.toLowerCase())
        )
    ).slice(0, 5); // Limit to 5 exercises
};

// Component to show improvement recommendations based on weak events
const ImprovementRecommendations = ({ result, testType, upperBodyType }) => {
    // Identify the weakest event
    const getWeakestEvent = () => {
        if (testType === 'pft') {
            const scores = [
                { event: 'upper', score: result.upperBodyScore, label: 'Upper Body' },
                { event: 'plank', score: result.plankScore, label: 'Plank' },
                { event: 'run', score: result.runScore, label: '3-Mile Run' }
            ];
            return scores.reduce((min, curr) => curr.score < min.score ? curr : min);
        } else {
            const scores = [
                { event: 'mtc', score: result.mtcScore, label: 'Movement to Contact' },
                { event: 'al', score: result.alScore, label: 'Ammo Can Lifts' },
                { event: 'manuf', score: result.manufScore, label: 'Maneuver Under Fire' }
            ];
            return scores.reduce((min, curr) => curr.score < min.score ? curr : min);
        }
    };

    const weakest = getWeakestEvent();
    const pointsToFirstClass = 235 - result.totalScore;

    // Get recommendations based on weakest event
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
    const matchingExercises = getRecommendedExercises(recommendations.exercises);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-orange-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                    Improvement Plan
                </h4>
                <span className="text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full">
                    {pointsToFirstClass} pts to 1st Class
                </span>
            </div>

            {/* Limiting Factor */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-orange-600" />
                    <span className="font-semibold text-orange-800 dark:text-orange-300">Limiting Factor: {weakest.label}</span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-400">
                    Your {weakest.label.toLowerCase()} score ({weakest.score} pts) is holding back your overall score.
                    Focus training here for the biggest improvement.
                </p>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                    <Dumbbell size={16} className="text-marine-red" />
                    {recommendations.title}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{recommendations.focus}</p>

                {/* Tips */}
                <ul className="space-y-1 mb-4">
                    {recommendations.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                            {tip}
                        </li>
                    ))}
                </ul>

                {/* Recommended HITT Exercises */}
                {matchingExercises.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                            Recommended HITT Exercises
                        </p>
                        <div className="space-y-2">
                            {matchingExercises.map((ex) => (
                                <div key={ex.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-600">
                                    <div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{ex.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{ex.equipment}</span>
                                    </div>
                                    {ex.url && (
                                        <a
                                            href={ex.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-marine-red hover:underline"
                                        >
                                            <PlayCircle size={14} /> Demo
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
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
        weeks: [
            {
                week: 1,
                focus: "Movement Foundation",
                days: [
                    { day: "Mon", workout: "Sprint work: 6x100m, full recovery + ammo can practice 3x10" },
                    { day: "Tue", workout: "Strength: Deadlifts 5x5, overhead press 4x8" },
                    { day: "Wed", workout: "MTC practice: 880yd time trial at 80% effort" },
                    { day: "Thu", workout: "Upper body: Push press, bent rows, farmer carries" },
                    { day: "Fri", workout: "MANUF practice: crawls, buddy drags, sprint work" },
                    { day: "Sat", workout: "Active recovery: ruck walk 2 miles" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 2,
                focus: "Conditioning Base",
                days: [
                    { day: "Mon", workout: "Sprint ladders: 50-100-150-200-150-100-50m" },
                    { day: "Tue", workout: "Ammo can EMOM: 10 lifts every minute x10" },
                    { day: "Wed", workout: "Tempo run: 1 mile at MTC pace" },
                    { day: "Thu", workout: "Strength: Power cleans, front squats" },
                    { day: "Fri", workout: "Combat circuit: sprints, carries, crawls" },
                    { day: "Sat", workout: "Long ruck: 3 miles" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 3,
                focus: "Event-Specific Training",
                days: [
                    { day: "Mon", workout: "MTC repeats: 440yd x4 at race pace" },
                    { day: "Tue", workout: "Ammo can endurance: 3x2min max effort" },
                    { day: "Wed", workout: "Agility: shuttle runs, cone drills, direction changes" },
                    { day: "Thu", workout: "Strength: Heavy deadlifts, weighted carries" },
                    { day: "Fri", workout: "Full MANUF walkthrough at 75%" },
                    { day: "Sat", workout: "Easy conditioning" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 4,
                focus: "Recovery Week",
                days: [
                    { day: "Mon", workout: "Light sprints, mobility work" },
                    { day: "Tue", workout: "Ammo can technique focus - light weight" },
                    { day: "Wed", workout: "Easy 1 mile jog" },
                    { day: "Thu", workout: "Light strength maintenance" },
                    { day: "Fri", workout: "Movement practice, no intensity" },
                    { day: "Sat", workout: "Stretching, foam rolling" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 5,
                focus: "Power Development",
                days: [
                    { day: "Mon", workout: "Hill sprints: 8x50m, walk down recovery" },
                    { day: "Tue", workout: "Ammo can: 4x90 sec, 2min rest between" },
                    { day: "Wed", workout: "MTC pace work: 880yd at goal time" },
                    { day: "Thu", workout: "Olympic lifts: cleans, snatches" },
                    { day: "Fri", workout: "MANUF timed practice" },
                    { day: "Sat", workout: "Easy ruck" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 6,
                focus: "Race Simulation",
                days: [
                    { day: "Mon", workout: "Full CFT practice at 90% effort" },
                    { day: "Tue", workout: "Recovery: light movement only" },
                    { day: "Wed", workout: "Sprint intervals: 10x60m" },
                    { day: "Thu", workout: "Ammo can max test + 2 more sets" },
                    { day: "Fri", workout: "MANUF components separately at race pace" },
                    { day: "Sat", workout: "Light conditioning" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 7,
                focus: "Peak Performance",
                days: [
                    { day: "Mon", workout: "Short, sharp sprints: 6x40m all out" },
                    { day: "Tue", workout: "Ammo can practice: 2x1min at race pace" },
                    { day: "Wed", workout: "MTC at 100%: final hard effort" },
                    { day: "Thu", workout: "Light strength, focus on explosiveness" },
                    { day: "Fri", workout: "Easy movement, strides" },
                    { day: "Sat", workout: "Rest" },
                    { day: "Sun", workout: "Rest" }
                ]
            },
            {
                week: 8,
                focus: "Taper & Test",
                days: [
                    { day: "Mon", workout: "Light jog, 4x strides" },
                    { day: "Tue", workout: "Easy ammo can work - 2x10 reps" },
                    { day: "Wed", workout: "2x200m at race pace" },
                    { day: "Thu", workout: "Rest - stay loose" },
                    { day: "Fri", workout: "Rest - hydrate, sleep well" },
                    { day: "Sat", workout: "CFT TEST DAY" },
                    { day: "Sun", workout: "Recovery" }
                ]
            }
        ]
    }
};

const PFTPrep = () => {
    const [testType, setTestType] = useState('pft');
    const [mode, setMode] = useState('calculator'); // calculator, planner, training
    const [expandedWeek, setExpandedWeek] = useState(1);
    const [plannerTarget, setPlannerTarget] = useState(285);
    const [solveFor, setSolveFor] = useState('run'); // run, upper, plank, mtc, al, manuf
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
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-marine-red/10 rounded-lg">
                        <Calculator className="w-8 h-8 text-marine-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 m-0">PFT/CFT Calculator</h1>
                        <p className="text-gray-500">Calculate your physical fitness score</p>
                    </div>
                </div>
                
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${testType === 'pft' ? 'bg-white text-marine-red shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => { 
                            setTestType('pft'); 
                            setSolveFor('run');
                            setResult(null); 
                            setError(null); 
                        }}
                    >
                        PFT (Physical Fitness Test)
                    </button>
                    <button 
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${testType === 'cft' ? 'bg-white text-marine-red shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                        onClick={() => { 
                            setTestType('cft'); 
                            setSolveFor('mtc');
                            setResult(null); 
                            setError(null); 
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
                </motion.div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        {mode === 'planner' ? <Target className="w-5 h-5 text-gray-400" /> : <Activity className="w-5 h-5 text-gray-400" />}
                        {mode === 'planner' ? 'Define Your Scenario' : 'Enter Your Stats'}
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select name="gender" value={inputs.gender} onChange={handleInputChange} className="input-field">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
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
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                <label className="block text-sm font-bold text-blue-900 mb-2">Target Total Score (0-300)</label>
                                <input 
                                    type="number" 
                                    value={plannerTarget}
                                    onChange={(e) => setPlannerTarget(parseInt(e.target.value) || 0)}
                                    className="input-field text-lg font-bold text-blue-900"
                                    min="0"
                                    max="300"
                                />
                                <p className="text-xs text-blue-700 mt-1">First Class: 235+ | Promotion Rec: ~285</p>
                            </div>
                        )}

                        {testType === 'pft' ? (
                            <>
                                {/* Upper Body Section */}
                                <div className={`space-y-3 transition-all ${mode === 'planner' && solveFor === 'upper' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-gray-700">Upper Body Event</label>
                                        {mode === 'planner' && (
                                            <button 
                                                onClick={() => setSolveFor('upper')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'upper' ? 'bg-marine-red text-white border-marine-red' : 'bg-white text-gray-500 border-gray-200'}`}
                                            >
                                                {solveFor === 'upper' ? 'Solving...' : 'Solve for this'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="upperBodyType" value="pullups" checked={inputs.upperBodyType === 'pullups'} onChange={handleInputChange} className="text-marine-red focus:ring-marine-red" />
                                            <span>Pull-ups</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
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
                                        <label className="block text-sm font-medium text-gray-700">Plank</label>
                                        {mode === 'planner' && (
                                            <button 
                                                onClick={() => setSolveFor('plank')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'plank' ? 'bg-marine-red text-white border-marine-red' : 'bg-white text-gray-500 border-gray-200'}`}
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
                                        <label className="block text-sm font-medium text-gray-700">3-Mile Run</label>
                                        {mode === 'planner' && (
                                            <button 
                                                onClick={() => setSolveFor('run')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'run' ? 'bg-marine-red text-white border-marine-red' : 'bg-white text-gray-500 border-gray-200'}`}
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
                                        <label className="block text-sm font-medium text-gray-700">Movement to Contact (880 yds)</label>
                                        {mode === 'planner' && (
                                            <button 
                                                onClick={() => setSolveFor('mtc')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'mtc' ? 'bg-marine-red text-white border-marine-red' : 'bg-white text-gray-500 border-gray-200'}`}
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
                                        <label className="block text-sm font-medium text-gray-700">Ammo Can Lifts (2 mins)</label>
                                        {mode === 'planner' && (
                                            <button 
                                                onClick={() => setSolveFor('al')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'al' ? 'bg-marine-red text-white border-marine-red' : 'bg-white text-gray-500 border-gray-200'}`}
                                            >
                                                {solveFor === 'al' ? 'Solving...' : 'Solve for this'}
                                            </button>
                                        )}
                                    </div>
                                    <input type="number" name="ammoLifts" placeholder="Reps" value={inputs.ammoLifts} onChange={handleInputChange} className="input-field" />
                                </div>

                                <div className={`transition-all ${mode === 'planner' && solveFor === 'manuf' ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Maneuver Under Fire</label>
                                        {mode === 'planner' && (
                                            <button 
                                                onClick={() => setSolveFor('manuf')}
                                                className={`text-xs px-2 py-1 rounded border ${solveFor === 'manuf' ? 'bg-marine-red text-white border-marine-red' : 'bg-white text-gray-500 border-gray-200'}`}
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
                                    <span className="text-sm text-gray-700">Test conducted at Altitude (4500ft+)</span>
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
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
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
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-600">Points from Locked Events</span>
                                                <span className="font-bold text-gray-900">{result.currentPoints}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Points Needed</span>
                                                <span className="font-bold text-blue-600">{result.pointsNeeded}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 italic text-center">
                                            Based on simplified scoring tiers. Aim slightly higher to ensure score.
                                        </p>
                                    </div>
                                ) : (
                                    testType === 'pft' ? (
                                        <>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600">Upper Body</span>
                                            <span className="font-bold text-gray-900">{result.upperBodyScore} pts</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600">Plank</span>
                                            <span className="font-bold text-gray-900">{result.plankScore} pts</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600">Run</span>
                                            <span className="font-bold text-gray-900">{result.runScore} pts</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600">MTC</span>
                                            <span className="font-bold text-gray-900">{result.mtcScore} pts</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600">ACL</span>
                                            <span className="font-bold text-gray-900">{result.alScore} pts</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-600">MANUF</span>
                                            <span className="font-bold text-gray-900">{result.manufScore} pts</span>
                                        </div>
                                    </>
                                ))}

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    {(result.totalScore >= 235) ? (
                                        <>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                                <Trophy size={16} className="text-marine-gold" />
                                                First Class Performance
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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