import React, { useState } from 'react';
import { Table as TableIcon, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import {
    ageGroups,
    pullupMax, pullupMin,
    pushupMax, pushupMin,
    runMax, runMin,
    mtcMax, mtcMin,
    ammoMax, ammoMin,
    manufMax, manufMin
} from '../../utils/pftScoring';

const EventStandardsModal = ({ isOpen, onClose, eventType, gender }) => {
    const trapRef = useFocusTrap(isOpen, onClose);
    const [selectedAge, setSelectedAge] = useState('21-25');

    if (!isOpen) return null;

    const g = gender.toLowerCase();

    const getEventData = () => {
        switch (eventType) {
            case 'pullups':
                return { title: 'Pull-up Standards', max: pullupMax, min: pullupMin, type: 'reps', unit: 'reps' };
            case 'pushups':
                return { title: 'Push-up Standards', max: pushupMax, min: pushupMin, type: 'reps', unit: 'reps' };
            case 'plank':
                return { title: 'Plank Standards', max: { male: { '21-25': 225 }, female: { '21-25': 225 } }, min: { male: { '21-25': 40 }, female: { '21-25': 40 } }, type: 'time', unit: 'seconds' };
            case 'run':
                return { title: '3-Mile Run Standards', max: runMax, min: runMin, type: 'time', unit: 'time' };
            case 'mtc':
                return { title: 'Movement to Contact Standards', max: mtcMax, min: mtcMin, type: 'time', unit: 'time' };
            case 'al':
                return { title: 'Ammo Can Lift Standards', max: ammoMax, min: ammoMin, type: 'reps', unit: 'reps' };
            case 'manuf':
                return { title: 'Maneuver Under Fire Standards', max: manufMax, min: manufMin, type: 'time', unit: 'time' };
            default:
                return null;
        }
    };

    const data = getEventData();
    if (!data) return null;

    const generateScoringTable = () => {
        if (data.type === 'plank') {
            const rows = [];
            for (let pts = 100; pts >= 40; pts -= 5) {
                const ratio = (pts - 40) / 60;
                const seconds = Math.round(40 + ratio * (225 - 40));
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                rows.push({
                    score: pts,
                    value: `${mins}:${secs.toString().padStart(2, '0')} (${seconds}s)`
                });
            }
            return rows;
        }

        const maxVal = data.max[g]?.[selectedAge];
        const minVal = data.min[g]?.[selectedAge];
        if (maxVal == null || minVal == null) return [];

        const rows = [];
        if (data.type === 'reps') {
            const step = maxVal > minVal ? -1 : 1;
            for (let val = maxVal; step > 0 ? val <= minVal : val >= minVal; val += step) {
                const ratio = Math.abs(val - minVal) / Math.abs(maxVal - minVal);
                const score = Math.round(40 + ratio * 60);
                rows.push({ score: Math.min(100, Math.max(40, score)), value: `${val} ${data.unit}` });
            }
        } else {
            const step = maxVal < minVal ? Math.ceil((minVal - maxVal) / 20) : Math.floor((maxVal - minVal) / 20);
            for (let i = 0; i <= 20; i++) {
                const val = maxVal + (step * i);
                if ((step > 0 && val > minVal) || (step < 0 && val < minVal)) break;
                const ratio = Math.abs(val - minVal) / Math.abs(maxVal - minVal);
                const score = Math.round(40 + ratio * 60);
                const mins = Math.floor(val / 60);
                const secs = val % 60;
                rows.push({
                    score: Math.min(100, Math.max(40, score)),
                    value: `${mins}:${secs.toString().padStart(2, '0')}`
                });
            }
        }
        return rows;
    };

    const scoringTable = generateScoringTable();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                ref={trapRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
                <div className="bg-marine-red p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <TableIcon size={20} className="text-yellow-400" />
                        {data.title}
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 uppercase">Gender:</span>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 capitalize">{gender}</span>
                        </div>
                        {data.type !== 'plank' && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 uppercase">Age:</span>
                                <select
                                    value={selectedAge}
                                    onChange={(e) => setSelectedAge(e.target.value)}
                                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                >
                                    {ageGroups.map(ag => (
                                        <option key={ag} value={ag}>{ag}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scoring Table */}
                <div className="max-h-[50vh] overflow-y-auto">
                    {scoringTable.length > 0 ? (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left font-bold text-gray-600 dark:text-gray-300">Points</th>
                                    <th className="px-4 py-2 text-left font-bold text-gray-600 dark:text-gray-300">
                                        {data.type === 'reps' ? 'Reps Required' : 'Time Required'}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {scoringTable.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'} ${row.score === 100 ? 'bg-green-50 dark:bg-green-900/20 font-bold' : ''} ${row.score <= 40 ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
                                    >
                                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">
                                            <span className={`inline-block w-8 text-center rounded px-1 py-0.5 text-xs font-bold ${row.score >= 90 ? 'bg-green-100 text-green-800' : row.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                {row.score}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No scoring data available for this combination.
                        </div>
                    )}
                </div>

                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 text-center">
                    <p className="text-xs text-gray-400">Scores based on USMC Order 6100.13A CH-4</p>
                </div>
            </motion.div>
        </div>
    );
};

export default EventStandardsModal;
