import React, { useState, useMemo, useEffect } from 'react';
import PullupProgram from './PullupProgram';
import PlankProgram from './PlankProgram';
import {
    calculatePFTScore,
    calculateCFTScore,
    ageGroups,
    pullupMax, pullupMin,
    pushupMax, pushupMin,
    runMax, runMin,
    mtcMax, mtcMin,
    ammoMax, ammoMin,
    manufMax, manufMin,
    getRequiredRunTime,
    getRequiredUpperBodyReps,
    getRequiredPlankTime,
    getRequiredMTC,
    getRequiredAmmoLifts,
    getRequiredMANUF
} from '../utils/pftScoring';
import { hittExercises } from '../data/hittData';
import { returnToRunData } from '../data/rehabData';
import { Calculator, Activity, Trophy, AlertCircle, Target, Calendar, ChevronDown, ChevronUp, CheckCircle2, Dumbbell, PlayCircle, TrendingUp, FileText, ChevronLeft, ChevronRight, Table as TableIcon, X, Footprints, Clock, List, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Walk to Run Program Component
const WalkToRunProgram = () => {
    const { title, phases, intro } = returnToRunData;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Footprints size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Department of Rehabilitation Services - Physical Therapy</p>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-r-lg">
                    {intro}
                </p>
            </div>

            <div className="space-y-6">
                {phases.map((phase, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="bg-marine-red text-white text-xs px-2 py-1 rounded uppercase tracking-wider">{phase.phase}</span>
                                {phase.title}
                            </h4>
                        </div>
                        
                        <div className="p-5">
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{phase.description}</p>
                            
                            {/* Phase II: Plyometrics */}
                            {phase.exercises && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                                            <span className="font-bold text-orange-700 dark:text-orange-300 block mb-1">Rest Between Sets</span>
                                            {phase.restBetweenSets}
                                        </div>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                                            <span className="font-bold text-orange-700 dark:text-orange-300 block mb-1">Rest Between Exercises</span>
                                            {phase.restBetweenExercises}
                                        </div>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-500 font-semibold">
                                                <tr>
                                                    <th className="px-4 py-2 rounded-l-lg">Exercise</th>
                                                    <th className="px-4 py-2">Sets</th>
                                                    <th className="px-4 py-2">Contacts/Set</th>
                                                    <th className="px-4 py-2 rounded-r-lg">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {phase.exercises.map((ex, i) => (
                                                    <tr key={i}>
                                                        <td className="px-4 py-2 font-medium">{ex.name}</td>
                                                        <td className="px-4 py-2">{ex.sets}</td>
                                                        <td className="px-4 py-2">{ex.contactsPerSet}</td>
                                                        <td className="px-4 py-2 font-bold text-gray-900 dark:text-white">{ex.totalContacts}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-gray-50 dark:bg-gray-800 font-bold">
                                                    <td colSpan="3" className="px-4 py-2 text-right">Total Contacts:</td>
                                                    <td className="px-4 py-2">{phase.totalContacts}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    
                                    {phase.guidelines && (
                                        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800">
                                            <h5 className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase mb-2 flex items-center gap-1">
                                                <AlertCircle size={12} /> Guidelines
                                            </h5>
                                            <ul className="list-disc list-inside text-xs text-yellow-800 dark:text-yellow-300 space-y-1">
                                                {phase.guidelines.map((g, i) => (
                                                    <li key={i}>{g}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Phase III: Interval Schedule */}
                            {phase.type === 'interval' && phase.schedule && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-500 font-semibold">
                                            <tr>
                                                <th className="px-4 py-2 rounded-l-lg">Step</th>
                                                <th className="px-4 py-2">Walk</th>
                                                <th className="px-4 py-2">Jog</th>
                                                <th className="px-4 py-2">Reps</th>
                                                <th className="px-4 py-2 rounded-r-lg">Total Time</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {phase.schedule.map((row, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 font-bold text-marine-red">{row.step}</td>
                                                    <td className="px-4 py-2">{row.walk}</td>
                                                    <td className="px-4 py-2">{row.jog}</td>
                                                    <td className="px-4 py-2">{row.reps}</td>
                                                    <td className="px-4 py-2 font-medium">{row.total}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Phase IV: Continuous Schedule */}
                            {phase.type === 'continuous' && phase.schedule && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-500 font-semibold">
                                            <tr>
                                                <th className="px-4 py-2 rounded-l-lg">Week</th>
                                                <th className="px-4 py-2">Run Duration</th>
                                                <th className="px-4 py-2 rounded-r-lg">Frequency</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {phase.schedule.map((row, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 font-bold text-marine-red">{row.step}</td>
                                                    <td className="px-4 py-2">{row.run}</td>
                                                    <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{row.freq}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Event Standards Modal Component
const EventStandardsModal = ({ isOpen, onClose, eventType, gender }) => {
    if (!isOpen) return null;

    const g = gender.toLowerCase();
    
    // Helper to get title and data based on event type
    const getEventData = () => {
        switch (eventType) {
            case 'pullups':
                return { title: 'Pull-up Standards', max: pullupMax, min: pullupMin, type: 'reps' };
            case 'pushups':
                return { title: 'Push-up Standards', max: pushupMax, min: pushupMin, type: 'reps' };
            case 'plank':
                return { title: 'Plank Standards', type: 'plank' };
            case 'run':
                return { title: '3-Mile Run Standards', max: runMax, min: runMin, type: 'time' };
            case 'mtc':
                return { title: 'Movement to Contact Standards', max: mtcMax, min: mtcMin, type: 'time' };
            case 'ammo':
                return { title: 'Ammo Can Lift Standards', max: ammoMax, min: ammoMin, type: 'reps' };
            case 'manuf':
                return { title: 'Maneuver Under Fire Standards', max: manufMax, min: manufMin, type: 'time' };
            default:
                return null;
        }
    };

    const data = getEventData();
    if (!data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
                <div className="bg-marine-red p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <TableIcon size={20} className="text-yellow-400" />
                        {data.title} ({gender === 'male' ? 'Male' : 'Female'})
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-0 overflow-x-auto max-h-[70vh] overflow-y-auto">
                    {data.type === 'plank' ? (
                        <div className="p-6 text-center space-y-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                The plank is not age-dependent.
                            </p>
                            <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold">Max (100 pts)</div>
                                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">3:45</div>
                                </div>
                                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 uppercase font-bold">Min (40 pts)</div>
                                    <div className="text-2xl font-bold text-red-700 dark:text-red-400">0:40</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 uppercase text-xs sticky top-0">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Age Group</th>
                                    <th className="px-6 py-4 text-center text-green-700 dark:text-green-400">Max (100 pts)</th>
                                    <th className="px-6 py-4 text-center text-red-700 dark:text-red-400">Min (40 pts)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {ageGroups.map((age) => (
                                    <tr key={age} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{age}</td>
                                        <td className="px-6 py-4 text-center font-medium">
                                            {data.type === 'time' 
                                                ? formatTime(data.max[g][age])
                                                : data.max[g][age]
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">
                                            {data.type === 'time' 
                                                ? formatTime(data.min[g][age])
                                                : data.min[g][age]
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 text-xs text-center text-gray-500">
                    Based on MCO 6100.13A Standards
                </div>
            </motion.div>
        </div>
    );
};


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

// Component for collapsible sections with toggle
const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between mb-2 pb-1 border-b border-gray-100 dark:border-gray-700/50 group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-sm px-1"
            >
                <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {title}
                </h6>
                <div
                    className="text-xs flex items-center gap-1 text-marine-red font-semibold group-hover:underline bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500 shadow-sm"
                >
                    {isOpen ? 'Hide' : 'Show'}
                    {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-2 text-left">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Component to show improvement recommendations based on weak events
const ImprovementRecommendations = ({ result, testType, upperBodyType }) => {
    // Identify all weak events (score < 80)
    const getWeakEvents = () => {
        const threshold = 80;
        let eventScores = [];
        
        if (testType === 'pft') {
            eventScores = [
                { event: 'upper', score: result.upperBodyScore || 0, label: 'Upper Body' },
                { event: 'plank', score: result.plankScore || 0, label: 'Plank' },
                { event: 'run', score: result.runScore || 0, label: '3-Mile Run' }
            ];
        } else {
            eventScores = [
                { event: 'mtc', score: result.mtcScore || 0, label: 'Movement to Contact' },
                { event: 'al', score: result.alScore || 0, label: 'Ammo Can Lifts' },
                { event: 'manuf', score: result.manufScore || 0, label: 'Maneuver Under Fire' }
            ];
        }

        // Filter for scores below threshold, or if none, take the absolute lowest
        const weakEvents = eventScores.filter(s => s.score < threshold);
        
        if (weakEvents.length === 0) {
            // If all are above 80 but still not 1st class (unlikely but possible if < 235 total)
            // Or if user just wants to improve the lowest one
            return [eventScores.reduce((min, curr) => curr.score < min.score ? curr : min)];
        }
        
        return weakEvents;
    };

    const weakEvents = getWeakEvents();
    const pointsToFirstClass = Math.max(0, 235 - (result.totalScore || 0));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-orange-600" />
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    Performance Coaching
                </h4>
                {(result.totalScore || 0) < 235 && (
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

                            <div className="space-y-6">
                                {/* Tips */}
                                <CollapsibleSection title="Pro Tips">
                                    <ul className="space-y-2">
                                        {recommendations.tips.map((tip, i) => (
                                            <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CollapsibleSection>

                                {/* Recommended HITT Exercises */}
                                {matchingExercises.length > 0 && (
                                    <CollapsibleSection title="HITT Center Tools">
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
                                    </CollapsibleSection>
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

// Helper to format seconds to M:SS
const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const PerformanceStandardsModal = ({ isOpen, onClose, testType, gender }) => {
    const g = gender.toLowerCase();

    // Format time helper
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileText size={20} className="text-yellow-400" />
                        {testType.toUpperCase()} Performance Standards ({gender === 'male' ? 'Male' : 'Female'})
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="overflow-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 uppercase text-xs sticky top-0">
                            <tr>
                                <th className="px-4 py-3 font-bold">Age Group</th>
                                {testType === 'pft' ? (
                                    <>
                                        <th className="px-4 py-3 text-center">Pull-ups<br/><span className="text-[10px] normal-case">(Max/Min)</span></th>
                                        <th className="px-4 py-3 text-center">Push-ups<br/><span className="text-[10px] normal-case">(Max/Min)</span></th>
                                        <th className="px-4 py-3 text-center">Plank<br/><span className="text-[10px] normal-case">(Max/Min)</span></th>
                                        <th className="px-4 py-3 text-center">3-Mile Run<br/><span className="text-[10px] normal-case">(Max/Min)</span></th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-4 py-3 text-center">MTC<br/><span className="text-[10px] normal-case">(Max/Min)</span></th>
                                        <th className="px-4 py-3 text-center">Ammo Lifts<br/><span className="text-[10px] normal-case">(Max/Min)</span></th>
                                        <th className="px-4 py-3 text-center">MANUF<br/><span className="text-[10px] normal-case">(Max/Min)</span></th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {ageGroups.map((age) => (
                                <tr key={age} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{age}</td>
                                    {testType === 'pft' ? (
                                        <>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                                                {pullupMax[g][age]} / {pullupMin[g][age]}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                                                {pushupMax[g][age]} / {pushupMin[g][age]}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                                                3:45 / 0:40
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                                                {formatTime(runMax[g][age])} / {formatTime(runMin[g][age])}
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                                                {formatTime(mtcMax[g][age])} / {formatTime(mtcMin[g][age])}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                                                {ammoMax[g][age]} / {ammoMin[g][age]}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">
                                                {formatTime(manufMax[g][age])} / {formatTime(manufMin[g][age])}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const BASE_URL = import.meta.env.BASE_URL;

const visualPlans = {
    pft: {
        title: "PFT Workout Cards",
        path: `${BASE_URL}pft/`,
        count: 16,
        description: "Official visual training guides for PFT events"
    },
    cft: {
        title: "CFT Workout Cards",
        path: `${BASE_URL}cft/`,
        count: 125,
        description: "Comprehensive CFT preparation guide and daily schedule",
        fileOffset: 2
    }
};

const PFTPrep = () => {
    const [testType, setTestType] = useState('pft'); // 'pft' or 'cft'
    const [gender, setGender] = useState('male');
    const [ageGroup, setAgeGroup] = useState('21-25');
    const [altitude, setAltitude] = useState(false);
    const [activeTab, setActiveTab] = useState('calculator'); // 'calculator', 'cards', 'pullup'

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

    // Helper to get the actual image filename/index
    const getPage = (index, type) => {
        if (type === 'cft') {
            // Apply offset because first 2 files were deleted
            const offset = visualPlans.cft.fileOffset || 0;
            return index + 1 + offset; 
        }
        return index + 1;
    };

    const padPage = (num) => num.toString().padStart(4, '0');

    const [imageError, setImageError] = useState(false);

    // Reset error when card changes
    useEffect(() => {
        setImageError(false);
    }, [currentCardIndex, testType]);

    const getImageSource = () => {
        const pageNum = padPage(getPage(currentCardIndex, testType));
        if (testType === 'pft') {
            // Use hyphens instead of spaces for better web compatibility
            return `${visualPlans.pft.path}PFT-Prep-Program_page-${pageNum}.jpg`;
        }
        return `${visualPlans.cft.path}CFT-PREP-GUIDANCE_page-${pageNum}.jpg`;
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
    }, [testType, gender, ageGroup, altitude, pullups, pushups, plankTime, runTime, upperBodyType, mtcTime, alReps, manufTime]);

    // State for Event Standards Modal
    const [activeModalEvent, setActiveModalEvent] = useState(null);

    // State for Performance Standards Modal
    const [showStandardsModal, setShowStandardsModal] = useState(false);

    // Format time (seconds to MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const TimeInput = ({ label, totalSeconds, onChange, onShowTable }) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const handleMinChange = (e) => {
            const val = parseInt(e.target.value);
            const newMin = isNaN(val) ? 0 : Math.max(0, val);
            onChange(newMin * 60 + seconds);
        };

        const handleSecChange = (e) => {
            const val = parseInt(e.target.value);
            const newSec = isNaN(val) ? 0 : Math.min(59, Math.max(0, val));
            onChange(minutes * 60 + newSec);
        };

        return (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                    {onShowTable && (
                        <button 
                            onClick={onShowTable}
                            className="text-xs flex items-center gap-1 text-marine-red font-semibold hover:underline bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500 shadow-sm"
                        >
                            <TableIcon size={12} /> Table
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <input
                            type="number"
                            value={minutes}
                            onChange={handleMinChange}
                            className="w-full text-center text-lg font-bold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-3"
                            min={0}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium uppercase">Min</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">:</span>
                    <div className="relative flex-1">
                        <input
                            type="number"
                            value={seconds}
                            onChange={handleSecChange}
                            className="w-full text-center text-lg font-bold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-3"
                            min={0}
                            max={59}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium uppercase">Sec</span>
                    </div>
                </div>
            </div>
        );
    };

    const NumberInput = ({ label, value, onChange, max, onShowTable }) => (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                {onShowTable && (
                    <button 
                        onClick={onShowTable}
                        className="text-xs flex items-center gap-1 text-marine-red font-semibold hover:underline bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500 shadow-sm"
                    >
                        <TableIcon size={12} /> Table
                    </button>
                )}
            </div>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        onChange(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full text-center text-lg font-bold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-3"
                    min={0}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium uppercase">Reps</span>
            </div>
        </div>
    );

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
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('calculator')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
                    onClick={() => setActiveTab('cards')}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'cards'
                            ? 'border-marine-red text-marine-red'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <FileText size={16} />
                        Workout Cards
                    </div>
                </button>
                {testType === 'pft' && (
                    <button
                        onClick={() => setActiveTab('pullup')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'pullup'
                                ? 'border-marine-red text-marine-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Dumbbell size={16} />
                            Pull-up Program
                        </div>
                    </button>
                )}
                {testType === 'pft' && (
                    <button
                        onClick={() => setActiveTab('plank')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'plank'
                                ? 'border-marine-red text-marine-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Shield size={16} />
                            Plank Program
                        </div>
                    </button>
                )}
                {testType === 'pft' && (
                    <button
                        onClick={() => setActiveTab('walk_run')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'walk_run'
                                ? 'border-marine-red text-marine-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <Footprints size={16} />
                            Walk to Run
                        </div>
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {activeTab === 'calculator' && (
                    <div className="space-y-8">
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
                                        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-full">
                                            <button
                                                onClick={() => setGender('male')}
                                                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                                                    gender === 'male' 
                                                        ? 'bg-white dark:bg-gray-600 text-marine-red shadow-sm' 
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                                }`}
                                            >
                                                Male
                                            </button>
                                            <button
                                                onClick={() => setGender('female')}
                                                className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                                                    gender === 'female' 
                                                        ? 'bg-white dark:bg-gray-600 text-marine-red shadow-sm' 
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                                                }`}
                                            >
                                                Female
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age Group</label>
                                        <select
                                            value={ageGroup}
                                            onChange={(e) => setAgeGroup(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red"
                                        >
                                            {ageGroups.map(group => (
                                                <option key={group} value={group}>{group}</option>
                                            ))}
                                        </select>
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
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Upper Body Event</label>
                                                <div className="flex gap-2 text-xs">
                                                    <button
                                                        onClick={() => setUpperBodyType('pullups')}
                                                        className={`px-3 py-1 rounded-full transition-colors ${upperBodyType === 'pullups' ? 'bg-marine-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        Pull-ups
                                                    </button>
                                                    <button
                                                        onClick={() => setUpperBodyType('pushups')}
                                                        className={`px-3 py-1 rounded-full transition-colors ${upperBodyType === 'pushups' ? 'bg-marine-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        Push-ups
                                                    </button>
                                                </div>
                                            </div>
                                            <NumberInput
                                                label={upperBodyType === 'pullups' ? "Pull-up Reps" : "Push-up Reps"}
                                                value={upperBodyType === 'pullups' ? pullups : pushups}
                                                onChange={upperBodyType === 'pullups' ? setPullups : setPushups}
                                                max={upperBodyType === 'pullups' ? 30 : 100}
                                                onShowTable={() => setActiveModalEvent(upperBodyType)}
                                            />
                                        </div>

                                        {/* Plank */}
                                        <TimeInput
                                            label="Plank Duration"
                                            totalSeconds={plankTime}
                                            onChange={setPlankTime}
                                            onShowTable={() => setActiveModalEvent('plank')}
                                        />

                                        {/* Run */}
                                        <TimeInput
                                            label="3-Mile Run Time"
                                            totalSeconds={runTime}
                                            onChange={setRunTime}
                                            onShowTable={() => setActiveModalEvent('run')}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* MTC */}
                                        <TimeInput
                                            label="Movement to Contact (880 yds)"
                                            totalSeconds={mtcTime}
                                            onChange={setMtcTime}
                                            onShowTable={() => setActiveModalEvent('mtc')}
                                        />

                                        {/* Ammo Lifts */}
                                        <NumberInput
                                            label="Ammo Can Lifts (2 mins)"
                                            value={alReps}
                                            onChange={setAlReps}
                                            max={150}
                                            onShowTable={() => setActiveModalEvent('ammo')}
                                        />

                                        {/* MANUF */}
                                        <TimeInput
                                            label="Maneuver Under Fire"
                                            totalSeconds={manufTime}
                                            onChange={setManufTime}
                                            onShowTable={() => setActiveModalEvent('manuf')}
                                        />

                                        {/* Altitude Adjustment */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 border-l-4 border-l-blue-500 dark:border-l-blue-400">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={altitude}
                                                        onChange={(e) => setAltitude(e.target.checked)}
                                                        className="w-5 h-5 rounded border-gray-300 text-marine-red focus:ring-marine-red"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-medium text-blue-900 dark:text-blue-100">High Altitude (&gt;4,500 ft MSL)</span>
                                                    <span className="block text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                        Adjusts minimum requirements for MTC and MANUF events per MCO 6100.13A.
                                                    </span>
                                                </div>
                                            </label>
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

                                {altitude && (
                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded border border-yellow-200 dark:border-yellow-800 flex items-start gap-2">
                                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                        <span>Scores calculated with high altitude consideration (&gt;4,500 ft MSL). Results are for reference only; consult MCO 6100.13A for official adjustments.</span>
                                    </div>
                                )}

                                <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Performance Standards</h4>
                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                                            <div className="font-bold text-green-700 dark:text-green-300">1st Class</div>
                                            <div className="text-green-600 dark:text-green-400">235 - 300</div>
                                        </div>
                                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                                            <div className="font-bold text-yellow-700 dark:text-yellow-300">2nd Class</div>
                                            <div className="text-yellow-600 dark:text-yellow-400">200 - 234</div>
                                        </div>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                                            <div className="font-bold text-orange-700 dark:text-orange-300">3rd Class</div>
                                            <div className="text-orange-600 dark:text-orange-400">120 - 199</div>
                                        </div>
                                    </div>
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

                    {/* Performance Standards Button */}
                    <button
                        onClick={() => setShowStandardsModal(true)}
                        className="w-full mt-6 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <FileText size={18} />
                        View {testType.toUpperCase()} Performance Standards
                    </button>
                </div>
                )}

                {activeTab === 'cards' && (
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
                                    src={getImageSource()}
                                    alt={`${testType.toUpperCase()} Card ${currentCardIndex + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                    }}
                                />

                                {/* Navigation Overlay */}
                            <div className="absolute inset-0 flex items-center justify-between p-4">
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

                {activeTab === 'pullup' && (
                    <PullupProgram />
                )}

                {activeTab === 'plank' && (
                    <PlankProgram />
                )}

                {activeTab === 'walk_run' && (
                    <WalkToRunProgram />
                )}
            </div>

            <AnimatePresence>
                {activeModalEvent && (
                    <EventStandardsModal
                        isOpen={!!activeModalEvent}
                        onClose={() => setActiveModalEvent(null)}
                        eventType={activeModalEvent}
                        gender={gender}
                    />
                )}
            </AnimatePresence>

            {/* Performance Standards Modal */}
            <PerformanceStandardsModal
                isOpen={showStandardsModal}
                onClose={() => setShowStandardsModal(false)}
                testType={testType}
                gender={gender}
            />
        </div>
    );
};

export default PFTPrep;