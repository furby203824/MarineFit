import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Clock, Battery, Sun, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Info, Zap, Thermometer, Eye, Coffee, Smartphone, Bed, Timer, Target } from 'lucide-react';

const SleepOptimizer = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [sleepDebt, setSleepDebt] = useState({ hoursSlept: 7, targetHours: 8 });
    const [checkedItems, setCheckedItems] = useState({});

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

    const toggleCheck = (category, index) => {
        const key = `${category}-${index}`;
        setCheckedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const sleepHygieneContent = {
        title: "Sleep Hygiene",
        subtitle: "Environmental and behavioral optimization for deep restorative sleep",
        categories: [
            {
                name: "Environment",
                icon: Thermometer,
                items: [
                    { title: "Temperature", desc: "Keep room between 65-68°F (18-20°C). Core body temperature drop triggers sleep." },
                    { title: "Darkness", desc: "Use blackout curtains or eye mask. Even small light exposure suppresses melatonin by 50%." },
                    { title: "Noise Control", desc: "Use white noise or earplugs. Consistent background noise masks disruptive sounds." },
                    { title: "Mattress & Pillow", desc: "Replace mattress every 7-10 years. Pillow should support neutral spine alignment." },
                    { title: "Clean Air", desc: "Keep room ventilated. CO2 buildup impairs sleep quality and cognitive function." }
                ]
            },
            {
                name: "Pre-Sleep Routine",
                icon: Moon,
                items: [
                    { title: "Wind-Down Period", desc: "Start 60-90 minutes before bed. Dim lights, reduce stimulation, calm activities only." },
                    { title: "No Screens", desc: "Stop screen use 1 hour before bed. Blue light delays melatonin release by up to 3 hours." },
                    { title: "Hot Shower/Bath", desc: "Take 10-15 min before bed. The subsequent body cooling mimics natural sleep onset." },
                    { title: "Journaling", desc: "Write tomorrow's tasks before bed. Reduces cognitive arousal and worry loops." },
                    { title: "Breathing Exercise", desc: "4-7-8 technique: Inhale 4s, hold 7s, exhale 8s. Activates parasympathetic nervous system." }
                ]
            },
            {
                name: "Things to Avoid",
                icon: AlertTriangle,
                items: [
                    { title: "Caffeine After 1400", desc: "Caffeine half-life is 5-6 hours. A 1400 coffee still has 25% active at 2200." },
                    { title: "Alcohol Before Bed", desc: "Alcohol fragments sleep architecture and suppresses REM. Avoid within 3 hours of sleep." },
                    { title: "Heavy Meals Late", desc: "Large meals within 2-3 hours of bed impair sleep quality. Light snacks are OK." },
                    { title: "Intense Exercise", desc: "Avoid high-intensity training within 3 hours of bed. Elevates core temp and cortisol." },
                    { title: "Clock Watching", desc: "Turn clocks away. Checking time increases anxiety and makes falling asleep harder." }
                ]
            }
        ]
    };

    const circadianContent = {
        title: "Circadian Rhythm",
        subtitle: "Aligning light exposure and activity with your biological clock",
        schedules: [
            {
                time: "0530-0700",
                name: "Wake Window",
                icon: Sun,
                color: "text-orange-500",
                bg: "bg-orange-50",
                actions: [
                    "Get bright light exposure within 30 min of waking",
                    "Outdoor sunlight is 10x more effective than indoor light",
                    "On cloudy days, still go outside - still 1000+ lux",
                    "If waking before sunrise, use a 10,000 lux light box for 20-30 min"
                ]
            },
            {
                time: "0700-1200",
                name: "Peak Performance",
                icon: Zap,
                color: "text-yellow-500",
                bg: "bg-yellow-50",
                actions: [
                    "Cortisol peaks 30-45 min after waking - ideal for challenging tasks",
                    "Schedule demanding physical or cognitive work here",
                    "Morning exercise reinforces circadian rhythm",
                    "Caffeine OK but delay 90-120 min after waking for best effect"
                ]
            },
            {
                time: "1200-1500",
                name: "Post-Lunch Dip",
                icon: Battery,
                color: "text-green-500",
                bg: "bg-green-50",
                actions: [
                    "Natural alertness dip occurs regardless of food intake",
                    "Ideal window for tactical napping (10-20 min)",
                    "Light exposure helps maintain alertness",
                    "Avoid heavy carbohydrate meals which amplify drowsiness"
                ]
            },
            {
                time: "1500-1900",
                name: "Second Wind",
                icon: Target,
                color: "text-blue-500",
                bg: "bg-blue-50",
                actions: [
                    "Body temperature peaks - optimal for physical performance",
                    "Reaction time and coordination at daily best",
                    "Good window for strength training",
                    "Last caffeine should be before 1400"
                ]
            },
            {
                time: "1900-2100",
                name: "Wind Down",
                icon: Moon,
                color: "text-indigo-500",
                bg: "bg-indigo-50",
                actions: [
                    "Dim lights to 50% or less - use warm (2700K) bulbs",
                    "Enable night mode on all devices",
                    "Melatonin naturally rises as light decreases",
                    "Light meals, calm activities, social time"
                ]
            },
            {
                time: "2100-0530",
                name: "Sleep Phase",
                icon: Bed,
                color: "text-purple-500",
                bg: "bg-purple-50",
                actions: [
                    "Complete darkness supports melatonin production",
                    "Bathroom lights should be red/amber only",
                    "If you wake, avoid checking phone (blue light resets clock)",
                    "Consistent bed/wake times more important than total hours"
                ]
            }
        ],
        lightGuidelines: [
            { condition: "Morning (0-2 hrs after wake)", recommendation: "Maximum bright light, outdoor if possible" },
            { condition: "Midday", recommendation: "Regular indoor/outdoor light fine" },
            { condition: "Evening (after 1900)", recommendation: "Dim to 50%, warm spectrum only" },
            { condition: "Pre-bed (1 hr before)", recommendation: "Minimal light, avoid screens" },
            { condition: "During sleep", recommendation: "Complete darkness, use blackout curtains" }
        ]
    };

    const recoveryContent = {
        title: "Recovery Tracking",
        subtitle: "Monitor sleep debt and adjust training intensity accordingly",
        sleepStages: [
            {
                name: "Light Sleep (N1/N2)",
                percent: "50-55%",
                purpose: "Transition phase, memory consolidation begins",
                color: "bg-blue-200"
            },
            {
                name: "Deep Sleep (N3)",
                percent: "15-25%",
                purpose: "Physical recovery, growth hormone release, immune function",
                color: "bg-indigo-400"
            },
            {
                name: "REM Sleep",
                percent: "20-25%",
                purpose: "Cognitive recovery, emotional processing, skill consolidation",
                color: "bg-purple-400"
            }
        ],
        debtEffects: [
            { debt: "1-2 hours", impact: "Minor: 10-15% cognitive decline, reaction time +10%", training: "Full training OK, monitor RPE" },
            { debt: "3-5 hours", impact: "Moderate: 25% cognitive decline, coordination affected", training: "Reduce intensity 15-20%, avoid complex skills" },
            { debt: "6-10 hours", impact: "Significant: Equivalent to 0.05 BAC impairment", training: "Light training only, focus on mobility/recovery" },
            { debt: "10+ hours", impact: "Severe: Equivalent to 0.10 BAC, judgment impaired", training: "Rest day mandatory, prioritize sleep" }
        ],
        recoveryRates: [
            { method: "Regular Night Sleep", rate: "1-2 hours debt recovered per night" },
            { method: "Extended Sleep (10+ hrs)", rate: "Can recover 3-4 hours per session" },
            { method: "Napping", rate: "20-30 min nap = ~1 hour debt recovered" }
        ]
    };

    const tacticalNappingContent = {
        title: "Tactical Napping",
        subtitle: "Protocols for short-duration sleep to restore alertness in the field",
        protocols: [
            {
                name: "Power Nap",
                duration: "10-20 minutes",
                icon: Zap,
                color: "text-yellow-500",
                bg: "bg-yellow-50",
                benefits: [
                    "Immediate alertness boost lasting 2-3 hours",
                    "No sleep inertia (grogginess) upon waking",
                    "Can be done in any position, even sitting"
                ],
                instructions: [
                    "Set alarm for 20 minutes (allows time to fall asleep)",
                    "Find quiet, dim location if possible",
                    "Close eyes even if you don't fall fully asleep",
                    "Resting without sleep still provides 50% of benefits"
                ],
                bestFor: "Mid-mission alertness restoration, post-lunch dip"
            },
            {
                name: "NASA Nap",
                duration: "26 minutes",
                icon: Target,
                color: "text-blue-500",
                bg: "bg-blue-50",
                benefits: [
                    "NASA research showed 34% improvement in performance",
                    "54% improvement in alertness",
                    "Optimal for sustained operations"
                ],
                instructions: [
                    "NASA protocol: exactly 26 minutes works best",
                    "Pilots showed improved reaction time and vigilance",
                    "Schedule during natural dip (1300-1500)",
                    "Avoid napping after 1500 to protect nighttime sleep"
                ],
                bestFor: "Extended operations, shift work, jet lag recovery"
            },
            {
                name: "Coffee Nap",
                duration: "20 minutes (after caffeine)",
                icon: Coffee,
                color: "text-amber-600",
                bg: "bg-amber-50",
                benefits: [
                    "Caffeine takes 20 min to reach brain",
                    "Wake up as caffeine kicks in for double benefit",
                    "Research shows superior alertness vs nap or coffee alone"
                ],
                instructions: [
                    "Drink coffee/caffeine quickly (don't sip slowly)",
                    "Immediately lie down and close eyes",
                    "Set alarm for 20 minutes",
                    "Wake up to caffeine + nap recovery combined"
                ],
                bestFor: "Maximum alertness when severely fatigued"
            },
            {
                name: "Full Cycle Nap",
                duration: "90 minutes",
                icon: Moon,
                color: "text-indigo-500",
                bg: "bg-indigo-50",
                benefits: [
                    "Complete one full sleep cycle",
                    "Includes light, deep, and REM sleep",
                    "Significant physical and cognitive recovery"
                ],
                instructions: [
                    "Only use when you have protected time",
                    "Set alarm for 90 minutes exactly",
                    "Waking mid-cycle causes severe grogginess",
                    "Plan 10-15 min post-nap buffer before demanding tasks"
                ],
                bestFor: "Pre-mission rest banking, recovery from severe debt"
            }
        ],
        fieldTips: [
            { tip: "Position", detail: "45-degree recline is nearly as effective as lying flat" },
            { tip: "Eye Cover", detail: "Even a patrol cap over eyes helps; darkness isn't required but helps" },
            { tip: "Noise", detail: "Combat earplugs or earbuds with white noise if available" },
            { tip: "Timing", detail: "Even 5-10 min eyes-closed rest provides measurable benefit" },
            { tip: "Pre-Mission", detail: "If you know sleep will be limited, 'bank' sleep 2-3 days before" }
        ]
    };

    const renderSectionContent = (section) => {
        switch(section) {
            case 'hygiene':
                return (
                    <div className="space-y-6">
                        <p className="text-gray-600 dark:text-gray-300">{sleepHygieneContent.subtitle}</p>

                        {sleepHygieneContent.categories.map((category, catIndex) => (
                            <div key={catIndex} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                    <category.icon className="w-5 h-5 text-marine-red" />
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{category.name}</h4>
                                </div>
                                <div className="p-4 space-y-3">
                                    {category.items.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            onClick={() => toggleCheck('hygiene-' + catIndex, itemIndex)}
                                            className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                checkedItems[`hygiene-${catIndex}-${itemIndex}`]
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-gray-300 dark:border-gray-500'
                                            }`}>
                                                {checkedItems[`hygiene-${catIndex}-${itemIndex}`] && (
                                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <h5 className="font-medium text-gray-900 dark:text-white">{item.title}</h5>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'circadian':
                return (
                    <div className="space-y-6">
                        <p className="text-gray-600 dark:text-gray-300">{circadianContent.subtitle}</p>

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Daily Rhythm Schedule</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Align your activities with your body's natural patterns</p>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {circadianContent.schedules.map((phase, index) => (
                                    <div key={index} className="p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className={`p-2 rounded-lg ${phase.bg} dark:bg-opacity-20`}>
                                                <phase.icon className={`w-5 h-5 ${phase.color}`} />
                                            </div>
                                            <div>
                                                <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{phase.time}</span>
                                                <h5 className="font-semibold text-gray-900 dark:text-white">{phase.name}</h5>
                                            </div>
                                        </div>
                                        <ul className="ml-12 space-y-1">
                                            {phase.actions.map((action, i) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                    <span className="text-marine-red mt-1">•</span>
                                                    {action}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                            <div className="flex items-center gap-2 mb-3">
                                <Sun className="w-5 h-5 text-orange-600" />
                                <h4 className="font-semibold text-orange-900 dark:text-orange-300">Light Exposure Guidelines</h4>
                            </div>
                            <div className="space-y-2">
                                {circadianContent.lightGuidelines.map((guideline, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-orange-200 dark:border-orange-800 last:border-0">
                                        <span className="text-sm font-medium text-orange-800 dark:text-orange-300">{guideline.condition}</span>
                                        <span className="text-sm text-orange-700 dark:text-orange-400">{guideline.recommendation}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'recovery':
                return (
                    <div className="space-y-6">
                        <p className="text-gray-600 dark:text-gray-300">{recoveryContent.subtitle}</p>

                        {/* Sleep Debt Calculator */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Sleep Debt Calculator</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Hours Slept (avg/night)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="12"
                                        step="0.5"
                                        value={sleepDebt.hoursSlept}
                                        onChange={(e) => setSleepDebt(prev => ({...prev, hoursSlept: parseFloat(e.target.value) || 0}))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-marine-red focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Target Hours</label>
                                    <input
                                        type="number"
                                        min="6"
                                        max="10"
                                        step="0.5"
                                        value={sleepDebt.targetHours}
                                        onChange={(e) => setSleepDebt(prev => ({...prev, targetHours: parseFloat(e.target.value) || 8}))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-marine-red focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div className={`p-4 rounded-lg ${
                                (sleepDebt.targetHours - sleepDebt.hoursSlept) * 7 <= 0 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                                (sleepDebt.targetHours - sleepDebt.hoursSlept) * 7 <= 5 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
                                (sleepDebt.targetHours - sleepDebt.hoursSlept) * 7 <= 10 ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800' :
                                'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            }`}>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Weekly Sleep Debt</p>
                                    <p className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
                                        {Math.max(0, (sleepDebt.targetHours - sleepDebt.hoursSlept) * 7).toFixed(1)} hours
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        {(sleepDebt.targetHours - sleepDebt.hoursSlept) * 7 <= 0
                                            ? "No debt - maintaining optimal sleep!"
                                            : `Daily deficit: ${(sleepDebt.targetHours - sleepDebt.hoursSlept).toFixed(1)} hours`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sleep Stages */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Sleep Stages & Their Purpose</h4>
                            <div className="space-y-3">
                                {recoveryContent.sleepStages.map((stage, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className={`w-16 h-8 ${stage.color} rounded flex items-center justify-center`}>
                                            <span className="text-xs font-bold text-white">{stage.percent}</span>
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-gray-900 dark:text-white">{stage.name}</h5>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">{stage.purpose}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Debt Effects Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Sleep Debt Impact on Training</h4>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {recoveryContent.debtEffects.map((effect, index) => (
                                    <div key={index} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-semibold text-marine-red">{effect.debt} debt</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Impact:</strong> {effect.impact}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300"><strong>Training:</strong> {effect.training}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recovery Rates */}
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-3">
                                <Battery className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-green-900 dark:text-green-300">Recovery Rates</h4>
                            </div>
                            <div className="space-y-2">
                                {recoveryContent.recoveryRates.map((rate, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-800 last:border-0">
                                        <span className="text-sm font-medium text-green-800 dark:text-green-300">{rate.method}</span>
                                        <span className="text-sm text-green-700 dark:text-green-400">{rate.rate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'napping':
                return (
                    <div className="space-y-6">
                        <p className="text-gray-600 dark:text-gray-300">{tacticalNappingContent.subtitle}</p>

                        {/* Napping Protocols */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tacticalNappingContent.protocols.map((protocol, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className={`p-4 ${protocol.bg} dark:bg-opacity-20 border-b border-gray-200 dark:border-gray-700`}>
                                        <div className="flex items-center gap-3">
                                            <protocol.icon className={`w-6 h-6 ${protocol.color}`} />
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{protocol.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{protocol.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Benefits</h5>
                                            <ul className="space-y-1">
                                                {protocol.benefits.map((benefit, i) => (
                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        {benefit}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Instructions</h5>
                                            <ol className="space-y-1">
                                                {protocol.instructions.map((instruction, i) => (
                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                        <span className="font-semibold text-marine-red">{i + 1}.</span>
                                                        {instruction}
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400"><strong>Best for:</strong> {protocol.bestFor}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Field Tips */}
                        <div className="bg-gray-800 rounded-xl p-4 text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-gray-300" />
                                <h4 className="font-semibold">Field Environment Tips</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {tacticalNappingContent.fieldTips.map((tip, index) => (
                                    <div key={index} className="bg-gray-700 rounded-lg p-3">
                                        <h5 className="font-medium text-gray-200">{tip.tip}</h5>
                                        <p className="text-sm text-gray-400 mt-1">{tip.detail}</p>
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

    const sections = [
        {
            id: 'hygiene',
            title: "Sleep Hygiene",
            desc: "Environmental and behavioral optimization for deep restorative sleep.",
            icon: Moon,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            id: 'circadian',
            title: "Circadian Rhythm",
            desc: "Aligning light exposure and activity with your biological clock.",
            icon: Sun,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            id: 'recovery',
            title: "Recovery Tracking",
            desc: "Monitor sleep debt and recovery scores to adjust training intensity.",
            icon: Battery,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            id: 'napping',
            title: "Tactical Napping",
            desc: "Protocols for short-duration sleep to restore alertness in the field.",
            icon: Clock,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

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
                        <Moon className="w-8 h-8 text-marine-red" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white m-0">
                            {activeSection
                                ? sections.find(s => s.id === activeSection)?.title
                                : 'Sleep Optimizer'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">Recovery is a weapon system</p>
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!activeSection ? (
                    <motion.div
                        key="sections"
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
                                    "No caffeine after 1400 (6+ hours before bed)",
                                    "Room temperature set to 65-68°F (18-20°C)",
                                    "Blue light filters enabled on all devices",
                                    "Wind-down routine started 60 min before bed",
                                    "No screens 1 hour before sleep"
                                ].map((checkItem, i) => (
                                    <div
                                        key={i}
                                        onClick={() => toggleCheck('tonight', i)}
                                        className="flex items-center gap-3 cursor-pointer hover:bg-indigo-800 p-2 rounded-lg transition-colors"
                                    >
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                            checkedItems[`tonight-${i}`]
                                                ? 'bg-green-400 border-green-400'
                                                : 'border-indigo-400'
                                        }`}>
                                            {checkedItems[`tonight-${i}`] && (
                                                <CheckCircle2 className="w-4 h-4 text-indigo-900" />
                                            )}
                                        </div>
                                        <span className={`${checkedItems[`tonight-${i}`] ? 'text-indigo-300 line-through' : 'text-indigo-100'}`}>
                                            {checkItem}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
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

export default SleepOptimizer;
