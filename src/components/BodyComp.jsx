import React, { useState, useMemo } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  Heart,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Dumbbell,
  PlayCircle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Table as TableIcon,
  X,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ageGroups } from '../utils/pftScoring';
import { hittExercises } from '../data/hittData';
import { heightWaistTable, bodyFatStandards, WHTR_STANDARD, performanceConsiderations } from '../data/bodyCompData';
import { roundDownToHalf, getMaxWaist, evaluateBodyComp } from '../utils/bodyCompScoring';

// Body Composition Standards Modal
const BodyCompStandardsModal = ({ isOpen, onClose }) => {
  const trapRef = useFocusTrap(isOpen, onClose);
  const [showFullTable, setShowFullTable] = useState(false);

  if (!isOpen) return null;

  // Show a subset or all rows
  const displayRows = showFullTable
    ? heightWaistTable
    : heightWaistTable.filter((r) => r.height >= 60 && r.height <= 78);

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
            {/* WHtR Standard */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Activity size={18} className="text-marine-red" />
                WHtR Standard
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                The USMC WHtR standard is <strong>&le; {WHTR_STANDARD}</strong>, regardless of sex. Marines exceeding
                their maximum waist measurement undergo a body fat evaluation.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
                Per MARADMIN 066/26 (as modified by MARADMIN 073/26)
              </p>
            </div>

            {/* Height / Max Waist Table */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <TableIcon size={18} className="text-marine-red" />
                Height / Max Waist Table
              </h4>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-xs sticky top-0">
                    <tr>
                      <th className="px-4 py-2 font-bold text-gray-700 dark:text-gray-300">Height</th>
                      <th className="px-4 py-2 font-bold text-gray-700 dark:text-gray-300">Max Waist</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {displayRows.map((row) => (
                      <tr key={row.height} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-1.5 font-medium text-gray-900 dark:text-white">{row.height}"</td>
                        <td className="px-4 py-1.5 text-gray-700 dark:text-gray-300">{row.maxWaist}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setShowFullTable(!showFullTable)}
                className="mt-2 text-xs font-semibold text-marine-red hover:text-red-700 flex items-center gap-1"
              >
                {showFullTable ? (
                  <>
                    <ChevronUp size={14} /> Show common heights
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} /> Show all heights (53"–84")
                  </>
                )}
              </button>
            </div>

            {/* Body Fat Standards */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-600" />
                Max Body Fat % (When WHtR Exceeded)
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
                    {['17-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51+'].map((ag) => (
                      <tr key={ag}>
                        <td className="px-4 py-2 font-medium">{ag}</td>
                        <td className="px-4 py-2">{bodyFatStandards.male[ag]}%</td>
                        <td className="px-4 py-2">{bodyFatStandards.female[ag]}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Physical Performance Considerations */}
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Dumbbell size={18} className="text-green-600" />
                Physical Performance Considerations
              </h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                  <p className="font-semibold text-green-800 dark:text-green-300">
                    PFT & CFT &ge; {performanceConsiderations.tier1.minScore}
                  </p>
                  <p className="text-green-700 dark:text-green-400 mt-1">
                    Up to {performanceConsiderations.tier1.male}% body fat (male) /{' '}
                    {performanceConsiderations.tier1.female}% (female)
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <p className="font-semibold text-blue-800 dark:text-blue-300">
                    PFT & CFT &ge; {performanceConsiderations.tier2.minScore}
                  </p>
                  <p className="text-blue-700 dark:text-blue-400 mt-1">
                    +1% above age-group max (capped at {performanceConsiderations.tier1.male}% male /{' '}
                    {performanceConsiderations.tier1.female}% female)
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  * Requires 1st class PFT and CFT in the current semiannual period. Marines who exceed the caps above
                  will be processed for BCP regardless of fitness test scores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper to get fat-burning exercises
const getFatBurningExercises = () => {
  return hittExercises
    .filter((ex) => ex.tags.includes('Cardio') || ex.tags.includes('Metabolic') || ex.tags.includes('Full Body'))
    .slice(0, 5);
};

const ImprovementRecommendations = ({ result }) => {
  const exercises = getFatBurningExercises();

  return (
    <div className="mt-8 text-left space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={20} className="text-red-600" />
        <h4 className="font-bold text-lg text-gray-900 dark:text-white">Action Plan: Body Composition</h4>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-100 dark:border-red-800/30">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={18} className="text-red-600" />
            <span className="font-bold text-red-800 dark:text-red-300">Status: {result.status}</span>
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
                  <span>
                    Consult the <strong>Nutrition Guide</strong> for fueling strategies.
                  </span>
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
                  <div
                    key={ex.id}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-marine-red/30 transition-colors"
                  >
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

const NumberInput = ({ label, value, onChange, min, max, step = 1, placeholder, onShowTable, hint }) => (
  <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
    <div className="flex justify-between mb-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Range: {min}"-{max}"
        </span>
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
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium uppercase">
        Inches
      </span>
    </div>
    {hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{hint}</p>}
  </div>
);

const BodyComp = () => {
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [gender, setGender] = useState('male');
  const [ageGroup, setAgeGroup] = useState('21-25');
  const [bodyFatPercent, setBodyFatPercent] = useState('');
  const [bodyFatMethod, setBodyFatMethod] = useState('tape');
  const [pftScore, setPftScore] = useState('');
  const [cftScore, setCftScore] = useState('');
  const [result, setResult] = useState(null);
  const [showStandards, setShowStandards] = useState(false);

  // Convert inches to feet and inches display
  const inchesToFeetAndInches = (totalInches) => {
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    if (inches === 0) return `${feet} ft`;
    return `${feet} ft ${inches} in`;
  };

  // Compute max waist for current height
  const maxWaistForHeight = useMemo(() => {
    if (!height) return null;
    return getMaxWaist(height);
  }, [height]);

  const handleCalculate = () => {
    if (!height || !waist) return;

    const evalResult = evaluateBodyComp({
      height,
      waist,
      gender,
      ageGroup,
      bodyFatPercent: bodyFatPercent || null,
      bodyFatMethod,
      pftScore,
      cftScore,
    });

    setResult(evalResult);
  };

  const getStatusColor = (level) => {
    switch (level) {
      case 'pass':
        return 'text-green-600 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'fail':
        return 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = (level) => {
    switch (level) {
      case 'pass':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      case 'fail':
        return <AlertOctagon className="w-8 h-8 text-red-600" />;
      default:
        return <Info className="w-8 h-8 text-gray-600" />;
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card space-y-6">
          <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-300 text-sm">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>
              Per MARADMIN 066/26, the Waist-to-Height Ratio (WHtR) is the primary method for assessing body
              composition. The USMC standard is a WHtR of <strong>&le; {WHTR_STANDARD}</strong>, regardless of sex.
              Marines exceeding the WHtR standard undergo a body fat evaluation via tape test or BIA.
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
                  {ageGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
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
                hint={maxWaistForHeight ? `Max waist for your height: ${maxWaistForHeight}"` : undefined}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Info size={12} /> Measure at the navel, parallel to the deck, using a self-tensioning device. Lower of
                two measurements, rounded down to nearest &frac12; inch.
              </p>
            </div>

            {/* Body Fat Section — shown when WHtR is exceeded */}
            {result && result.requiresBodyFat && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertCircle size={18} className="text-orange-600" />
                  Body Fat Evaluation
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  WHtR exceeded. Enter body fat percentage from tape test or BIA to complete evaluation.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Measurement Method
                    </label>
                    <div className="flex gap-2 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-lg w-full">
                      <button
                        onClick={() => setBodyFatMethod('tape')}
                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                          bodyFatMethod === 'tape'
                            ? 'bg-white dark:bg-gray-600 text-marine-red shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        Tape Test
                      </button>
                      <button
                        onClick={() => setBodyFatMethod('bia')}
                        className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all ${
                          bodyFatMethod === 'bia'
                            ? 'bg-white dark:bg-gray-600 text-marine-red shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        BIA
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Body Fat %
                    </label>
                    <input
                      type="number"
                      value={bodyFatPercent}
                      onChange={(e) => setBodyFatPercent(e.target.value)}
                      className="w-full text-center text-lg font-bold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-3"
                      min={1}
                      max={50}
                      step={0.1}
                      placeholder="e.g. 20"
                    />
                  </div>
                </div>

                {/* Physical Performance Considerations */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Dumbbell size={16} className="text-green-600" />
                    Physical Performance Scores (Optional)
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    1st class PFT and CFT scores may increase your allowable body fat percentage.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        PFT Score
                      </label>
                      <input
                        type="number"
                        value={pftScore}
                        onChange={(e) => setPftScore(e.target.value)}
                        className="w-full text-center rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-2"
                        min={0}
                        max={300}
                        placeholder="e.g. 285"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        CFT Score
                      </label>
                      <input
                        type="number"
                        value={cftScore}
                        onChange={(e) => setCftScore(e.target.value)}
                        className="w-full text-center rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-2"
                        min={0}
                        max={300}
                        placeholder="e.g. 285"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleCalculate}
              disabled={!height || !waist}
              className="w-full btn mt-6 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-lg"
            >
              {result && result.requiresBodyFat ? 'Evaluate Body Composition' : 'Calculate WHtR'}
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
                className={`mb-6 p-6 rounded-full ${result.statusLevel === 'fail' ? 'bg-red-50 dark:bg-red-900/30' : result.statusLevel === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}
              >
                {getStatusIcon(result.statusLevel)}
              </motion.div>

              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{result.whtr.toFixed(2)}</h2>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                Waist-to-Height Ratio
              </p>

              {result.maxWaist && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {result.roundedHeight}" height &rarr; max waist: {result.maxWaist}" | your waist:{' '}
                  {result.roundedWaist}"
                </p>
              )}

              <div
                className={`px-4 py-2 rounded-full font-bold text-sm mb-6 border ${getStatusColor(result.statusLevel)}`}
              >
                {result.status}
              </div>

              <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto mb-6">{result.message}</p>

              {/* Body fat details when evaluated */}
              {result.step === 'bodyFat' && (
                <div className="w-full space-y-3 mb-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-left text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Body Fat</span>
                      <span className="font-bold text-gray-900 dark:text-white">{result.bodyFatPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Max Allowed</span>
                      <span className="font-bold text-gray-900 dark:text-white">{result.bodyFatLimit}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Method</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {result.bodyFatMethod === 'bia' ? 'BIA' : 'Tape Test'}
                      </span>
                    </div>
                    {result.usedPerformanceConsideration && (
                      <div className="flex items-center gap-1 mt-2 text-green-700 dark:text-green-400">
                        <Dumbbell size={14} />
                        <span className="text-xs font-semibold">Physical performance consideration applied</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {result.requiresBodyFat && (
                <div className="w-full p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg flex items-center gap-3 text-left">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-300 text-sm">
                      Body Fat Evaluation Required
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-400 text-xs">
                      Enter body fat percentage below to complete the evaluation. Two authorized methods: multi-site
                      tape test and BIA.
                    </p>
                  </div>
                </div>
              )}

              {result.bcp && (
                <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg flex items-center gap-3 text-left">
                  <AlertOctagon className="text-red-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-red-800 dark:text-red-300 text-sm">BCP Assignment</h4>
                    <p className="text-red-700 dark:text-red-400 text-xs">
                      Exceeds both WHtR and body fat standards. Marine shall be processed for the Body Composition
                      Program (BCP) per MCO 6110.3A.
                    </p>
                  </div>
                </div>
              )}

              {result.statusLevel === 'fail' && <ImprovementRecommendations result={result} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BodyCompStandardsModal isOpen={showStandards} onClose={() => setShowStandards(false)} />
    </div>
  );
};

export default BodyComp;
