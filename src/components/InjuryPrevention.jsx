import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Zap, Thermometer, ChevronRight, AlertTriangle, ArrowLeft, PlayCircle, Clock } from 'lucide-react';

const InjuryPrevention = () => {
    const [activeSection, setActiveSection] = useState(null);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    // Pre-habilitation exercises targeting common Marine injury areas
    const prehabExercises = [
        { name: 'Glute Bridge', target: 'Lower Back/Hips', reps: '3x15', url: 'https://www.dvidshub.net/video/551136/pvc-half-kneeling-hip-flexor' },
        { name: 'Dead Bug', target: 'Core Stability', reps: '3x10 each', url: '' },
        { name: 'Clamshells', target: 'Hip Stability', reps: '3x15 each', url: '' },
        { name: 'Face Pulls', target: 'Shoulder Health', reps: '3x15', url: '' },
        { name: 'Single Leg RDL', target: 'Hamstring/Balance', reps: '3x8 each', url: '' },
        { name: 'Banded Pull-Aparts', target: 'Upper Back', reps: '3x20', url: '' },
        { name: 'Ankle Circles', target: 'Ankle Mobility', reps: '2x10 each direction', url: '' },
        { name: 'Scapular Push-ups', target: 'Shoulder Stability', reps: '3x12', url: '' }
    ];

    // Mobility routines by body region
    const mobilityRoutines = [
        {
            region: 'Hips & Lower Body',
            exercises: [
                { name: 'Hip Circles', reps: '10 each direction', url: 'https://www.dvidshub.net/video/677358/hip-circles' },
                { name: 'Pigeon Stretch', reps: '60s each side', url: '' },
                { name: 'Couch Stretch', reps: '60s each side', url: '' },
                { name: 'Lateral Lunge', reps: '10 each side', url: 'https://www.dvidshub.net/video/677362/lateral-lunge' }
            ]
        },
        {
            region: 'Thoracic Spine',
            exercises: [
                { name: 'Thoracic Rotations', reps: '10 each side', url: '' },
                { name: 'Cat-Cow', reps: '15 reps', url: '' },
                { name: 'Thread the Needle', reps: '8 each side', url: '' },
                { name: 'Foam Roll T-Spine', reps: '2 min', url: '' }
            ]
        },
        {
            region: 'Shoulders & Upper Body',
            exercises: [
                { name: 'Arm Circles', reps: '15 each direction', url: 'https://www.dvidshub.net/video/551356/arm-circles' },
                { name: 'Wall Slides', reps: '12 reps', url: '' },
                { name: 'Doorway Pec Stretch', reps: '45s each side', url: '' },
                { name: 'Shoulder Stretch', reps: '30s each', url: 'https://www.dvidshub.net/video/699176/shoulder-stretch' }
            ]
        },
        {
            region: 'Ankles & Feet',
            exercises: [
                { name: 'Ankle Circles', reps: '10 each direction', url: '' },
                { name: 'Calf Raises', reps: '20 reps', url: '' },
                { name: 'Toe Yoga', reps: '10 each movement', url: '' },
                { name: 'Banded Ankle Mobilization', reps: '15 each side', url: '' }
            ]
        }
    ];

    // Dynamic warmup protocols for different activities
    const warmupProtocols = [
        {
            name: 'HITT Warmup',
            duration: '8-10 min',
            exercises: [
                { name: 'Arm Circles', reps: '20 each', url: 'https://www.dvidshub.net/video/551356/arm-circles' },
                { name: 'Hip Circles', reps: '10 each', url: 'https://www.dvidshub.net/video/677358/hip-circles' },
                { name: 'Inchworm', reps: '8 reps', url: 'https://www.dvidshub.net/video/551396/inchworm' },
                { name: 'Walking Lunge w/ Twist', reps: '10 each', url: 'https://www.dvidshub.net/video/551861/walking-lunge-with-twist' },
                { name: 'High Knees', reps: '30s', url: 'https://www.dvidshub.net/video/558574/high-knees' },
                { name: 'Butt Kickers', reps: '30s', url: 'https://www.dvidshub.net/video/558559/butt-kickers' }
            ]
        },
        {
            name: 'PFT Warmup (Run Focus)',
            duration: '10-12 min',
            exercises: [
                { name: 'Light Jog', reps: '400m', url: '' },
                { name: 'Leg Swings (Front/Back)', reps: '15 each', url: 'https://www.dvidshub.net/video/551823/sagittal-leg-swing' },
                { name: 'Leg Swings (Side/Side)', reps: '15 each', url: 'https://www.dvidshub.net/video/551381/frontal-leg-swing' },
                { name: 'Walking Knee Hug', reps: '10 each', url: 'https://www.dvidshub.net/video/551850/walking-knee-hug' },
                { name: 'A-Skip', reps: '20m x 2', url: 'https://www.dvidshub.net/video/640967/skip' },
                { name: 'Build-up Sprints', reps: '3 x 50m', url: '' }
            ]
        },
        {
            name: 'CFT Warmup',
            duration: '12-15 min',
            exercises: [
                { name: 'Light Jog', reps: '400m', url: '' },
                { name: 'Walking Lunge - Elbow to Instep', reps: '8 each', url: 'https://www.dvidshub.net/video/551857/walking-lunge-elbow-instep' },
                { name: 'Spiderman', reps: '8 each', url: 'https://www.dvidshub.net/video/551828/spiderman' },
                { name: 'Lateral Shuffle', reps: '20m x 2', url: 'https://www.dvidshub.net/video/558578/lateral-shuffle' },
                { name: 'Bear Crawl', reps: '15m x 2', url: 'https://www.dvidshub.net/video/677348/bear-crawl' },
                { name: 'Ammo Can Practice Lifts', reps: '10 reps light', url: '' }
            ]
        },
        {
            name: 'Upper Body Focus',
            duration: '6-8 min',
            exercises: [
                { name: 'Arm Circles', reps: '20 each direction', url: 'https://www.dvidshub.net/video/551356/arm-circles' },
                { name: 'Shoulder Stretch', reps: '30s each', url: 'https://www.dvidshub.net/video/699176/shoulder-stretch' },
                { name: 'Push-up Position Hold', reps: '30s', url: '' },
                { name: 'Scapular Push-ups', reps: '10 reps', url: '' },
                { name: 'Band Pull-Aparts', reps: '15 reps', url: '' }
            ]
        }
    ];

    // Recovery protocols
    const recoveryProtocols = [
        {
            name: 'Post-Workout Cool Down',
            duration: '10 min',
            exercises: [
                { name: 'Light Walk', reps: '3-5 min', url: '' },
                { name: 'Quad Stretch', reps: '45s each', url: 'https://www.dvidshub.net/video/699175/quad-stretch' },
                { name: 'Hamstring Stretch', reps: '45s each', url: '' },
                { name: 'Glute Stretch', reps: '45s each', url: 'https://www.dvidshub.net/video/699170/glute-stretch' },
                { name: 'Chest Stretch', reps: '45s', url: 'https://www.dvidshub.net/video/699167/chest-stretch' },
                { name: 'Deep Breathing', reps: '10 breaths', url: '' }
            ]
        },
        {
            name: 'Foam Rolling Routine',
            duration: '15 min',
            exercises: [
                { name: 'Calves', reps: '60s each', url: '' },
                { name: 'IT Band', reps: '60s each', url: '' },
                { name: 'Quads', reps: '60s each', url: '' },
                { name: 'Glutes/Piriformis', reps: '60s each', url: '' },
                { name: 'Upper Back', reps: '90s', url: '' },
                { name: 'Lats', reps: '60s each', url: '' }
            ]
        },
        {
            name: 'Active Recovery Day',
            duration: '20-30 min',
            exercises: [
                { name: 'Light Walk or Swim', reps: '15 min', url: '' },
                { name: 'Full Body Stretch Sequence', reps: '10 min', url: '' },
                { name: 'Foam Rolling', reps: '10 min', url: '' },
                { name: 'Diaphragmatic Breathing', reps: '5 min', url: '' }
            ]
        }
    ];

    const sections = [
        {
            id: 'prehab',
            title: "Pre-Habilitation",
            desc: "Proactive exercises to strengthen vulnerable areas before injury occurs.",
            icon: Shield,
            color: "text-marine-red",
            bg: "bg-red-50",
            content: prehabExercises
        },
        {
            id: 'mobility',
            title: "Mobility Library",
            desc: "Joint-specific routines to improve range of motion and functional movement.",
            icon: Activity,
            color: "text-blue-600",
            bg: "bg-blue-50",
            content: mobilityRoutines
        },
        {
            id: 'warmup',
            title: "Dynamic Warmups",
            desc: "Preparation routines for HITT, PFT, and CFT events.",
            icon: Zap,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            content: warmupProtocols
        },
        {
            id: 'recovery',
            title: "Recovery Protocols",
            desc: "Post-workout strategies including foam rolling and stretching.",
            icon: Thermometer,
            color: "text-green-600",
            bg: "bg-green-50",
            content: recoveryProtocols
        }
    ];

    const renderSectionContent = () => {
        const section = sections.find(s => s.id === activeSection);
        if (!section) return null;

        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
            >
                <button
                    onClick={() => setActiveSection(null)}
                    className="flex items-center gap-2 text-gray-600 hover:text-marine-red transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Overview</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${section.bg}`}>
                        <section.icon className={`w-8 h-8 ${section.color}`} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                        <p className="text-gray-500">{section.desc}</p>
                    </div>
                </div>

                {/* Prehab Content */}
                {activeSection === 'prehab' && (
                    <div className="grid gap-3">
                        {prehabExercises.map((ex, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                                <div>
                                    <span className="font-semibold text-gray-900">{ex.name}</span>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-sm text-gray-500">{ex.target}</span>
                                        <span className="text-sm bg-marine-red/10 text-marine-red px-2 py-0.5 rounded">{ex.reps}</span>
                                    </div>
                                </div>
                                {ex.url && (
                                    <a href={ex.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-marine-red transition-colors">
                                        <PlayCircle size={24} />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Mobility Content */}
                {activeSection === 'mobility' && (
                    <div className="space-y-6">
                        {mobilityRoutines.map((routine, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                                    <h3 className="font-bold text-blue-900">{routine.region}</h3>
                                </div>
                                <div className="p-4 grid gap-2">
                                    {routine.exercises.map((ex, exIdx) => (
                                        <div key={exIdx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-900">{ex.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">{ex.reps}</span>
                                                {ex.url && (
                                                    <a href={ex.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                                        <PlayCircle size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Warmup Content */}
                {activeSection === 'warmup' && (
                    <div className="space-y-6">
                        {warmupProtocols.map((protocol, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <div className="bg-yellow-50 px-4 py-3 border-b border-yellow-100 flex justify-between items-center">
                                    <h3 className="font-bold text-yellow-900">{protocol.name}</h3>
                                    <span className="flex items-center gap-1 text-sm text-yellow-700">
                                        <Clock size={14} /> {protocol.duration}
                                    </span>
                                </div>
                                <div className="p-4 grid gap-2">
                                    {protocol.exercises.map((ex, exIdx) => (
                                        <div key={exIdx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-900">{ex.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">{ex.reps}</span>
                                                {ex.url && (
                                                    <a href={ex.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-600 transition-colors">
                                                        <PlayCircle size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recovery Content */}
                {activeSection === 'recovery' && (
                    <div className="space-y-6">
                        {recoveryProtocols.map((protocol, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                                <div className="bg-green-50 px-4 py-3 border-b border-green-100 flex justify-between items-center">
                                    <h3 className="font-bold text-green-900">{protocol.name}</h3>
                                    <span className="flex items-center gap-1 text-sm text-green-700">
                                        <Clock size={14} /> {protocol.duration}
                                    </span>
                                </div>
                                <div className="p-4 grid gap-2">
                                    {protocol.exercises.map((ex, exIdx) => (
                                        <div key={exIdx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-900">{ex.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">{ex.reps}</span>
                                                {ex.url && (
                                                    <a href={ex.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors">
                                                        <PlayCircle size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-marine-red/10 rounded-lg">
                        <Shield className="w-8 h-8 text-marine-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 m-0">Injury Prevention</h1>
                        <p className="text-gray-500">Stay in the fight: Durability and Resilience</p>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {activeSection ? (
                    renderSectionContent()
                ) : (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    onClick={() => setActiveSection(section.id)}
                                    className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${section.bg}`}>
                                            <section.icon className={`w-6 h-6 ${section.color}`} />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-marine-red transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-marine-red transition-colors">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">
                                        {section.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Common Injuries Warning Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mt-8"
                        >
                            <div className="flex items-start gap-4">
                                <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Pain vs. Injury</h3>
                                    <p className="text-gray-700 mb-4">
                                        Learn to distinguish between the discomfort of training and the warning signs of injury.
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="bg-white rounded-lg p-3">
                                            <h4 className="font-semibold text-green-700 mb-2">Normal Training Discomfort</h4>
                                            <ul className="text-gray-600 space-y-1">
                                                <li>• Muscle soreness 24-72 hrs post-workout</li>
                                                <li>• Fatigue during exercise</li>
                                                <li>• Mild burning sensation in muscles</li>
                                                <li>• Temporary stiffness</li>
                                            </ul>
                                        </div>
                                        <div className="bg-white rounded-lg p-3">
                                            <h4 className="font-semibold text-red-700 mb-2">Seek Medical Attention</h4>
                                            <ul className="text-gray-600 space-y-1">
                                                <li>• Sharp, sudden pain</li>
                                                <li>• Swelling or bruising</li>
                                                <li>• Pain that worsens with activity</li>
                                                <li>• Loss of range of motion</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InjuryPrevention;
