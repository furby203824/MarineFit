import React, { useState, useEffect } from 'react';
import { Timer, Trophy, Target, PlayCircle, Shield, CheckCircle2, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

const plankLevels = {
    beginner: {
        title: "Foundation (Weeks 1-4)",
        focus: "Build core stability and form",
        visuals: [
            "/pft/Plank-Progression_Wk1-Wk4_page-0001.jpg",
            "/pft/Plank-Progression_Wk1-Wk4_page-0002.jpg",
            "/pft/Plank-Progression_Wk1-Wk4_page-0003.jpg",
            "/pft/Plank-Progression_Wk1-Wk4_page-0004.jpg"
        ],
        workout: [
            { name: "Standard Plank", duration: "30-45 sec", sets: 3, rest: "60 sec" },
            { name: "Side Plank (Left)", duration: "20-30 sec", sets: 2, rest: "30 sec" },
            { name: "Side Plank (Right)", duration: "20-30 sec", sets: 2, rest: "30 sec" },
            { name: "Bird-Dog", duration: "10 reps/side", sets: 3, rest: "45 sec" }
        ]
    },
    intermediate: {
        title: "Progression (Weeks 5-8)",
        focus: "Increase endurance and introduce instability",
        workout: [
            { name: "Standard Plank", duration: "60-90 sec", sets: 3, rest: "60 sec" },
            { name: "Plank with Leg Lift", duration: "30 sec/leg", sets: 3, rest: "45 sec" },
            { name: "Side Plank with Dip", duration: "15 reps/side", sets: 3, rest: "45 sec" },
            { name: "Mountain Climbers", duration: "45 sec", sets: 3, rest: "60 sec" }
        ]
    },
    advanced: {
        title: "Mastery (Weeks 9+)",
        focus: "Max duration and dynamic strength",
        workout: [
            { name: "Weighted Plank", duration: "Max Effort", sets: 3, rest: "90 sec" },
            { name: "3-Way Plank", duration: "60 sec total", sets: 3, rest: "60 sec" },
            { name: "RKC Plank (High Tension)", duration: "30 sec", sets: 4, rest: "45 sec" },
            { name: "Plank Walk-Ups", duration: "20 reps", sets: 3, rest: "60 sec" }
        ]
    }
};

const PlankProgram = () => {
    const [level, setLevel] = useState('beginner');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [level]);

    const nextImage = () => {
        if (plankLevels[level].visuals) {
            setCurrentImageIndex((prev) => 
                prev === plankLevels[level].visuals.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (plankLevels[level].visuals) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? plankLevels[level].visuals.length - 1 : prev - 1
            );
        }
    };

    return (
        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 min-h-[600px]">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Shield className="text-marine-red" size={24} />
                        Core & Plank Progression
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Build a bulletproof core for the PFT
                    </p>
                </div>

                {/* Level Toggles */}
                <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg">
                    {Object.keys(plankLevels).map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setLevel(lvl)}
                            className={`
                                px-4 py-2 rounded-md text-sm font-semibold capitalize transition-all
                                ${level === lvl 
                                    ? 'bg-white dark:bg-gray-700 text-marine-red shadow-sm' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}
                            `}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Stats & Focus */}
                <div className="space-y-6">
                    <div className="bg-marine-red/5 border border-marine-red/20 rounded-xl p-6">
                        <h4 className="font-bold text-marine-red mb-2 flex items-center gap-2">
                            <Target size={18} />
                            Phase Focus
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                            {plankLevels[level].title}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                            {plankLevels[level].focus}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Trophy size={18} className="text-yellow-500" />
                            PFT Goals
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 dark:text-gray-400">Max Score (100 pts)</span>
                                    <span className="font-bold text-gray-900 dark:text-white">3:45</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-full"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 dark:text-gray-400">Min Passing (40 pts)</span>
                                    <span className="font-bold text-gray-900 dark:text-white">1:10</span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-500 w-[30%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Workout Card */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                Workout Routine
                            </h4>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                                2-3x per week
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {plankLevels[level].workout.map((exercise, idx) => (
                                <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex items-center justify-between group">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-marine-red/10 text-marine-red font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-gray-900 dark:text-white group-hover:text-marine-red transition-colors">
                                                {exercise.name}
                                            </h5>
                                            <div className="flex gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Timer size={14} /> {exercise.duration}
                                                </span>
                                                <span>•</span>
                                                <span>{exercise.sets} Sets</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rest</div>
                                        <div className="font-medium text-gray-700 dark:text-gray-300">{exercise.rest}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
                        <h5 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Form Cues
                        </h5>
                        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                            <li>Keep a straight line from head to heels (don't sag hips or pike up).</li>
                            <li>Engage glutes and quads to take pressure off the lower back.</li>
                            <li>Drive elbows into the ground to protract shoulder blades.</li>
                            <li>Breathe rhythmically; do not hold your breath.</li>
                        </ul>
                    </div>

                    {/* Visual Guide */}
                    {plankLevels[level].visuals && (
                        <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                    <ImageIcon size={20} />
                                    Visual Guide
                                </h4>
                                <span className="text-xs font-medium px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                                    Page {currentImageIndex + 1} of {plankLevels[level].visuals.length}
                                </span>
                            </div>
                            
                            <div className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                <img 
                                    src={plankLevels[level].visuals[currentImageIndex]} 
                                    alt={`Visual Guide Page ${currentImageIndex + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                                
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlankProgram;