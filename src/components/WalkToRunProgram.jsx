import React, { useState } from 'react';
import { Footprints, ChevronDown, ChevronUp, Clock, Activity, Target, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { returnToRunData } from '../data/rehabData';

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
                        <p className="text-sm text-gray-500">{intro}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {phases.map((phase, phaseIndex) => (
                        <PhaseCard key={phaseIndex} phase={phase} phaseIndex={phaseIndex} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const PhaseCard = ({ phase, phaseIndex }) => {
    const [isExpanded, setIsExpanded] = useState(phaseIndex === 0);

    const phaseColors = [
        'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
        'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    ];

    const iconColors = [
        'text-green-600 dark:text-green-400',
        'text-blue-600 dark:text-blue-400',
        'text-purple-600 dark:text-purple-400',
        'text-orange-600 dark:text-orange-400',
    ];

    return (
        <div className={`border rounded-lg overflow-hidden ${phaseColors[phaseIndex % phaseColors.length]}`}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-700/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${iconColors[phaseIndex % iconColors.length]}`}>
                        <Activity size={18} />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                            Phase {phaseIndex + 1}: {phase.title}
                        </h4>
                        <p className="text-xs text-gray-500">{phase.type}</p>
                    </div>
                </div>
                {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            <div className="flex items-start gap-2 text-sm">
                                <Target size={14} className="text-marine-red mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-300">{phase.description}</span>
                            </div>

                            {phase.guidelines && phase.guidelines.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <Shield size={12} /> Guidelines
                                    </p>
                                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-1">
                                        {phase.guidelines.map((g, i) => (
                                            <li key={i}>{g}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {phase.schedule && phase.schedule.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <Clock size={12} /> Schedule
                                    </p>
                                    {phase.schedule.map((item, sIdx) => (
                                        <div key={sIdx} className="bg-white/80 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-marine-red text-xs">{item.step}</span>
                                                <span className="text-xs text-gray-500">{item.total}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">{item.activity}</p>
                                            {item.sets && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.sets} sets x {item.reps} reps
                                                </p>
                                            )}
                                            {!item.sets && item.reps > 1 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.reps}x repeats
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {phase.totalContacts && (
                                <div className="text-xs text-gray-500 text-right font-medium">
                                    Total foot contacts: {phase.totalContacts}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalkToRunProgram;
