import React from 'react';
import {
    Smartphone, ThumbsUp, Box, Zap, ExternalLink,
    CheckCircle2, AlertTriangle, XCircle, Wheat, Egg,
    Activity, Flame, FlaskConical, TrendingUp, Package,
    MapPin, ThermometerSun, AlertOctagon, Maximize2, FileText
} from 'lucide-react';
import {
    fueledToFightRatings, macronutrients, timingPhases,
    dehydrationEffects, dehydrationSigns, hydrationProtocol, environmentHydration,
    supplementWarnings, supplementQuestions, garrisonDiningFeatures,
    energyNeeds, operationalRations, missionPlanning, fieldNutrientTargets,
    visualResources, references
} from '../../data/nutritionData';

const NutritionSectionContent = ({ section, onSelectResource }) => {
    switch (section) {
        case 'resources':
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {visualResources.map((resource, idx) => (
                        <div
                            key={idx}
                            className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                            onClick={() => onSelectResource(resource)}
                        >
                            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                <img
                                    src={`/nutrition/${resource.filename}`}
                                    alt={resource.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                    <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all drop-shadow-md" size={32} />
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{resource.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{resource.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        case 'fueled':
            return (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Program Purpose</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-start gap-2"><span className="text-marine-red">•</span>Define a single system for product identification enhancing Marines' ability to make healthy choices</li>
                            <li className="flex items-start gap-2"><span className="text-marine-red">•</span>Provide identifiable choices - NOT to prevent options</li>
                            <li className="flex items-start gap-2"><span className="text-marine-red">•</span>Empower and educate Marines on making informed fueling decisions</li>
                            <li className="flex items-start gap-2"><span className="text-marine-red">•</span>All foods CAN fit into a performance nutrition meal plan</li>
                        </ul>
                    </div>

                    <div className="bg-marine-red/10 rounded-xl p-4 border border-marine-red/20">
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                            <strong className="text-marine-red">Performance Nutrition Messaging:</strong> Just as the Corps teaches Marines to locate, close with, and destroy the enemy, USMC Fueled to Fight® empowers Marines on how to make informed fueling decisions to maintain high performance supporting the mission.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {fueledToFightRatings.map((rating, index) => {
                            const Icon = rating.icon;
                            return (
                                <div key={index} className={`${rating.bgLight} rounded-xl p-4 border ${rating.borderColor}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`${rating.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold ${rating.textColor}`}>{rating.level}</h4>
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{rating.label}</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm ml-15">{rating.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Classification Criteria</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Color coding requires examination of each food as a whole, including additives, degree of processing, and nutrient values. Evaluates: total and saturated fat, fiber, sugar, sodium, and micronutrient values against Military Dietary Reference Intake (MDRI).
                        </p>
                    </div>
                </div>
            );

        case 'macros':
            return (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">The 80/20 Rule</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            Choose foods that are best for you <strong className="text-green-600">80%</strong> of the time. Incorporate some foods that may not be the best, but are your favorites, <strong className="text-yellow-600">20%</strong> of the time.
                        </p>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                <strong>Critical:</strong> Marines need adequate Calories to support high-intensity training. Inadequate Calories can result in loss of muscle mass, loss of bone density, and increased risk of fatigue, illness, injuries, and poor recovery.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {macronutrients.map((macro, index) => {
                            const Icon = macro.icon;
                            return (
                                <div key={index} className={`bg-white dark:bg-gray-800 rounded-xl border ${macro.border} overflow-hidden`}>
                                    <div className={`${macro.bg} p-4 border-b ${macro.border}`}>
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-6 h-6 ${macro.color}`} />
                                            <h4 className={`font-bold ${macro.color}`}>{macro.name}</h4>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Main Sources</p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{macro.sources}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Functions</p>
                                            <ul className="space-y-1">
                                                {macro.functions.map((func, i) => (
                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                        {func}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Recommended Intake</p>
                                            <p className="text-sm font-medium text-marine-red">{macro.intake}</p>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400"><strong>Tip:</strong> {macro.tips}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-marine-red text-white rounded-xl p-4">
                        <h4 className="font-bold mb-2">Optimal Meal Composition</h4>
                        <p className="text-red-100 text-sm">
                            For maximum physical and mental performance, at every meal eat <strong>carbohydrates + protein</strong> and drink <strong>milk</strong>. This combination provides sustained energy, muscle support, and essential nutrients.
                        </p>
                    </div>
                </div>
            );

        case 'timing':
            return (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Why Timing Matters</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            The timing of <strong>"when"</strong> nutrients are consumed is just as critical as <strong>"what"</strong> nutrients are consumed. Proper timing maximizes nutrient absorption, maintains blood glucose, and optimizes the gut microbiome's response to stress in warfighter training.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {timingPhases.map((phase, index) => {
                            const Icon = phase.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className={`${phase.bg} p-4 border-b border-gray-200 dark:border-gray-700`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon className={`w-6 h-6 ${phase.color}`} />
                                                <div>
                                                    <h4 className={`font-bold ${phase.color}`}>{phase.phase}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{phase.timing}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            <strong>Goal:</strong> {phase.goal}
                                        </p>
                                        <ul className="space-y-2">
                                            {phase.recommendations.map((rec, i) => (
                                                <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                    <span className="text-marine-red font-bold">•</span>
                                                    {rec}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-green-900 dark:text-green-300">The Critical 30-45 Minute Window</h4>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                            Immediately after exercise, when glycogen stores are low and muscle protein synthesis is suppressed, is the <strong>critical time</strong> to provide what the body needs.
                        </p>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mt-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong className="text-marine-red">PENS (Post-Exercise Nutrition Support):</strong> ~4:1 ratio of carbohydrate to protein. This is based on strong evidence from numerous studies and is recommended for individuals engaged in rigorous physical training.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 text-white">
                        <h4 className="font-bold mb-2">Catabolic vs Anabolic States</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-red-400 font-semibold mb-1">During Exercise (Catabolic)</p>
                                <p className="text-gray-300">Energy delivered to working muscles, stores being depleted</p>
                            </div>
                            <div>
                                <p className="text-green-400 font-semibold mb-1">After Exercise (Anabolic)</p>
                                <p className="text-gray-300">Recovery begins, restoring and building up what was lost</p>
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 'hydration':
            return (
                <div className="space-y-6">
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-4 border border-cyan-200 dark:border-cyan-800">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-cyan-600" />
                            <h4 className="font-semibold text-cyan-900 dark:text-cyan-300">Thirst is NOT the first indicator</h4>
                        </div>
                        <p className="text-sm text-cyan-800 dark:text-cyan-300">
                            By the time you feel thirsty, you may already be dehydrated. Proactive hydration is essential for maximum performance.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Why Hydration Matters</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Necessary for maximum performance</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Critical role in regulating body temperature</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Carries nutrients throughout the body</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Improves digestion</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Eliminates waste and toxins</li>
                            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />Majority of muscle is comprised of water</li>
                        </ul>
                    </div>

                    {/* Dehydration Effects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                            <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">{dehydrationEffects.twoPercent.title}</h4>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-2">{dehydrationEffects.twoPercent.example}</p>
                            <ul className="space-y-1">
                                {dehydrationEffects.twoPercent.effects.map((e, i) => (
                                    <li key={i} className="text-sm text-yellow-800 dark:text-yellow-300">• {e}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                            <h4 className="font-semibold text-red-900 dark:text-red-300 mb-2">{dehydrationEffects.threeFivePercent.title}</h4>
                            <p className="text-xs text-red-700 dark:text-red-400 mb-2">{dehydrationEffects.threeFivePercent.example}</p>
                            <ul className="space-y-1">
                                {dehydrationEffects.threeFivePercent.effects.map((e, i) => (
                                    <li key={i} className="text-sm text-red-800 dark:text-red-300">• {e}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Dehydration Signs */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Recognize Dehydration Signs</h4>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700">
                            <div className="p-4">
                                <p className="text-sm font-semibold text-yellow-600 mb-2">Moderate</p>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                    {dehydrationSigns.moderate.map((s, i) => <li key={i}>• {s}</li>)}
                                </ul>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-semibold text-red-600 mb-2">Severe</p>
                                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                    {dehydrationSigns.severe.map((s, i) => <li key={i}>• {s}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Hydration Protocol */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Hydration Protocol</h4>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {hydrationProtocol.map((p, i) => (
                                <div key={i} className="p-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{p.timing}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{p.note}</p>
                                    </div>
                                    <span className="font-bold text-marine-red">{p.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Environment Guidelines */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2">
                                <ThermometerSun className="w-5 h-5 text-orange-600" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Environment-Specific Hydration</h4>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {environmentHydration.map((env, i) => (
                                <div key={i} className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900 dark:text-white">{env.environment}</span>
                                        <span className="text-sm font-bold text-marine-red">{env.intake}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">{env.tips}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sports Drinks */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Sports Drinks Guidelines</h4>
                        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
                            <li>• Use during exercise for hydration, glucose, and electrolytes</li>
                            <li>• Look for: 6-8% carbohydrate, 20-50mg potassium, 110-170mg sodium per 8oz</li>
                            <li>• Do NOT dilute sports drinks</li>
                            <li>• Sports drinks are NOT energy drinks</li>
                            <li>• Energy drinks are NOT good recovery drinks</li>
                        </ul>
                    </div>

                    {/* Warnings */}
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertOctagon className="w-5 h-5 text-red-600" />
                            <h4 className="font-semibold text-red-900 dark:text-red-300">Hydration Dangers</h4>
                        </div>
                        <div className="space-y-2 text-sm text-red-800 dark:text-red-300">
                            <p><strong>Hyponatremia:</strong> Low sodium from over-hydration. Max 12 quarts/day. USMC mess hall meals meet sodium requirements.</p>
                            <p><strong>Rhabdomyolysis:</strong> Rapid muscle breakdown from eccentric movements, heat, dehydration, over-exertion. Signs: muscle pain, weakness, swelling. Health always comes first!</p>
                        </div>
                    </div>
                </div>
            );

        case 'rations':
            return (
                <div className="space-y-6">
                    {/* Introduction */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm text-emerald-800 dark:text-emerald-300">
                            <strong>Food is your body's fuel.</strong> Operational rations are designed using scientific evidence to ensure warfighter nutritional needs are met in all environments. By providing your body with proper nutrition, you can improve alertness, strength, and endurance.
                        </p>
                    </div>

                    {/* Energy Needs by Activity Level */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-orange-600" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Daily Energy Needs by Activity Level</h4>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Extreme environmental conditions can increase energy needs</p>
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-gray-700">
                            <div className="p-4">
                                <p className="text-sm font-semibold text-blue-600 mb-3">Men (kcal/day)</p>
                                <div className="space-y-2">
                                    {energyNeeds.men.map((e, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{e.level}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{e.kcal.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-semibold text-pink-600 mb-3">Women (kcal/day)</p>
                                <div className="space-y-2">
                                    {energyNeeds.women.map((e, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{e.level}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{e.kcal.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Field Nutrient Targets */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800 text-center">
                            <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1">CHO</p>
                            <p className="text-lg font-bold text-amber-800 dark:text-amber-300">{fieldNutrientTargets.cho.perLb}/lb</p>
                            <p className="text-xs text-amber-600 dark:text-amber-400">{fieldNutrientTargets.cho.example}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800 text-center">
                            <p className="text-xs text-red-700 dark:text-red-400 font-semibold mb-1">PRO</p>
                            <p className="text-lg font-bold text-red-800 dark:text-red-300">{fieldNutrientTargets.pro.perLb}/lb</p>
                            <p className="text-xs text-red-600 dark:text-red-400">{fieldNutrientTargets.pro.example}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-200 dark:border-blue-800 text-center">
                            <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold mb-1">FAT</p>
                            <p className="text-lg font-bold text-blue-800 dark:text-blue-300">{fieldNutrientTargets.fat.percent}</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">{fieldNutrientTargets.fat.example}</p>
                        </div>
                    </div>

                    {/* Operational Rations */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-emerald-600" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Operational Ration Types</h4>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {operationalRations.map((ration, i) => (
                                <div key={i} className="p-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{ration.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{ration.desc}</p>
                                    </div>
                                    <span className="font-bold text-marine-red text-sm">{ration.avgKcal.toLocaleString()} kcal</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mission Planning */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-marine-red" />
                            Mission Nutrition Planning
                        </h4>
                        {missionPlanning.map((phase, index) => {
                            const Icon = phase.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <div className={`${phase.bg} p-4 border-b border-gray-200 dark:border-gray-700`}>
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-6 h-6 ${phase.color}`} />
                                            <div>
                                                <h4 className={`font-bold ${phase.color}`}>{phase.phase}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{phase.timing}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Nutrients</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{phase.nutrients}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Fluids</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{phase.fluid}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Tips</p>
                                            <ul className="space-y-1">
                                                {phase.tips.map((tip, i) => (
                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                                                        <span className="text-marine-red">•</span>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                <strong>Example Components:</strong> {phase.examples.join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Resources */}
                    <div className="bg-marine-red text-white rounded-xl p-4">
                        <h4 className="font-bold mb-3">Operational Ration Resources</h4>
                        <div className="space-y-2">
                            <a href="https://www.hprc-online.org/page/Combat-Rations-Database-ComRaD" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-red-100 hover:text-white">
                                <ExternalLink size={14} />
                                ComRaD - Combat Rations Database (nutrition info)
                            </a>
                            <a href="https://nsrdec.army.mil/img/pdfs/OP_Rations08-22-16.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-red-100 hover:text-white">
                                <ExternalLink size={14} />
                                Operational Rations Handbook (Natick PAM 30-25)
                            </a>
                        </div>
                    </div>
                </div>
            );

        case 'supplements':
            return (
                <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertOctagon className="w-5 h-5 text-red-600" />
                            <h4 className="font-semibold text-red-900 dark:text-red-300">Critical Warnings</h4>
                        </div>
                        <ul className="space-y-2">
                            {supplementWarnings.map((warning, i) => (
                                <li key={i} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                                    <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    {warning}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">FDA Responsibility</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>• FDA has "post-market" responsibility only - action after problems occur</li>
                            <li>• Dietary supplements do NOT require pre-market approval</li>
                            <li>• No guarantee of quality, purity, composition, safety, or effectiveness</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <h4 className="font-semibold text-gray-900 dark:text-white">Before Taking Any Supplement, Ask:</h4>
                        </div>
                        <div className="p-4">
                            <ol className="space-y-2">
                                {supplementQuestions.map((q, i) => (
                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-marine-red/10 text-marine-red font-bold text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                        {q}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                        <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">If You Choose to Use Supplements</h4>
                        <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
                            <li>• Use well-known brands with third-party testing</li>
                            <li>• Take only the recommended dose</li>
                            <li>• Avoid ordering supplements on the Internet, especially banned substances</li>
                        </ul>
                    </div>

                    <div className="bg-marine-red text-white rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FlaskConical className="w-5 h-5" />
                            <h4 className="font-bold">OPSS High-Risk Supplement List</h4>
                        </div>
                        <p className="text-red-100 text-sm mb-3">
                            Operation Supplement Safety maintains a list of high-risk supplements that may contain harmful or banned substances.
                        </p>
                        <a
                            href="https://www.opss.org/high-risk-supplements"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-marine-red px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors text-sm"
                        >
                            View High-Risk List <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            );

        case 'garrison':
            return (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Menus are intentionally designed by USMC Registered Performance Dietitians to include nutrient density and quality. All master menus meet Military Dietary Reference Intake (MDRI) values.
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
                            Available to all Marines for mess hall menus and nutrition information.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-start gap-2"><span className="text-marine-red">•</span>iOS and Android versions available</li>
                            <li className="flex items-start gap-2"><span className="text-marine-red">•</span>Search installation for connected mess hall menus</li>
                            <li className="flex items-start gap-2"><span className="text-marine-red">•</span>Complete menus with nutrition facts for informed choices</li>
                            <li className="flex items-start gap-2"><span className="text-marine-red">•</span>Real-time dining experience feedback</li>
                        </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-green-900 dark:text-green-300">Cost Effective Dining</h4>
                        </div>
                        <p className="text-sm text-green-800 dark:text-green-300">
                            No cost to Marines on essential station messing (ESM) and entitled to subsist at government expense. Additional portions ("seconds") offered during each dining visit.
                        </p>
                    </div>
                </div>
            );

        case 'commissary':
            return (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                    <Smartphone size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Commissary CLICK2GO</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Online payment, curbside pickup, digital coupons, sales flyers, and dietitian-approved recipes.
                            </p>
                            <a href="https://corp.commissaries.com/shopping/click-2-go" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                Download App <ExternalLink size={14} />
                            </a>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                                    <ThumbsUp size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Dietitian Approved Thumb (DAT)</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Shelf tags identifying nutrient-dense foods: lean proteins, healthy fats, whole grains.
                            </p>
                            <a href="https://corp.commissaries.com/healthy-living/dietitian-approved-thumb" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-green-600 hover:text-green-800 flex items-center gap-1">
                                Learn More <ExternalLink size={14} />
                            </a>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                    <Box size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Thinking Outside the Box (TOTB)</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Easy, economical, dietitian-approved meal solutions aligned with Dietary Guidelines.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-lg">
                                    <Zap size={20} />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Fueling Stations</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                Grab-n-go nutritious snacks and meals. Great for pre/post workout refueling.
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

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">SEMPERFIT Health Promotion</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                            Health Promotion Professionals are located at each installation's main fitness center.
                        </p>
                        <a href="http://usmc-mccs.org/services/fitness/health-promotion/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            Find Your Local Office <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            );

        default:
            return null;
    }
};

export default NutritionSectionContent;
