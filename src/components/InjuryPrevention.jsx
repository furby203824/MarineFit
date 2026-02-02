import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Zap, Thermometer, ChevronRight, AlertTriangle } from 'lucide-react';

const InjuryPrevention = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const sections = [
        {
            title: "Pre-Habilitation",
            desc: "Proactive exercises to strengthen vulnerable areas before injury occurs.",
            icon: Shield,
            color: "text-marine-red",
            bg: "bg-red-50"
        },
        {
            title: "Mobility Library",
            desc: "Joint-specific routines to improve range of motion and functional movement.",
            icon: Activity,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Dynamic Warmups",
            desc: "Preparation routines for HITT, PFT, and CFT events.",
            icon: Zap,
            color: "text-yellow-600",
            bg: "bg-yellow-50"
        },
        {
            title: "Recovery Protocols",
            desc: "Post-workout strategies including foam rolling and stretching.",
            icon: Thermometer,
            color: "text-green-600",
            bg: "bg-green-50"
        }
    ];

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
                            Sharp pain, swelling, or loss of function requires immediate medical attention.
                        </p>
                        <button className="text-orange-700 font-semibold hover:text-orange-800 transition-colors">
                            View Pain Guide →
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default InjuryPrevention;
