import React, { useState } from 'react';
import { Heart, Info, CheckCircle, AlertTriangle, AlertOctagon, Dumbbell, PlayCircle, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hittExercises } from '../data/hittData';

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

const BodyComp = () => {
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [gender, setGender] = useState('');
  const [result, setResult] = useState(null);

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

  const generateHeightOptions = (start, end, step) => {
    const options = [];
    for (let i = start; i <= end; i += step) {
      options.push(
        <option key={i} value={i}>
          {i}" ({inchesToFeetAndInches(i)})
        </option>
      );
    }
    return options;
  };

  const generateOptions = (start, end, step) => {
    const options = [];
    for (let i = start; i <= end; i += step) {
      options.push(<option key={i} value={i}>{i}"</option>);
    }
    return options;
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height (Inches)</label>
                    <select
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Height</option>
                        {generateHeightOptions(50, 96, 0.5)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Waist Circumference (Inches)</label>
                    <select
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        className="input-field"
                    >
                        <option value="">Select Waist</option>
                        {generateOptions(20, 60, 0.5)}
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Measure at the navel (belly button).</p>
                </div>

                <button 
                    onClick={calculateWhtr}
                    disabled={!height || !waist}
                    className="w-full btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Calculate WHtR
                </button>
            </div>
        </motion.div>

        <AnimatePresence>
            {result && (
                <motion.div
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
    </div>
  );
};

export default BodyComp;
