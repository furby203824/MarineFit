import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Clock, Battery, Sun, ChevronRight, CheckCircle2 } from 'lucide-react';

const SleepOptimizer = () => {
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
            title: "Sleep Hygiene",
            desc: "Environmental and behavioral optimization for deep restorative sleep.",
            icon: Moon,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "Circadian Rhythm",
            desc: "Aligning light exposure and activity with your biological clock.",
            icon: Sun,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            title: "Recovery Tracking",
            desc: "Monitor sleep debt and recovery scores to adjust training intensity.",
            icon: Battery,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            title: "Tactical Napping",
            desc: "Protocols for short-duration sleep to restore alertness in the field.",
            icon: Clock,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-marine-red/10 rounded-lg">
                        <Moon className="w-8 h-8 text-marine-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 m-0">Sleep Optimizer</h1>
                        <p className="text-gray-500">Recovery is a weapon system</p>
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

            {/* Quick Checklist Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-indigo-900 rounded-2xl p-6 mt-8 text-white"
            >
                <h3 className="text-lg font-bold mb-4">Tonight's Protocol</h3>
                <div className="space-y-3">
                    {[
                        "No caffeine 6 hours before bed",
                        "Room temperature set to 65-68°F",
                        "Blue light filters enabled on devices",
                        "Magnesium supplementation (if prescribed)"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="text-indigo-100">{item}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default SleepOptimizer;
