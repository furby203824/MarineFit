import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Utensils, Droplets, Apple, Scale, ChevronRight, ChevronLeft, Smartphone, ThumbsUp,
    Box, Zap, BookOpen, ShoppingCart, ExternalLink, Target, Shield, FileText,
    CheckCircle2, AlertTriangle, XCircle, Salad, Wheat, Egg, Beef, Coffee, Leaf
} from 'lucide-react';

const Nutrition = () => {
    const [activeSection, setActiveSection] = useState(null);

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

    const keyFacts = [
        "Science-based and effective nutrition strategies to help optimize performance during training, operations, and daily work life",
        "Focuses on nutrient composition, total intake, timing, location, and physiological and psychological impact",
        "Designed to optimize resiliency, readiness, lethality and preserve health",
        "Nutritional fitness is an essential component of total force fitness as poor nutrition degrades mission readiness and contributes to a variety of other health disorders"
    ];

    const references = [
        { code: "MCO 10110.49", title: "Nutrition and Menu Standards for Human Performance Optimization" },
        { code: "MCO 10110.14N", title: "Marine Corps Food Service and Subsistence Program" },
        { code: "DoD 1338.10", title: "DoD Menu Standards" },
        { code: "USDA", title: "Dietary Guidelines for Healthy Americans" },
        { code: "USMC", title: "Fueled to Fight® Nutrition Education Program" },
        { code: "USMC", title: "Buyer's Guide for ingredient evaluation to industry on cleaner products" }
    ];

    const fueledToFightRatings = [
        {
            level: "GREEN",
            label: "Engage at Will",
            color: "bg-green-500",
            textColor: "text-green-600",
            bgLight: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-800",
            icon: CheckCircle2,
            description: "These foods are great choices for overall health, physical and mental performance."
        },
        {
            level: "YELLOW",
            label: "Well Aimed Shots",
            color: "bg-yellow-500",
            textColor: "text-yellow-600",
            bgLight: "bg-yellow-50 dark:bg-yellow-900/20",
            borderColor: "border-yellow-200 dark:border-yellow-800",
            icon: AlertTriangle,
            description: "These foods should be consumed occasionally because they are higher in total fat and saturated fat."
        },
        {
            level: "RED",
            label: "Check Fire",
            color: "bg-red-500",
            textColor: "text-red-600",
            bgLight: "bg-red-50 dark:bg-red-900/20",
            borderColor: "border-red-200 dark:border-red-800",
            icon: XCircle,
            description: "Limit the intake of these foods because they are the highest in unhealthy fat and may decrease performance."
        }
    ];

    const garrisonDiningFeatures = [
        {
            icon: Target,
            title: "Performance Fuel Main Line",
            desc: "USMC Fueled to Fight® performance fuel requirement on main line for entrée, side, and vegetable"
        },
        {
            icon: Salad,
            title: "Cold Bar",
            desc: "Nutrient dense/quality items for a more robust salad bar at all meals - seeds, nuts, trail mixes, yogurt parfaits, fresh seasonal fruit, vegetables"
        },
        {
            icon: Box,
            title: "Convenience Line",
            desc: "Variety of 'Engage at Will' options for carryout with healthier choices presented up front for ease of access"
        },
        {
            icon: Wheat,
            title: "Whole Grains",
            desc: "Whole grain options provided throughout the menu to minimize empty calories"
        },
        {
            icon: Apple,
            title: "Vitamin Rich Options",
            desc: "Good sources of vitamin A or vitamin C at every meal - colorful, dark leafy and deep yellow, orange and red vegetables"
        },
        {
            icon: Egg,
            title: "Protein Options",
            desc: "Egg whites or substitutes as alternative to whole eggs; leaner, high quality proteins available"
        },
        {
            icon: Beef,
            title: "Comfort Foods",
            desc: "Red 'Check Fire' items (cheeseburgers, pizza, desserts) NOT eliminated - available with informed choices"
        },
        {
            icon: Coffee,
            title: "Specialty Bars",
            desc: "Variety of menu concepts offering highly acceptable nutritious entrees as alternatives to main or convenience lines"
        }
    ];

    const sections = [
        {
            id: 'fueled',
            title: 'Fueled to Fight®',
            desc: 'USMC Mess Hall Nutrition Education Program with stoplight rating system',
            icon: Target,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            id: 'garrison',
            title: 'Garrison Dining',
            desc: 'Performance fueling options and features at USMC mess halls',
            icon: Utensils,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            id: 'commissary',
            title: 'Commissary Shopping',
            desc: 'Shop in the know with dietitian-approved options',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            id: 'references',
            title: 'Requirements & References',
            desc: 'Official USMC orders and nutrition program documentation',
            icon: FileText,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        }
    ];

    const renderSectionContent = (section) => {
        switch(section) {
            case 'fueled':
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">About the Program</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                                This "stoplight" rating system is an educational tool with posted signage to assist mess hall patrons
                                in selecting healthier options more frequently. It is displayed on the main line.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                The program requires an examination of each food/recipe as a whole, including additives,
                                degree of processing, and nutrient values (density and quality). The specific nutrient criteria
                                evaluates total and saturated fat, fiber, sugar, sodium, and micronutrient values for military
                                dietary reference intake (MDRI).
                            </p>
                        </div>

                        <div className="space-y-4">
                            {fueledToFightRatings.map((rating, index) => {
                                const Icon = rating.icon;
                                return (
                                    <div
                                        key={index}
                                        className={`${rating.bgLight} rounded-xl p-4 border ${rating.borderColor}`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`${rating.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className={`font-bold ${rating.textColor}`}>{rating.level}</h4>
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating.label}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm ml-15">
                                            {rating.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'garrison':
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Week at a glance menus at USMC CONUS mess halls with nutrition facts and dietitian coded
                                recipes for performance fueling choices. Patrons have the opportunity to provide feedback
                                on acceptability of menu items, and additional portions ("seconds") are offered during each dining visit.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {garrisonDiningFeatures.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-marine-red/10 rounded-lg">
                                                <Icon className="w-5 h-5 text-marine-red" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
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

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-green-900 dark:text-green-300">Cost Effective Dining</h4>
                            </div>
                            <p className="text-sm text-green-800 dark:text-green-300">
                                Cost effective dining for uniformed patrons and no cost to Marines on essential station messing (ESM)
                                and entitled to subsist at government expense (meal cards).
                            </p>
                        </div>
                    </div>
                );

            case 'commissary':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* CLICK2GO */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
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
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
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
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
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
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
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
                    </div>
                );

            case 'references':
                return (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Official Requirements & References</h4>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {references.map((ref, index) => (
                                    <div key={index} className="p-4 flex items-start gap-3">
                                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <FileText className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <span className="font-mono text-sm text-marine-red">{ref.code}</span>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">{ref.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
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
                                : 'Nutritional Fitness'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {activeSection
                                ? sections.find(s => s.id === activeSection)?.desc
                                : 'Optimize performance through science-based nutrition strategies'}
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
                        {/* Key Facts */}
                        <motion.div variants={container} initial="hidden" animate="show">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-marine-red/10 rounded-lg">
                                        <Shield className="w-5 h-5 text-marine-red" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nutritional Fitness in the USMC</h2>
                                </div>
                                <ul className="space-y-3">
                                    {keyFacts.map((fact, index) => (
                                        <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                            <span className="text-marine-red font-bold mt-0.5">•</span>
                                            <span className="text-sm">{fact}</span>
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
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {sections.map((section, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    onClick={() => setActiveSection(section.id)}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${section.bg} dark:bg-opacity-20`}>
                                            <section.icon className={`w-6 h-6 ${section.color}`} />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600 group-hover:text-marine-red transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-marine-red transition-colors">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
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
                ) : (
                    <motion.div
                        key="section"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {renderSectionContent(activeSection)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Nutrition;
