import React, { useState } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Heart, Info, CheckCircle, AlertTriangle, AlertOctagon, Dumbbell, PlayCircle, TrendingUp, CheckCircle2, AlertCircle, Table as TableIcon, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ageGroups } from '../utils/pftScoring';
import { hittExercises } from '../data/hittData';

// Body Composition Standards Modal
const BodyCompStandardsModal = ({ isOpen, onClose }) => {
    const trapRef = useFocusTrap(isOpen, onClose);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                ref={trapRef}
                role="dialog"
                aria-modal="true"
                aria-label="Body Composition Standards"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
                <div className="bg-marine-red p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <TableIcon size={20} className="text-yellow-400" />
                        Body Composition Standards
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-0 overflow-y-auto max-h-[70vh]">
                    <div className="p-6 space-y-6">
                        {/* WHtR Standards */}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <Activity size={18} className="text-marine-red" />
                                Waist-to-Height Ratio (WHtR)
                            </h4>
                            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-2 font-bold text-gray-700 dark:text-gray-300">Ratio</th>
                                            <th className="px-4 py-2 font-bold text-gray-700 dark:text-gray-300">Classification</th>
                                            <th className="px-4 py-2 font-bold text-gray-700 dark:text-gray-300">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        <tr className="bg-green-50/50 dark:bg-green-900/10">
                                            <td className="px-4 py-2 font-bold text-green-700 dark:text-green-400">&lt; 0.50</td>
                                            <td className="px-4 py-2 text-green-700 dark:text-green-400">Optimal Readiness</td>
                                            <td className="px-4 py-2 text-gray-600 dark:text-gray-400">None</td>
                                        </tr>
                                        <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                                            <td className="px-4 py-2 font-bold text-blue-700 dark:text-blue-400">0.50 - 0.54</td>
                                            <td className="px-4 py-2 text-blue-700 dark:text-blue-400">Compliant</td>
                                            <td className="px-4 py-2 text-gray-600 dark:text-gray-400">None</td>
                                        </tr>
                                        <tr className="bg-red-50/50 dark:bg-red-900/10">
                                            <td className="px-4 py-2 font-bold text-red-700 dark:text-red-400">≥ 0.55</td>
                                            <td className="px-4 py-2 text-red-700 dark:text-red-400">High Risk</td>
                                            <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Secondary Eval</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Body Fat Standards */}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                <AlertCircle size={18} className="text-orange-600" />
                                Max Body Fat % (Secondary Eval)
                            </h4>
                            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-2 font-bold text-gray-700 dark:text-gray-300">Age Group</th>
                                            <th className="px-4 py-2 font-bold text-blue-700 dark:text-blue-400">Male Max %</th>
                                            <th className="px-4 py-2 font-bold text-pink-700 dark:text-pink-400">Female Max %</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        <tr>
                                            <td className="px-4 py-2 font-medium">17-20</td>
                                            <td className="px-4 py-2">18%</td>
                                            <td className="px-4 py-2">26%</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium">21-30</td>
                                            <td className="px-4 py-2">19%</td>
                                            <td className="px-4 py-2">27%</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium">31-40</td>
                                            <td className="px-4 py-2">20%</td>
                                            <td className="px-4 py-2">28%</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium">41+</td>
                                            <td className="px-4 py-2">21%</td>
                                            <td className="px-4 py-2">29%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                * Marines exceeding WHtR standards are measured for body fat percentage. Failure of both assessments constitutes BCP assignment.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Helper to get fat-burning exercises
const getFatBurningExercises = () => {
    return hittExercises.filter(ex => 
        ex.tags.includes('Cardio') || 
        ex.tags.includes('Metabolic') || 
        ex.tags.includes('Full Body')
    ).slice(0, 5);
};

