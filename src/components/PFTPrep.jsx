import React, { useState } from 'react';
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
import { Calculator, Activity, Trophy, AlertCircle, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PFTPrep = () => {
    const [testType, setTestType] = useState('pft');
    const [mode, setMode] = useState('calculator'); // calculator, planner
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

            {/* Planner Mode Toggle */}
            <div className="flex justify-center mb-6">
                <div className="bg-white border border-gray-200 p-1 rounded-lg shadow-sm flex">
                    <button
                        onClick={() => { setMode('calculator'); setResult(null); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'calculator' ? 'bg-marine-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Calculator size={16} /> Calculator
                    </button>
                    <button
                        onClick={() => { setMode('planner'); setResult(null); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === 'planner' ? 'bg-marine-red text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Target size={16} /> Promotion Planner
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
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
                                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                        <Trophy size={16} className="text-marine-gold" />
                                        Performance Insight
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {result.classification === '1st' || (result.classification && result.classification.class === 'first-class')
                                            ? "Outstanding work. Maintain this level of fitness and focus on injury prevention."
                                            : "Good effort. Review the score breakdown to identify your weakest event and focus training there."
                                        }
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PFTPrep;