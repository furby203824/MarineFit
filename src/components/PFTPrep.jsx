import React, { useState, useMemo, useEffect } from 'react';
import PullupProgram from './PullupProgram';
import PlankProgram from './PlankProgram';
import WalkToRunProgram from './WalkToRunProgram';
import EventStandardsModal from './pftprep/EventStandardsModal';
import PerformanceStandardsModal from './pftprep/PerformanceStandardsModal';
import ImprovementRecommendations from './pftprep/ImprovementRecommendations';
import {
    calculatePFTScore,
    calculateCFTScore,
    ageGroups
} from '../utils/pftScoring';
import { Calculator, Activity, Trophy, AlertCircle, Target, Calendar, ChevronDown, ChevronUp, Dumbbell, FileText, ChevronLeft, ChevronRight, Table as TableIcon, X, Footprints, Shield, Download } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';

const BASE_URL = import.meta.env.BASE_URL;

const visualPlans = {
    pft: {
        title: "PFT Workout Cards",
        path: `${BASE_URL}pft/`,
        count: 16,
        description: "Official visual training guides for PFT events"
    },
    cft: {
        title: "CFT Workout Cards",
        path: `${BASE_URL}cft/`,
        count: 125,
        description: "Comprehensive CFT preparation guide and daily schedule",
        fileOffset: 2
    }
};

