import React from 'react';
import { FileText, X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import {
    ageGroups,
    pullupMax, pushupMax, runMax,
    mtcMax, ammoMax, manufMax,
    getRequiredRunTime, getRequiredUpperBodyReps, getRequiredPlankTime,
    getRequiredMTC, getRequiredAmmoLifts, getRequiredMANUF
} from '../../utils/pftScoring';

const PerformanceStandardsModal = ({ isOpen, onClose, testType, gender }) => {
    const trapRef = useFocusTrap(isOpen, onClose);
    const g = gender.toLowerCase();

    const formatTime = (seconds) => {
        if (seconds == null) return '-';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                ref={trapRef}
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
                                        <th className="px-4 py-3 font-bold">Pull-ups (Max)</th>
                                        <th className="px-4 py-3 font-bold">Push-ups (Max)</th>
                                        <th className="px-4 py-3 font-bold">Plank (Max)</th>
                                        <th className="px-4 py-3 font-bold">3-Mile Run (Max)</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-4 py-3 font-bold">MTC (Max)</th>
                                        <th className="px-4 py-3 font-bold">Ammo Lifts (Max)</th>
                                        <th className="px-4 py-3 font-bold">MANUF (Max)</th>
                                    </>
                                )}
                                <th className="px-4 py-3 font-bold">Min 235 Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ageGroups.map((age, idx) => (
                                <tr key={age} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                                    <td className="px-4 py-3 font-bold text-gray-800 dark:text-gray-200">{age}</td>
                                    {testType === 'pft' ? (
                                        <>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{pullupMax[g]?.[age] || '-'} reps</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{pushupMax[g]?.[age] || '-'} reps</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">3:45 (225s)</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatTime(runMax[g]?.[age])}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatTime(mtcMax[g]?.[age])}</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{ammoMax[g]?.[age] || '-'} reps</td>
                                            <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatTime(manufMax[g]?.[age])}</td>
                                        </>
                                    )}
                                    <td className="px-4 py-3">
                                        <span className="text-xs bg-marine-red/10 text-marine-red px-2 py-1 rounded font-medium">
                                            {testType === 'pft' ? (
                                                `${getRequiredUpperBodyReps('pullups', g, age, 235 - 200) || '?'} PU / ${formatTime(getRequiredRunTime(g, age, 100))} run`
                                            ) : (
                                                `${formatTime(getRequiredMTC(g, age, 100))} / ${getRequiredAmmoLifts(g, age, 100) || '?'} AL`
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-xs text-gray-400">Based on USMC Order 6100.13A CH-4 | Max scores shown for each age group</p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceStandardsModal;
