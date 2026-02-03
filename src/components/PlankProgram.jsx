import React, { useState } from 'react';
import { Shield, CheckCircle2, ChevronLeft, ChevronRight, ImageIcon, Target } from 'lucide-react';

const BASE_URL = import.meta.env.BASE_URL;

const plankVisuals = [
    `${BASE_URL}pft/Plank-Progression_Wk1-Wk4_page-0001.jpg`,
    `${BASE_URL}pft/Plank-Progression_Wk1-Wk4_page-0002.jpg`,
    `${BASE_URL}pft/Plank-Progression_Wk1-Wk4_page-0003.jpg`,
    `${BASE_URL}pft/Plank-Progression_Wk1-Wk4_page-0004.jpg`
];

const PlankProgram = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === plankVisuals.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? plankVisuals.length - 1 : prev - 1
        );
    };

    return (
        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 min-h-[600px]">
            {/* Header Area */}
            <div className="border-b border-gray-100 dark:border-gray-700 pb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Shield className="text-marine-red" size={24} />
                    Core & Plank Progression
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Build a bulletproof core for the PFT
                </p>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
                {/* Phase Focus */}
                <div className="bg-marine-red/5 border border-marine-red/20 rounded-xl p-6">
                    <h4 className="font-bold text-marine-red mb-2 flex items-center gap-2">
                        <Target size={18} />
                        4-Week Progressive Program
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                        Foundation to Mastery
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        Follow the visual guide below for weekly progression through plank variations and core strengthening exercises.
                    </p>
                </div>

                {/* Form Cues */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
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
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                            <ImageIcon size={20} />
                            Visual Guide
                        </h4>
                        <span className="text-xs font-medium px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                            Page {currentImageIndex + 1} of {plankVisuals.length}
                        </span>
                    </div>

                    <div className="relative aspect-[3/4] w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                        <img
                            src={plankVisuals[currentImageIndex]}
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
            </div>
        </div>
    );
};

export default PlankProgram;