const ImprovementRecommendations = ({ result }) => {
    const exercises = getFatBurningExercises();

    return (
        <div className="mt-8 text-left space-y-6">
            <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-red-600" />
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    Action Plan: Body Composition
                </h4>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                 <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-100 dark:border-red-800/30">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle size={18} className="text-red-600" />
                        <span className="font-bold text-red-800 dark:text-red-300">
                            Status: {result.status}
                        </span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-400 pl-6">
                        Exceeding body composition standards impacts readiness. Immediate action is recommended.
                    </p>
                </div>

                <div className="p-5">
                    <h5 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Dumbbell size={18} className="text-marine-red" />
                        Metabolic Conditioning
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
                        "High-intensity interval training (HITT) is effective for improving body composition."
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nutrition & Lifestyle</h6>
                            <ul className="space-y-2">
                                <li className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Consult the <strong>Nutrition Guide</strong> for fueling strategies.</span>
                                </li>
                                <li className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Prioritize protein intake to retain lean muscle mass.</span>
                                </li>
                                <li className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Aim for 7-9 hours of sleep to regulate cortisol levels.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h6 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Recommended HITT Workouts
                            </h6>
                            <div className="space-y-2">
                                {exercises.map((ex) => (
                                    <div key={ex.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-marine-red/30 transition-colors">
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{ex.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{ex.tags.slice(0, 2).join(', ')}</div>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

const NumberInput = ({ label, value, onChange, min, max, step = 1, placeholder, onShowTable }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between mb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">Range: {min}"-{max}"</span>
                {onShowTable && (
                    <button
                        onClick={onShowTable}
                        className="flex items-center gap-1 text-xs font-bold text-marine-red hover:text-red-700 bg-white dark:bg-gray-600 px-2 py-1 rounded border border-marine-red/20 shadow-sm transition-colors"
                        title="View Standards Table"
                    >
                        <TableIcon size={12} />
                        Table
                    </button>
                )}
            </div>
        </div>
        <div className="relative">
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full text-center text-lg font-bold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-3"
                min={min}
                max={max}
                step={step}
                maxLength={6}
                placeholder={placeholder}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium uppercase">Inches</span>
        </div>
    </div>
);

const BodyComp = () => {
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [gender, setGender] = useState('male');
  const [ageGroup, setAgeGroup] = useState('21-25');
  const [result, setResult] = useState(null);
  const [showStandards, setShowStandards] = useState(false);

  // Round down to nearest 0.5 inch per DoD 1308.03
  const roundDownToHalf = (value) => {
    return Math.floor(value * 2) / 2;
  };

  // Convert inches to feet and inches display
  const inchesToFeetAndInches = (totalInches) => {
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    if (inches === 0) return `${feet} ft`;
    const inchDisplay = inches % 1 === 0.5 ? `${inches}` : `${inches}`;
    return `${feet} ft ${inchDisplay} in`;
  };

  const calculateWhtr = () => {
    if (height && waist) {
      const roundedHeight = roundDownToHalf(parseFloat(height));
      const roundedWaist = roundDownToHalf(parseFloat(waist));
      const whtrValue = roundedWaist / roundedHeight;

      let status, statusLevel, message, requiresSecondary;

      if (whtrValue < 0.50) {
        status = 'OPTIMAL READINESS';
        statusLevel = 'optimal';
        message = 'Outstanding. You significantly exceed body composition standards.';
        requiresSecondary = false;
      } else if (whtrValue < 0.55) {
        status = 'COMPLIANT';
        statusLevel = 'compliant';
        message = 'You meet the DoD body composition standard.';
        requiresSecondary = false;
      } else {
        status = 'HIGH RISK';
        statusLevel = 'fail';
        message = 'You exceed the WHtR standard. A secondary body fat assessment is required.';
        requiresSecondary = true;
      }

      setResult({
        whtr: whtrValue.toFixed(2),
        status,
        statusLevel,
        message,
        requiresSecondary
      });
    }
  };

  const getStatusColor = (level) => {
    switch (level) {
      case 'optimal': return 'text-green-600 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'compliant': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'fail': return 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = (level) => {
    switch (level) {
      case 'optimal': return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'compliant': return <CheckCircle className="w-8 h-8 text-blue-600" />;
      case 'fail': return <AlertOctagon className="w-8 h-8 text-red-600" />;
      default: return <Info className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="p-3 bg-marine-red/10 rounded-xl">
          <Heart className="w-8 h-8 text-marine-red" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white m-0">Body Composition</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Waist-to-Height Ratio (WHtR) Calculator</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card space-y-6"
        >
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-300 text-sm">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                    Per DoD Instruction 1308.03, the Waist-to-Height Ratio (WHtR) is the primary method for assessing body composition.
                    The standard is a WHtR of less than 0.55.
                </p>
            </div>

            <div className="space-y-4">
                {/* Personal Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
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
                    
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age Group</label>
                        <select
                            value={ageGroup}
                            onChange={(e) => setAgeGroup(e.target.value)}
                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-2.5"
                        >
                            {ageGroups.map(group => (
                                <option key={group} value={group}>{group}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-2 space-y-4">
                    <NumberInput
                        label="Height"
                        value={height}
                        onChange={setHeight}
                        min={48}
                        max={96}
                        step={0.5}
                        placeholder="e.g. 70"
                        onShowTable={() => setShowStandards(true)}
                    />

                    <NumberInput
                        label="Waist Circumference"
                        value={waist}
                        onChange={setWaist}
                        min={20}
                        max={60}
                        step={0.5}
                        placeholder="e.g. 34"
                        onShowTable={() => setShowStandards(true)}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Info size={12} /> Measure at the navel (belly button).
                    </p>
                </div>

                <button 
                    onClick={calculateWhtr}
                    disabled={!height || !waist}
                    className="w-full btn mt-6 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg"
                >
                    Calculate WHtR
                </button>
            </div>
        </motion.div>

        <AnimatePresence>
            {result && (
                <motion.div
                    aria-live="polite"
                    aria-atomic="true"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="card flex flex-col justify-center items-center text-center p-8"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`mb-6 p-6 rounded-full ${result.statusLevel === 'fail' ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}
                    >
                        {getStatusIcon(result.statusLevel)}
                    </motion.div>

                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{result.whtr}</h2>
                    <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">Waist-to-Height Ratio</p>

                    <div className={`px-4 py-2 rounded-full font-bold text-sm mb-6 border ${getStatusColor(result.statusLevel)}`}>
                        {result.status}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto mb-6">
                        {result.message}
                    </p>

                    {result.requiresSecondary && (
                         <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg flex items-center gap-3 text-left">
                            <AlertTriangle className="text-red-600 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-red-800 dark:text-red-300 text-sm">Action Required</h4>
                                <p className="text-red-700 dark:text-red-400 text-xs">Report for secondary body fat taping (neck/waist/hips).</p>
                            </div>
                         </div>
                    )}

                    {result.statusLevel === 'fail' && (
                        <ImprovementRecommendations result={result} />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <BodyCompStandardsModal 
        isOpen={showStandards} 
        onClose={() => setShowStandards(false)} 
      />
    </div>
  );
};

export default BodyComp;
