import React, { useState } from 'react';
import { Footprints, ChevronDown, ChevronUp, Clock, Activity, Target, Shield, CheckCircle2 } from 'lucide-react';
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
        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    ];

    const iconColors = [
        'text-green-600 dark:text-green-400',
        'text-blue-600 dark:text-blue-400',
        'text-purple-600 dark:text-purple-400',
        'text-orange-600 dark:text-orange-400',
        'text-red-600 dark:text-red-400'
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
                            Phase {phaseIndex + 1}: {phase.name}
                        </h4>
                        <p className="text-xs text-gray-500">{phase.duration} | {phase.frequency}</p>
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
                            {phase.goal && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Target size={14} className="text-marine-red mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300"><strong>Goal:</strong> {phase.goal}</span>
                                </div>
                            )}

                            {phase.warmup && (
                                <div className="flex items-start gap-2 text-sm">
                                    <Clock size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300"><strong>Warm-up:</strong> {phase.warmup}</span>
                                </div>
                            )}

                            {phase.sessions && phase.sessions.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <Activity size={12} /> Sessions
                                    </p>
                                    {phase.sessions.map((session, sIdx) => (
                                        <div key={sIdx} className="bg-white/80 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-marine-red text-xs">{session.week}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">{session.workout}</p>
                                            {session.totalTime && (
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <Clock size={10} /> Total: {session.totalTime}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {phase.notes && (
                                <div className="flex items-start gap-2 text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg">
                                    <Shield size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300"><strong>Note:</strong> {phase.notes}</span>
                                </div>
                            )}

                            {phase.criteria && (
                                <div className="flex items-start gap-2 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                                    <CheckCircle2 size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 dark:text-gray-300"><strong>Progress Criteria:</strong> {phase.criteria}</span>
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