const PFTPrep = () => {
    const [testType, setTestType] = useState('pft'); // 'pft' or 'cft'
    const [gender, setGender] = useState('male');
    const [ageGroup, setAgeGroup] = useState('21-25');
    const [altitude, setAltitude] = useState(false);
    const [activeTab, setActiveTab] = useState('calculator'); // 'calculator', 'cards', 'pullup'

    // PFT State
    const [pullups, setPullups] = useState(15);
    const [pushups, setPushups] = useState(60);
    const [crunches, setCrunches] = useState(100); // Deprecated but kept for legacy if needed
    const [plankTime, setPlankTime] = useState(240); // Seconds
    const [runTime, setRunTime] = useState(1260); // Seconds (21:00)
    const [rowTime, setRowTime] = useState(300); // Seconds (5:00)
    const [upperBodyType, setUpperBodyType] = useState('pullups'); // 'pullups' or 'pushups'
    const [cardioType, setCardioType] = useState('run'); // 'run' or 'row'

    // CFT State
    const [mtcTime, setMtcTime] = useState(180); // Seconds (3:00)
    const [alReps, setAlReps] = useState(90);
    const [manufTime, setManufTime] = useState(180); // Seconds (3:00)

    // Visual Resource State
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    // Add state for CFT page navigation
    const [cftPageInput, setCftPageInput] = useState('');

    // CFT Schedule State
    const [cftWeek, setCftWeek] = useState(1);
    const [cftViewCard, setCftViewCard] = useState(null); // card index to view, or null
    const [cftWeekView, setCftWeekView] = useState(null); // week number to show all cards, or null
    const [cftDownloading, setCftDownloading] = useState(false);

    // CFT schedule mapping: workout type → card index offset
    const cftSchedule = {
        days: [
            { day: 'Mon', type: 'WARRIOR', color: 'bg-red-600', textColor: 'text-white', hexColor: '#dc2626', offset: 0 },
            { day: 'Tue', type: 'ATHLETE', color: 'bg-blue-600', textColor: 'text-white', hexColor: '#2563eb', offset: 100 },
            { day: 'Wed', type: 'RELOAD', color: 'bg-green-600', textColor: 'text-white', hexColor: '#16a34a', offset: 25 },
            { day: 'Thu', type: 'COMBAT', color: 'bg-yellow-500', textColor: 'text-black', hexColor: '#eab308', offset: 75 },
            { day: 'Fri', type: 'COMPANY', color: 'bg-purple-600', textColor: 'text-white', hexColor: '#9333ea', offset: 50 },
            { day: 'Sat', type: 'RELOAD', color: 'bg-green-600', textColor: 'text-white', hexColor: '#16a34a', offset: 25 },
            { day: 'Sun', type: 'REST', color: 'bg-gray-400', textColor: 'text-white', hexColor: '#9ca3af', offset: null },
        ]
    };

    const getCftCardIndex = (weekNum, dayOffset) => {
        if (dayOffset === null) return null;
        return dayOffset + (weekNum - 1);
    };

    const getCftImageSrc = (cardIndex) => {
        if (cardIndex === null) return null;
        const pageNum = padPage(cardIndex + 1 + (visualPlans.cft.fileOffset || 0));
        return `${visualPlans.cft.path}CFT-PREP-GUIDANCE_page-${pageNum}.jpg`;
    };

    // Get workout days (non-rest) for a week
    const getWeekWorkouts = (weekNum) => {
        return cftSchedule.days
            .filter(d => d.offset !== null)
            .map(d => ({
                ...d,
                cardIndex: getCftCardIndex(weekNum, d.offset),
                label: `${d.type} HITT ${weekNum}`,
                imgSrc: getCftImageSrc(getCftCardIndex(weekNum, d.offset))
            }));
    };

    // Download week's cards as PDF
    const downloadWeekPDF = async (weekNum) => {
        setCftDownloading(true);
        try {
            const workouts = getWeekWorkouts(weekNum);
            // Load all images first
            const loadImage = (src) => new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load ${src}`));
                img.src = src;
            });

            const images = await Promise.all(
                workouts.map(w => loadImage(w.imgSrc).catch(() => null))
            );

            const doc = new jsPDF('p', 'mm', 'letter');
            const pageW = doc.internal.pageSize.getWidth();
            const pageH = doc.internal.pageSize.getHeight();

            // Title page
            doc.setFillColor(139, 0, 0);
            doc.rect(0, 0, pageW, 30, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('HITT Training Schedule', pageW / 2, 18, { align: 'center' });
            doc.setFontSize(14);
            doc.text(`Week ${weekNum} of 25`, pageW / 2, 26, { align: 'center' });

            // Schedule summary on title page
            doc.setTextColor(0, 0, 0);
            let yPos = 45;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Weekly Schedule:', 20, yPos);
            yPos += 10;

            workouts.forEach((w) => {
                const hex = w.hexColor;
                const r = parseInt(hex.slice(1,3), 16);
                const g = parseInt(hex.slice(3,5), 16);
                const b = parseInt(hex.slice(5,7), 16);
                doc.setFillColor(r, g, b);
                doc.rect(20, yPos - 4, 40, 7, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(`${w.day}`, 22, yPos);
                doc.text(`${w.type} ${weekNum}`, 35, yPos);
                doc.setTextColor(0, 0, 0);
                yPos += 10;
            });

            // Add REST DAY
            doc.setFillColor(156, 163, 175);
            doc.rect(20, yPos - 4, 40, 7, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.text('Sun', 22, yPos);
            doc.text('REST DAY', 35, yPos);

            // Card pages
            workouts.forEach((w, i) => {
                doc.addPage();
                // Header bar
                const hex = w.hexColor;
                const r = parseInt(hex.slice(1,3), 16);
                const g = parseInt(hex.slice(3,5), 16);
                const b = parseInt(hex.slice(5,7), 16);
                doc.setFillColor(r, g, b);
                doc.rect(0, 0, pageW, 12, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(`${w.day.toUpperCase()} — ${w.label}`, pageW / 2, 8, { align: 'center' });

                if (images[i]) {
                    const img = images[i];
                    const imgRatio = img.width / img.height;
                    const maxW = pageW - 20;
                    const maxH = pageH - 25;
                    let drawW = maxW;
                    let drawH = drawW / imgRatio;
                    if (drawH > maxH) {
                        drawH = maxH;
                        drawW = drawH * imgRatio;
                    }
                    const x = (pageW - drawW) / 2;
                    doc.addImage(img, 'JPEG', x, 14, drawW, drawH);
                } else {
                    doc.setTextColor(150, 150, 150);
                    doc.setFontSize(14);
                    doc.text('Image could not be loaded', pageW / 2, pageH / 2, { align: 'center' });
                }
            });

            // Footer on all pages
            const totalPages = doc.internal.getNumberOfPages();
            for (let p = 1; p <= totalPages; p++) {
                doc.setPage(p);
                doc.setFontSize(7);
                doc.setTextColor(150, 150, 150);
                doc.text('MarineFit — COMBAT FIT. COMBAT READY.', pageW / 2, pageH - 5, { align: 'center' });
            }

            doc.save(`HITT_Week_${weekNum}_Schedule.pdf`);
        } catch (err) {
            console.error('PDF download failed:', err);
        } finally {
            setCftDownloading(false);
        }
    };

    // Helper to get the actual image filename/index
    const getPage = (index, type) => {
        if (type === 'cft') {
            // Apply offset because first 2 files were deleted
            const offset = visualPlans.cft.fileOffset || 0;
            return index + 1 + offset; 
        }
        return index + 1;
    };

    const padPage = (num) => num.toString().padStart(4, '0');

    const [imageError, setImageError] = useState(false);

    // Reset error when card changes
    useEffect(() => {
        setImageError(false);
    }, [currentCardIndex, testType]);

    const getImageSource = () => {
        const pageNum = padPage(getPage(currentCardIndex, testType));
        if (testType === 'pft') {
            // Use hyphens instead of spaces for better web compatibility
            return `${visualPlans.pft.path}PFT-Prep-Program_page-${pageNum}.jpg`;
        }
        return `${visualPlans.cft.path}CFT-PREP-GUIDANCE_page-${pageNum}.jpg`;
    };

    const handleJumpToPage = (e) => {
        e.preventDefault();
        const pageNum = parseInt(cftPageInput);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= visualPlans.cft.count) {
            setCurrentCardIndex(pageNum - 1);
            setCftPageInput('');
        }
    };

    // Download a single image as file
    const downloadImage = async (src, filename) => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            // Fallback: open in new tab
            window.open(src, '_blank');
        }
    };

    const result = useMemo(() => {
        if (testType === 'pft') {
            const inputs = {
                upperBodyType,
                upperBodyReps: upperBodyType === 'pullups' ? pullups : pushups,
                plankMinutes: Math.floor(plankTime / 60),
                plankSeconds: plankTime % 60,
                runMinutes: Math.floor(runTime / 60),
                runSeconds: runTime % 60
            };

            const scores = calculatePFTScore(gender, ageGroup, inputs);

            return {
                upperBodyScore: scores.upperBodyScore,
                plankScore: scores.plankScore,
                runScore: scores.runScore,
                totalScore: scores.totalScore,
                scoreClass: scores.classification.name
            };
        } else {
            const inputs = {
                mtcMinutes: Math.floor(mtcTime / 60),
                mtcSeconds: mtcTime % 60,
                ammoLifts: alReps,
                manufMinutes: Math.floor(manufTime / 60),
                manufSeconds: manufTime % 60,
                isAltitude: altitude
            };

            const scores = calculateCFTScore(gender, ageGroup, inputs);

            return {
                mtcScore: scores.mtcScore,
                alScore: scores.alScore,
                manufScore: scores.manufScore,
                totalScore: scores.totalScore,
                scoreClass: scores.classification.name
            };
        }
    }, [testType, gender, ageGroup, altitude, pullups, pushups, plankTime, runTime, upperBodyType, mtcTime, alReps, manufTime]);

    // State for Event Standards Modal
    const [activeModalEvent, setActiveModalEvent] = useState(null);

    // State for Performance Standards Modal
    const [showStandardsModal, setShowStandardsModal] = useState(false);

    // Format time (seconds to MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const TimeInput = ({ label, totalSeconds, onChange, onShowTable }) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        const handleMinChange = (e) => {
            const val = parseInt(e.target.value);
            const newMin = isNaN(val) ? 0 : Math.max(0, val);
            onChange(newMin * 60 + seconds);
        };

        const handleSecChange = (e) => {
            const val = parseInt(e.target.value);
            const newSec = isNaN(val) ? 0 : Math.min(59, Math.max(0, val));
            onChange(minutes * 60 + newSec);
        };

        return (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                    {onShowTable && (
                        <button 
                            onClick={onShowTable}
                            className="text-xs flex items-center gap-1 text-marine-red font-semibold hover:underline bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500 shadow-sm"
                        >
                            <TableIcon size={12} /> Table
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <input
                            type="number"
                            value={minutes}
                            onChange={handleMinChange}
                            className="w-full text-center text-lg font-bold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-3"
                            min={0}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium uppercase">Min</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">:</span>
                    <div className="relative flex-1">
                        <input
                            type="number"
                            value={seconds}
                            onChange={handleSecChange}
                            className="w-full text-center text-lg font-bold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-3"
                            min={0}
                            max={59}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium uppercase">Sec</span>
                    </div>
                </div>
            </div>
        );
    };

    const NumberInput = ({ label, value, onChange, max, onShowTable }) => (
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                {onShowTable && (
                    <button 
                        onClick={onShowTable}
                        className="text-xs flex items-center gap-1 text-marine-red font-semibold hover:underline bg-white dark:bg-gray-600 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-500 shadow-sm"
                    >
                        <TableIcon size={12} /> Table
                    </button>
                )}
            </div>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        onChange(isNaN(val) ? 0 : Math.max(0, val));
                    }}
                    className="w-full text-center text-lg font-bold rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red py-3"
                    min={0}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium uppercase">Reps</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-marine-red to-red-900 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                    <Activity className="text-yellow-400" size={28} />
                    <h2 className="text-2xl font-bold">Physical Fitness Calculator</h2>
                </div>
                <p className="text-red-100">Calculate scores, view requirements, and access training plans.</p>
                
                {/* Test Type Toggle */}
                <div className="flex gap-2 mt-6 bg-black/20 p-1 rounded-lg w-fit">
                    <button
                        onClick={() => setTestType('pft')}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                            testType === 'pft' 
                                ? 'bg-white text-marine-red shadow-sm' 
                                : 'text-red-100 hover:bg-white/10'
                        }`}
                    >
                        PFT
                    </button>
                    <button
                        onClick={() => setTestType('cft')}
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                            testType === 'cft' 
                                ? 'bg-white text-marine-red shadow-sm' 
                                : 'text-red-100 hover:bg-white/10'
                        }`}
                    >
                        CFT
                    </button>
                </div>
            </div>

            {/* Main Tabs */}
            <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('calculator')}
                    className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'calculator'
                            ? 'border-marine-red text-marine-red'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Calculator size={16} />
                        Calculator
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab('cards')}
                    className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'cards'
                            ? 'border-marine-red text-marine-red'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    <div className="flex items-center gap-1 sm:gap-2">
                        <FileText size={16} />
                        Cards
                    </div>
                </button>
                {testType === 'pft' && (
                    <button
                        onClick={() => setActiveTab('pullup')}
                        className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'pullup'
                                ? 'border-marine-red text-marine-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Dumbbell size={16} />
                            Pull-ups
                        </div>
                    </button>
                )}
                {testType === 'pft' && (
                    <button
                        onClick={() => setActiveTab('plank')}
                        className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'plank'
                                ? 'border-marine-red text-marine-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Shield size={16} />
                            Plank
                        </div>
                    </button>
                )}
                {testType === 'pft' && (
                    <button
                        onClick={() => setActiveTab('walk_run')}
                        className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'walk_run'
                                ? 'border-marine-red text-marine-red'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Footprints size={16} />
                            Walk to Run
                        </div>
                    </button>
                )}
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {activeTab === 'calculator' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Inputs Column */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Personal Details */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Target size={20} className="text-marine-red" />
                                    Personal Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age Group</label>
                                        <select
                                            value={ageGroup}
                                            onChange={(e) => setAgeGroup(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-marine-red focus:border-marine-red"
                                        >
                                            {ageGroups.map(group => (
                                                <option key={group} value={group}>{group}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Score Inputs */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Activity size={20} className="text-marine-red" />
                                    Performance Metrics
                                </h3>
                                
                                {testType === 'pft' ? (
                                    <div className="space-y-6">
                                        {/* Upper Body */}
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Upper Body Event</label>
                                                <div className="flex gap-2 text-xs">
                                                    <button
                                                        onClick={() => setUpperBodyType('pullups')}
                                                        className={`px-3 py-1 rounded-full transition-colors ${upperBodyType === 'pullups' ? 'bg-marine-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        Pull-ups
                                                    </button>
                                                    <button
                                                        onClick={() => setUpperBodyType('pushups')}
                                                        className={`px-3 py-1 rounded-full transition-colors ${upperBodyType === 'pushups' ? 'bg-marine-red text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        Push-ups
                                                    </button>
                                                </div>
                                            </div>
                                            <NumberInput
                                                label={upperBodyType === 'pullups' ? "Pull-up Reps" : "Push-up Reps"}
                                                value={upperBodyType === 'pullups' ? pullups : pushups}
                                                onChange={upperBodyType === 'pullups' ? setPullups : setPushups}
                                                max={upperBodyType === 'pullups' ? 30 : 100}
                                                onShowTable={() => setActiveModalEvent(upperBodyType)}
                                            />
                                        </div>

                                        {/* Plank */}
                                        <TimeInput
                                            label="Plank Duration"
                                            totalSeconds={plankTime}
                                            onChange={setPlankTime}
                                            onShowTable={() => setActiveModalEvent('plank')}
                                        />

                                        {/* Run */}
                                        <TimeInput
                                            label="3-Mile Run Time"
                                            totalSeconds={runTime}
                                            onChange={setRunTime}
                                            onShowTable={() => setActiveModalEvent('run')}
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* MTC */}
                                        <TimeInput
                                            label="Movement to Contact (880 yds)"
                                            totalSeconds={mtcTime}
                                            onChange={setMtcTime}
                                            onShowTable={() => setActiveModalEvent('mtc')}
                                        />

                                        {/* Ammo Lifts */}
                                        <NumberInput
                                            label="Ammo Can Lifts (2 mins)"
                                            value={alReps}
                                            onChange={setAlReps}
                                            max={150}
                                            onShowTable={() => setActiveModalEvent('ammo')}
                                        />

                                        {/* MANUF */}
                                        <TimeInput
                                            label="Maneuver Under Fire"
                                            totalSeconds={manufTime}
                                            onChange={setManufTime}
                                            onShowTable={() => setActiveModalEvent('manuf')}
                                        />

                                        {/* Altitude Adjustment */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30 border-l-4 border-l-blue-500 dark:border-l-blue-400">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={altitude}
                                                        onChange={(e) => setAltitude(e.target.checked)}
                                                        className="w-5 h-5 rounded border-gray-300 text-marine-red focus:ring-marine-red"
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-medium text-blue-900 dark:text-blue-100">High Altitude (&gt;4,500 ft MSL)</span>
                                                    <span className="block text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                        Adjusts minimum requirements for MTC and MANUF events per MCO 6100.13A.
                                                    </span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Results Column */}
                        <div className="space-y-6">
                            {/* Score Card */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-marine-red">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Trophy size={20} className="text-yellow-500" />
                                    Results
                                </h3>
                                
                                <div className="text-center mb-6">
                                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">{result.totalScore}</div>
                                    <div className={`text-lg font-bold px-3 py-1 rounded-full inline-block ${
                                        result.scoreClass === "1st Class" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                                        result.scoreClass === "2nd Class" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" :
                                        result.scoreClass === "3rd Class" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" :
                                        "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                    }`}>
                                        {result.scoreClass}
                                    </div>
                                </div>

                                <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                                    {testType === 'pft' ? (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Upper Body</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.upperBodyScore} pts</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Plank</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.plankScore} pts</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Run</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.runScore} pts</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">MTC</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.mtcScore} pts</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Ammo Lifts</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.alScore} pts</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">MANUF</span>
                                                <span className="font-semibold text-gray-900 dark:text-white">{result.manufScore} pts</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {altitude && (
                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded border border-yellow-200 dark:border-yellow-800 flex items-start gap-2">
                                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                        <span>Scores calculated with high altitude consideration (&gt;4,500 ft MSL). Results are for reference only; consult MCO 6100.13A for official adjustments.</span>
                                    </div>
                                )}

                                <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Performance Standards</h4>
                                    <div className="flex flex-col sm:flex-row gap-2 text-center text-xs">
                                        <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-2 rounded flex sm:flex-col items-center justify-between sm:justify-center gap-1">
                                            <span className="font-bold text-green-700 dark:text-green-300">1st Class</span>
                                            <span className="text-green-600 dark:text-green-400">235 - 300</span>
                                        </div>
                                        <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded flex sm:flex-col items-center justify-between sm:justify-center gap-1">
                                            <span className="font-bold text-yellow-700 dark:text-yellow-300">2nd Class</span>
                                            <span className="text-yellow-600 dark:text-yellow-400">200 - 234</span>
                                        </div>
                                        <div className="flex-1 bg-orange-50 dark:bg-orange-900/20 p-2 rounded flex sm:flex-col items-center justify-between sm:justify-center gap-1">
                                            <span className="font-bold text-orange-700 dark:text-orange-300">3rd Class</span>
                                            <span className="text-orange-600 dark:text-orange-400">120 - 199</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations (Conditional) */}
                            {result.totalScore < 300 && (
                                <ImprovementRecommendations 
                                    result={result} 
                                    testType={testType} 
                                    upperBodyType={upperBodyType} 
                                />
                            )}
                        </div>
                    </div>

                    {/* Performance Standards Button */}
                    <button
                        onClick={() => setShowStandardsModal(true)}
                        className="w-full mt-6 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <FileText size={18} />
                        View {testType.toUpperCase()} Performance Standards
                    </button>
                </div>
                )}

                {activeTab === 'cards' && testType === 'pft' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText size={20} className="text-marine-red" />
                                        {visualPlans.pft.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {visualPlans.pft.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Card {currentCardIndex + 1} of {visualPlans.pft.count}
                                    </span>
                                    <button
                                        onClick={() => downloadImage(getImageSource(), `PFT_Card_${currentCardIndex + 1}.jpg`)}
                                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                                        title="Download card"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Viewer */}
                            <div className="relative aspect-[3/4] md:aspect-[4/3] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center group">
                                <img
                                    src={getImageSource()}
                                    alt={`PFT Card ${currentCardIndex + 1}`}
                                    className="max-w-full max-h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                    }}
                                />

                                {/* Navigation Overlay */}
                                <div className="absolute inset-0 flex items-center justify-between p-4">
                                    <button
                                        onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentCardIndex === 0}
                                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => setCurrentCardIndex(prev => Math.min(visualPlans.pft.count - 1, prev + 1))}
                                        disabled={currentCardIndex === visualPlans.pft.count - 1}
                                        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnails / Progress */}
                            <div className="mt-4 flex justify-center gap-1 flex-wrap">
                                {Array.from({ length: visualPlans.pft.count }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentCardIndex(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            i === currentCardIndex
                                                ? 'bg-marine-red w-4'
                                                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cards' && testType === 'cft' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
                                <Calendar size={20} className="text-marine-red" />
                                HITT Training Schedule
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Tap a week to view all cards — tap any cell for a single card</p>

                            {/* Schedule Table */}
                            <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                                <table className="w-full text-xs border-collapse" style={{ minWidth: '580px' }}>
                                    <thead>
                                        <tr>
                                            <th className="sticky left-0 z-10 bg-gray-700 text-white p-1.5 text-center font-bold border border-gray-600 w-16"></th>
                                            {cftSchedule.days.map(d => (
                                                <th key={d.day} className="bg-gray-700 text-white p-1.5 text-center font-bold border border-gray-600">
                                                    {d.day.toUpperCase()}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: 25 }, (_, i) => i + 1).map(week => (
                                            <tr key={week} className={cftWeek === week ? 'ring-2 ring-marine-red ring-inset' : ''}>
                                                <td
                                                    className={`sticky left-0 z-10 p-1.5 text-center font-bold border border-gray-300 dark:border-gray-600 cursor-pointer transition-colors ${
                                                        cftWeek === week
                                                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                    onClick={() => { setCftWeek(week); setCftWeekView(week); }}
                                                >
                                                    WK {week}
                                                </td>
                                                {cftSchedule.days.map(dayInfo => {
                                                    const cardIdx = getCftCardIndex(week, dayInfo.offset);
                                                    const isRest = dayInfo.type === 'REST';
                                                    return (
                                                        <td
                                                            key={dayInfo.day}
                                                            onClick={() => {
                                                                if (!isRest) {
                                                                    setCftWeek(week);
                                                                    setCftViewCard(cardIdx);
                                                                }
                                                            }}
                                                            className={`p-1 text-center border border-gray-300 dark:border-gray-600 transition-colors ${
                                                                isRest
                                                                    ? 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                                                                    : 'cursor-pointer hover:brightness-90 active:brightness-75'
                                                            }`}
                                                            style={!isRest ? {
                                                                backgroundColor: dayInfo.hexColor,
                                                                color: dayInfo.day === 'Thu' ? '#000' : '#fff'
                                                            } : undefined}
                                                        >
                                                            <div className="font-bold leading-tight" style={{ fontSize: '10px' }}>
                                                                {isRest ? 'REST' : dayInfo.type}
                                                            </div>
                                                            <div className="leading-tight" style={{ fontSize: '9px' }}>
                                                                {isRest ? 'DAY' : week}
                                                            </div>
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Single Card Viewer Modal */}
                        {cftViewCard !== null && !cftWeekView && (
                            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setCftViewCard(null)}>
                                <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                                            {(() => {
                                                const dayInfo = cftSchedule.days.find(d => d.offset !== null && getCftCardIndex(cftWeek, d.offset) === cftViewCard);
                                                return dayInfo ? `${dayInfo.type} HITT ${cftWeek}` : `Card ${cftViewCard + 1}`;
                                            })()}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    const dayInfo = cftSchedule.days.find(d => d.offset !== null && getCftCardIndex(cftWeek, d.offset) === cftViewCard);
                                                    const name = dayInfo ? `${dayInfo.type}_HITT_${cftWeek}` : `CFT_Card_${cftViewCard + 1}`;
                                                    downloadImage(getCftImageSrc(cftViewCard), `${name}.jpg`);
                                                }}
                                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                title="Download card"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => setCftViewCard(null)}
                                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-auto flex-1 p-2 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                        <img
                                            src={getCftImageSrc(cftViewCard)}
                                            alt={`CFT Card ${cftViewCard + 1}`}
                                            className="max-w-full h-auto object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Week View Modal - All Cards */}
                        {cftWeekView !== null && (
                            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-2 sm:p-4" onClick={() => setCftWeekView(null)}>
                                <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCftWeekView(w => Math.max(1, w - 1))}
                                                disabled={cftWeekView === 1}
                                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <span className="font-bold text-gray-900 dark:text-white text-sm">
                                                Week {cftWeekView} of 25
                                            </span>
                                            <button
                                                onClick={() => setCftWeekView(w => Math.min(25, w + 1))}
                                                disabled={cftWeekView === 25}
                                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => downloadWeekPDF(cftWeekView)}
                                                disabled={cftDownloading}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-marine-red hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Download size={14} />
                                                {cftDownloading ? 'Saving...' : 'PDF'}
                                            </button>
                                            <button
                                                onClick={() => setCftWeekView(null)}
                                                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Cards List */}
                                    <div className="overflow-auto flex-1 p-3 space-y-4">
                                        {getWeekWorkouts(cftWeekView).map((workout) => (
                                            <div key={workout.day} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                {/* Day Header */}
                                                <div
                                                    className="px-3 py-2 font-bold text-sm flex items-center gap-2"
                                                    style={{ backgroundColor: workout.hexColor, color: workout.day === 'Thu' ? '#000' : '#fff' }}
                                                >
                                                    <span>{workout.day.toUpperCase()}</span>
                                                    <span className="opacity-80">—</span>
                                                    <span>{workout.label}</span>
                                                </div>
                                                {/* Card Image */}
                                                <div className="bg-gray-50 dark:bg-gray-900 p-2">
                                                    <img
                                                        src={workout.imgSrc}
                                                        alt={workout.label}
                                                        className="w-full h-auto object-contain"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Rest Day Note */}
                                        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <div className="px-3 py-2 font-bold text-sm bg-gray-400 text-white flex items-center gap-2">
                                                <span>SUN</span>
                                                <span className="opacity-80">—</span>
                                                <span>REST DAY</span>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-900 p-4 text-center text-gray-400 dark:text-gray-500 text-sm italic">
                                                Active recovery / rest day
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pullup' && (
                    <PullupProgram />
                )}

                {activeTab === 'plank' && (
                    <PlankProgram />
                )}

                {activeTab === 'walk_run' && (
                    <WalkToRunProgram />
                )}
            </div>

            <AnimatePresence>
                {activeModalEvent && (
                    <EventStandardsModal
                        isOpen={!!activeModalEvent}
                        onClose={() => setActiveModalEvent(null)}
                        eventType={activeModalEvent}
                        gender={gender}
                    />
                )}
            </AnimatePresence>

            {/* Performance Standards Modal */}
            <PerformanceStandardsModal
                isOpen={showStandardsModal}
                onClose={() => setShowStandardsModal(false)}
                testType={testType}
                gender={gender}
            />
        </div>
    );
};

export default PFTPrep;