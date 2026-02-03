import React, { useState } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Utensils, ChevronRight, ChevronLeft, ExternalLink,
    BookOpen, Shield, X, Download
} from 'lucide-react';
import { keyPrinciples, sections } from '../data/nutritionData';
import NutritionSectionContent from './nutrition/NutritionSectionContent';

const BASE_URL = import.meta.env.BASE_URL;

const Nutrition = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const imageModalTrapRef = useFocusTrap(!!selectedResource, () => setSelectedResource(null));

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

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    {activeSection && (
                        <button
                            onClick={() => setActiveSection(null)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    )}
                    <div className="p-3 bg-marine-red/10 rounded-lg">
                        <Utensils className="w-8 h-8 text-marine-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                            {activeSection
                                ? sections.find(s => s.id === activeSection)?.title
                                : 'Performance Nutrition'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {activeSection
                                ? sections.find(s => s.id === activeSection)?.desc
                                : 'Healthy and Intentional Fueling Supports the Mission'}
                        </p>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!activeSection ? (
                    <motion.div
                        key="main"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8"
                    >
                        {/* Key Principles */}
                        <motion.div variants={container} initial="hidden" animate="show">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-marine-red/10 rounded-lg">
                                        <Shield className="w-5 h-5 text-marine-red" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Warfighter Nutrition Principles</h2>
                                </div>
                                <ul className="space-y-3">
                                    {keyPrinciples.map((principle, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                            <span className="text-marine-red font-bold mt-0.5">•</span>
                                            <span className="text-sm">{principle}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        {/* Section Cards */}
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    onClick={() => setActiveSection(section.id)}
                                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2 rounded-lg ${section.bg} dark:bg-opacity-20`}>
                                            <section.icon className={`w-5 h-5 ${section.color}`} />
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-marine-red transition-colors" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-marine-red transition-colors text-sm">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                                        {section.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Warfighter Nutrition Guide */}
                        <motion.section variants={item} className="bg-marine-red text-white rounded-2xl p-6 shadow-md">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                    <BookOpen size={32} className="text-marine-gold" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-xl font-bold mb-2">Warfighter Nutrition Guide</h2>
                                    <p className="text-red-100 mb-4">
                                        Comprehensive strategies for obtaining the cognitive and physiological edge under rigorous conditions.
                                    </p>
                                    <a
                                        href="https://www.hprc-online.org/nutrition/warfighter-nutrition-guide"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-white text-marine-red px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Access Guide <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        </motion.section>
                    </motion.div>
                ) : (
                    <motion.div
                        key="section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <NutritionSectionContent section={activeSection} onSelectResource={setSelectedResource} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Modal */}
            <AnimatePresence>
                {selectedResource && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={() => setSelectedResource(null)}
                    >
                        <motion.div
                            ref={imageModalTrapRef}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Image viewer"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-7xl max-h-[90vh] w-full bg-transparent flex flex-col items-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedResource(null)}
                                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
                            >
                                <X size={32} />
                            </button>

                            <img
                                src={`${BASE_URL}nutrition/${selectedResource.filename}`}
                                alt={selectedResource.title}
                                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white"
                            />

                            <div className="mt-4 text-center flex flex-col items-center gap-2">
                                <h3 className="text-xl font-bold text-white">{selectedResource.title}</h3>
                                <p className="text-white/70">{selectedResource.description}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const src = `${BASE_URL}nutrition/${selectedResource.filename}`;
                                        fetch(src)
                                            .then(r => r.blob())
                                            .then(blob => {
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = selectedResource.filename;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(url);
                                            })
                                            .catch(() => window.open(src, '_blank'));
                                    }}
                                    className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors text-sm font-medium"
                                >
                                    <Download size={16} /> Download
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Nutrition;
