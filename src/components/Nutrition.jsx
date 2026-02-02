import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Droplets, Apple, Scale, ChevronRight, Smartphone, ThumbsUp, Box, Zap, BookOpen, ShoppingCart, ExternalLink } from 'lucide-react';

const Nutrition = () => {
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

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-marine-red/10 rounded-lg">
                        <Utensils className="w-8 h-8 text-marine-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">Performance Fueling</h1>
                        <p className="text-gray-500 dark:text-gray-400">Maximize your performance options in and around the installation.</p>
                    </div>
                </div>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                {/* Garrison Dining Section */}
                <motion.section variants={item} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600">
                            <Utensils size={24} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Garrison Dining</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Week at a glance menus at USMC CONUS mess halls with nutrition facts and dietitian coded recipes for performance fueling choices.
                            </p>

                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-100 dark:border-gray-600">
                                <div className="flex items-center gap-3 mb-3">
                                    <Smartphone className="text-marine-red" size={20} />
                                    <h3 className="font-bold text-gray-900 dark:text-white">The EVERYDAY APP</h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                    Formerly known as the Charge app. Available to all Marines to engage with programming through the News Feed.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-marine-red mt-1">•</span>
                                        <span>iOS and Android App versions available.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-marine-red mt-1">•</span>
                                        <span>Search for installation and find connected mess hall menus.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-marine-red mt-1">•</span>
                                        <span>Complete menus for each day and cycle to help make informed choices.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-marine-red mt-1">•</span>
                                        <span>Simple feedback tool for real-time dining experience feedback.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Commissary Shopping Section */}
                <motion.section variants={item}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ShoppingCart className="text-marine-red" size={24} />
                        Commissary Shopping: Shop in the Know!
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* CLICK2GO */}
                        <div className="card hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                    <Smartphone size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Commissary CLICK2GO</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Convenience updates making shopping easy. Access online payment/curbside pickup, digital coupons, sales flyers, and dietitian-approved recipes.
                            </p>
                            <a href="https://corp.commissaries.com/shopping/click-2-go" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                Download App <ExternalLink size={14} />
                            </a>
                        </div>

                        {/* Dietitian Approved Thumb (DAT) */}
                        <div className="card hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                                    <ThumbsUp size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Dietitian Approved Thumb (DAT)</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Shelf tags making it easy to identify nutrient-dense foods: lean proteins, healthy fats, and whole grains. Look for the label while shopping.
                            </p>
                            <a href="https://corp.commissaries.com/healthy-living/dietitian-approved-thumb" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1">
                                Learn More <ExternalLink size={14} />
                            </a>
                        </div>

                        {/* Thinking Outside the Box */}
                        <div className="card hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                    <Box size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Thinking Outside the Box (TOTB)</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Easy, economical, dietitian-approved meal solutions. Recipes align with Dietary Guidelines for Americans and include nutrition tips.
                            </p>
                        </div>

                        {/* Fueling Stations */}
                        <div className="card hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-lg">
                                    <Zap size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Fueling Stations</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Grab-n-go nutritious snacks and meals. Great for pre/post workout refueling. An alternative to the drive-thru.
                            </p>
                            <a href="https://corp.commissaries.com/healthy-living/healthy-eats" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-yellow-600 hover:text-yellow-800 flex items-center gap-1">
                                Find Locations <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </motion.section>

                {/* Warfighter Nutrition Guide */}
                <motion.section variants={item} className="bg-marine-red text-white rounded-2xl p-6 shadow-md">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                            <BookOpen size={32} className="text-marine-gold" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-xl font-bold mb-2">Warfighter Nutrition Guide</h2>
                            <p className="text-red-100 mb-4">
                                Strategies and recommendations for obtaining the cognitive and physiological edge. Covers the spectrum of nutritional needs to optimize performance under rigorous conditions.
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
        </div>
    );
};

export default Nutrition;
