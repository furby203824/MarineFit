import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Play, ExternalLink, ChevronDown, Dumbbell, Zap, Wind, Move, X } from 'lucide-react';
import exerciseData from '../data/exercises.json';

const ExerciseLibrary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        { name: 'All', icon: Dumbbell, color: 'text-marine-red', bg: 'bg-marine-red/10' },
        { name: 'Movement Prep', icon: Wind, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { name: 'Strength & Power', icon: Dumbbell, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
        { name: 'Speed, Agility & Endurance', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
        { name: 'Flexibility & Mobility', icon: Move, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' }
    ];

    const filteredExercises = useMemo(() => {
        return exerciseData.exercises.filter(exercise => {
            const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || exercise.type === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const groupedExercises = useMemo(() => {
        const groups = {};
        filteredExercises.forEach(exercise => {
            if (!groups[exercise.type]) {
                groups[exercise.type] = [];
            }
            groups[exercise.type].push(exercise);
        });
        return groups;
    }, [filteredExercises]);

    const getCategoryIcon = (type) => {
        const category = categories.find(c => c.name === type);
        return category ? category.icon : Dumbbell;
    };

    const getCategoryColor = (type) => {
        const category = categories.find(c => c.name === type);
        return category ? category.color : 'text-gray-600';
    };

    const getCategoryBg = (type) => {
        const category = categories.find(c => c.name === type);
        return category ? category.bg : 'bg-gray-50';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-marine-red/10 rounded-lg">
                        <Dumbbell className="w-8 h-8 text-marine-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Exercise Library</h1>
                        <p className="text-gray-500 dark:text-gray-400">Official USMC Fitness Exercises</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-marine-red">{exerciseData.metadata.total_exercises}</span> exercises available
                </div>
            </header>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-marine-red focus:border-transparent transition-all"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Filter Toggle (Mobile) */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl"
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Category Filters */}
                <AnimatePresence>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className={`${showFilters ? 'block' : 'hidden md:block'}`}
                    >
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                const isActive = selectedCategory === category.name;
                                const count = category.name === 'All'
                                    ? exerciseData.metadata.total_exercises
                                    : exerciseData.metadata.category_counts[category.name] || 0;

                                return (
                                    <button
                                        key={category.name}
                                        onClick={() => setSelectedCategory(category.name)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                            isActive
                                                ? 'bg-marine-red text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{category.name}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                                            isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                                        }`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredExercises.length}</span> exercises
                {searchTerm && <span> matching "{searchTerm}"</span>}
            </div>

            {/* Exercise List */}
            <div className="space-y-8">
                {Object.entries(groupedExercises).map(([type, exercises]) => {
                    const Icon = getCategoryIcon(type);
                    return (
                        <motion.div
                            key={type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            {/* Category Header */}
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${getCategoryBg(type)}`}>
                                    <Icon className={`w-5 h-5 ${getCategoryColor(type)}`} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{type}</h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">({exercises.length})</span>
                            </div>

                            {/* Exercise Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {exercises.map((exercise, index) => (
                                    <motion.a
                                        key={index}
                                        href={exercise.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-lg hover:border-marine-red dark:hover:border-marine-red transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-marine-red transition-colors">
                                                    {exercise.name}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {exercise.type}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-marine-red opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-4 h-4" />
                                                <ExternalLink className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* No Results */}
            {filteredExercises.length === 0 && (
                <div className="text-center py-12">
                    <Dumbbell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No exercises found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter criteria
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('All');
                        }}
                        className="mt-4 px-4 py-2 bg-marine-red text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Source Attribution */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Exercise videos provided by <span className="font-semibold">Marine Corps Fitness</span> via DVIDSHUB
                </p>
            </div>
        </div>
    );
};

export default ExerciseLibrary;
