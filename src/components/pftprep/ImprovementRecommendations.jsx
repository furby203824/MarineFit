import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Dumbbell, PlayCircle, TrendingUp, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hittExercises } from '../../data/hittData';

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

const getRecommendedExercises = (criteria) => {
    if (!criteria) return [];
    return hittExercises.filter(ex => {
        const tagMatch = criteria.tags && ex.tags && ex.tags.some(tag =>
            criteria.tags.some(criteriaTag =>
                tag.toLowerCase().includes(criteriaTag.toLowerCase())
            )
        );
        const nameMatch = criteria.exercises && criteria.exercises.some(name =>
            ex.name.toLowerCase().includes(name.toLowerCase())
        );
        return tagMatch || nameMatch;
    }).slice(0, 5);
};

// Collapsible section wrapper
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

const ImprovementRecommendations = ({ result, testType, upperBodyType }) => {
    const getWeakEvents = () => {
        const threshold = 80;
        let eventScores = [];

        if (testType === 'pft') {
            eventScores = [
                { key: 'upper', label: upperBodyType === 'pullups' ? 'Pull-ups' : 'Push-ups', score: result.upperScore },
                { key: 'plank', label: 'Plank', score: result.plankScore },
                { key: 'run', label: '3-Mile Run', score: result.runScore }
            ];
        } else {
            eventScores = [
                { key: 'mtc', label: 'Movement to Contact', score: result.mtcScore },
                { key: 'al', label: 'Ammo Can Lifts', score: result.alScore },
                { key: 'manuf', label: 'Maneuver Under Fire', score: result.manufScore }
            ];
        }

        return eventScores.filter(e => e.score < threshold).sort((a, b) => a.score - b.score);
    };

    const weakEvents = getWeakEvents();

    if (weakEvents.length === 0) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <CheckCircle2 size={24} className="text-green-600 mx-auto mb-2" />
                <p className="font-bold text-green-800 dark:text-green-300">Outstanding Performance!</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">All events scored 80+. Keep up the excellent work!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-marine-red" />
                <h4 className="font-bold text-gray-800 dark:text-white text-sm">Improvement Plan</h4>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {weakEvents.length} event{weakEvents.length > 1 ? 's' : ''} below 80
                </span>
            </div>

            {weakEvents.map(event => {
                let criteria;
                if (testType === 'pft') {
                    if (event.key === 'upper') {
                        criteria = exerciseRecommendations.pft.upper[upperBodyType];
                    } else {
                        criteria = exerciseRecommendations.pft[event.key];
                    }
                } else {
                    criteria = exerciseRecommendations.cft[event.key];
                }

                if (!criteria) return null;

                const matchedExercises = getRecommendedExercises(criteria);

                return (
                    <div key={event.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-500" />
                                <h5 className="font-bold text-gray-800 dark:text-white text-sm">{criteria.title}</h5>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                event.score < 50 ? 'bg-red-100 text-red-700' :
                                event.score < 70 ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                Score: {event.score}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{criteria.focus}</p>

                        {/* Tips */}
                        <CollapsibleSection title="Quick Tips">
                            <ul className="space-y-1.5">
                                {criteria.tips.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                                        <Target size={10} className="text-marine-red mt-0.5 flex-shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </CollapsibleSection>

                        {/* Matched HITT Exercises */}
                        {matchedExercises.length > 0 && (
                            <CollapsibleSection title="Recommended HITT Exercises">
                                <div className="space-y-2">
                                    {matchedExercises.map(ex => (
                                        <div key={ex.id} className="flex items-center justify-between bg-white dark:bg-gray-600 p-2 rounded border border-gray-100 dark:border-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Dumbbell size={14} className="text-marine-red" />
                                                <div>
                                                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{ex.name}</span>
                                                    <span className="text-[10px] text-gray-400 ml-2">{ex.equipment}</span>
                                                </div>
                                            </div>
                                            {ex.url && (
                                                <a href={ex.url} target="_blank" rel="noopener noreferrer"
                                                    className="text-marine-red hover:text-red-700 transition-colors">
                                                    <PlayCircle size={16} />
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleSection>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ImprovementRecommendations;
