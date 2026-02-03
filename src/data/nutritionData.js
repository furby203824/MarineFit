import {
    Utensils, Droplets, Apple, Smartphone, ThumbsUp,
    Box, Zap, BookOpen, ShoppingCart, ExternalLink, Target, Shield, FileText,
    CheckCircle2, AlertTriangle, XCircle, Salad, Wheat, Egg, Beef,
    Clock, Activity, Flame, Pill, Timer, TrendingUp, Droplet, Package,
    MapPin, Image as ImageIcon
} from 'lucide-react';

export const keyPrinciples = [
    "Every Marine needs to focus on nutritional fitness the same way as physical fitness",
    "Each meal and snack is an opportunity to fuel your body optimally",
    "Choose foods that are best for you 80% of the time; enjoy favorites 20% of the time",
    "All foods can fit into a nutritional fitness plan when consumed intentionally"
];

export const references = [
    { code: "MCO 10110.49", title: "Nutrition and Menu Standards for Human Performance Optimization" },
    { code: "MCO 10110.14N", title: "Marine Corps Food Service and Subsistence Program" },
    { code: "DoD 1338.10", title: "DoD Menu Standards" },
    { code: "USDA", title: "Dietary Guidelines for Healthy Americans" },
    { code: "USMC", title: "Fueled to Fight® Nutrition Education Program" },
    { code: "HPRC", title: "Operation Supplement Safety (OPSS)" }
];

export const fueledToFightRatings = [
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

export const macronutrients = [
    {
        name: "Carbohydrates",
        icon: Wheat,
        color: "text-amber-600",
        bg: "bg-amber-50 dark:bg-amber-900/20",
        border: "border-amber-200 dark:border-amber-800",
        sources: "Breads, cereals, grains, beans, fruit, vegetables",
        functions: [
            "Supply blood glucose for energy",
            "Replenish liver and muscle glycogen",
            "Decrease protein catabolism (muscle breakdown)",
            "Primary fuel for high-intensity exercise"
        ],
        intake: "3-4.5 grams per pound of body weight",
        tips: "Think 'brown and found close to the ground' - Best choices have >3g of fiber per serving. Choose 100% whole wheat or whole grain products."
    },
    {
        name: "Protein",
        icon: Beef,
        color: "text-red-600",
        bg: "bg-red-50 dark:bg-red-900/20",
        border: "border-red-200 dark:border-red-800",
        sources: "Lean meats, low-fat dairy, eggs, beans/legumes, fish, poultry",
        functions: [
            "Slows glycogen depletion",
            "Builds and repairs muscle tissue",
            "Maintains immune system function",
            "Supports recovery after training"
        ],
        intake: "0.7-1.0 grams per pound of body weight",
        tips: "Protein needs increase with activity level. Never will more than 1g per pound be necessary for health or muscle gains."
    },
    {
        name: "Fats (Lipids)",
        icon: Droplet,
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        sources: "Olive oil, canola oil, flax, nuts/seeds, avocado, tuna, salmon",
        functions: [
            "Provide sustained energy",
            "Help regulate blood sugar",
            "Improve cholesterol levels",
            "Keep you feeling full longer"
        ],
        intake: "One serving of healthy fat per meal",
        tips: "Omega-3 fatty acids improve cognition, decrease inflammation, and enhance heart health. Natural food sources have increased bioavailability over supplements."
    },
    {
        name: "Micronutrients",
        icon: Zap,
        color: "text-purple-600",
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-200 dark:border-purple-800",
        sources: "Fruits, vegetables, whole grains, beans, dairy, fish, eggs, nuts, seeds",
        functions: [
            "Provide antioxidants and phytochemicals",
            "Required for oxygen transfer and delivery",
            "Support tissue repair and growth",
            "Essential for metabolic processes"
        ],
        intake: "Variety is key - no single food provides all nutrients",
        tips: "The darker in color, the more vitamins and minerals a food contains. Aim for colorful plates with dark leafy greens and deep yellow, orange, and red vegetables."
    }
];

export const timingPhases = [
    {
        phase: "Pre-Exercise",
        icon: Timer,
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        timing: "2-4 hours before",
        goal: "Top off energy stores",
        recommendations: [
            "Eat a balanced meal with carbs, moderate protein, low fat",
            "Allow adequate digestion time",
            "Hydrate with 16oz of fluid 2 hours prior",
            "Avoid high-fiber foods that may cause GI distress"
        ]
    },
    {
        phase: "During Exercise",
        icon: Activity,
        color: "text-orange-600",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        timing: "Every 20-30 minutes",
        goal: "Maintain blood glucose and hydration",
        recommendations: [
            "For exercise >60 min: consume 30-60g carbs per hour",
            "Drink 4-8oz fluid every 20 minutes",
            "Use sports drinks for hydration, glucose, and electrolytes",
            "Environment is 'catabolic' - energy being delivered to muscles"
        ]
    },
    {
        phase: "Post-Exercise (RFI)",
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-900/20",
        timing: "Within 30-45 minutes",
        goal: "Maximize recovery and adaptation",
        recommendations: [
            "This is the CRITICAL refueling interval (RFI)",
            "Consume carbs with small amount of protein (~4:1 ratio)",
            "Environment shifts from 'catabolic' to 'anabolic'",
            "Glycogen replenishment is 2-3x faster in this window",
            "Drink 16-24oz fluid to replace losses"
        ]
    }
];

export const dehydrationEffects = {
    twoPercent: {
        title: "2% Body Weight Loss",
        example: "3 lbs for a 150 lb person",
        effects: ["Increase perceived effort", "Reduce performance by 10-20%"]
    },
    threeFivePercent: {
        title: "3-5% Body Weight Loss",
        example: "4.5-7.5 lbs for a 150 lb person",
        effects: ["Impaired reaction time", "Poor judgment", "Reduced concentration", "Impaired decision making", "Compromised body temperature regulation", "Decreased brain function"]
    }
};

export const dehydrationSigns = {
    moderate: ["Thirsty", "Headache", "Dry mouth", "Dry skin", "Fatigue", "Dizziness"],
    severe: ["Chills", "Increased heart rate", "Muscle cramps", "Nausea/vomiting", "Swollen stomach", "Confusion"]
};

export const hydrationProtocol = [
    { timing: "Daily Baseline", amount: "Half your body weight in fluid ounces", note: "Example: 150 lbs ÷ 2 = 75 fl oz" },
    { timing: "2 hours before exercise", amount: "16 ounces", note: "Pre-hydrate" },
    { timing: "10 minutes before exercise", amount: "4-8 ounces", note: "Final top-off" },
    { timing: "Every 20 minutes during", amount: "4-8 ounces", note: "1 large gulp ≈ 1 oz" },
    { timing: "After exercise", amount: "16-24 ounces", note: "Replace fluid losses" }
];

export const environmentHydration = [
    {
        environment: "Dry Extreme Heat",
        intake: "5-12 liters/day",
        tips: "Work at night when possible. Cover skin with light, vapor-permeable clothing. Drink COLD water and sports drinks."
    },
    {
        environment: "Hot and Humid",
        intake: "Up to 2x dry heat needs",
        tips: "Humidity prevents sweat evaporation, increasing heat injury risk. Large electrolyte losses require replacement."
    },
    {
        environment: "Altitude",
        intake: "4-6 liters/day",
        tips: "More fluid lost through breathing. Elevation reduces thirst sensation. Drink small quantities frequently."
    },
    {
        environment: "Altitude + Cold",
        intake: "5.5-7.5 liters/day",
        tips: "Sweat losses in insulated clothing, low fluid intake, reluctance to remove clothing to urinate. Consider hot fluids, tea, broth."
    }
];

export const supplementWarnings = [
    "Supplements are NOT FDA regulated - no government testing required",
    "They are expensive and often don't work",
    "Don't come close to what whole food offers",
    "Many contain banned or harmful substances not declared on labels",
    "Some may cause positive results on urinalysis"
];

export const supplementQuestions = [
    "What is in it?",
    "Does the label conform to FDA rules?",
    "Is it the right stuff (verified by third party)?",
    "Is it safe?",
    "Does it make sense for your goals?",
    "Does it actually work (evidence-based)?",
    "Does it reach its target in the body?",
    "What food sources exist as alternatives?",
    "Why take it when food may be better?"
];

export const garrisonDiningFeatures = [
    { icon: Target, title: "Performance Fuel Main Line", desc: "Fueled to Fight® requirement on main line for entrée, side, and vegetable" },
    { icon: Salad, title: "Cold Bar", desc: "Nutrient-dense items - seeds, nuts, trail mixes, yogurt parfaits, fresh fruit, vegetables" },
    { icon: Box, title: "Convenience Line", desc: "'Engage at Will' options for carryout with healthier choices up front" },
    { icon: Wheat, title: "Whole Grains", desc: "Provided throughout menu to minimize empty calories" },
    { icon: Apple, title: "Vitamin Rich Options", desc: "Good sources of vitamin A or C at every meal" },
    { icon: Egg, title: "Protein Options", desc: "Egg whites/substitutes and leaner, high-quality proteins available" }
];

export const energyNeeds = {
    men: [
        { level: "Light", kcal: 3000 },
        { level: "Moderate", kcal: 3400 },
        { level: "Heavy", kcal: 3700 },
        { level: "Very Heavy", kcal: 4700 }
    ],
    women: [
        { level: "Light", kcal: 2100 },
        { level: "Moderate", kcal: 2300 },
        { level: "Heavy", kcal: 2700 },
        { level: "Very Heavy", kcal: 3000 }
    ]
};

export const operationalRations = [
    { name: "MRE (Meal, Ready to Eat)", avgKcal: 1300, desc: "Individual meal, 24 varieties" },
    { name: "First Strike Ration® (FSR)", avgKcal: 2900, desc: "3 meals per ration, highly mobile" },
    { name: "MCW (Meal, Cold Weather)", avgKcal: 1600, desc: "Individual meal for cold environments" },
    { name: "UGR-A (Unitized Group Ration)", avgKcal: 1300, desc: "50-person group, A-ration quality" },
    { name: "UGR-E (Express)", avgKcal: 1350, desc: "50-person group, limited prep" },
    { name: "UGR-H&S (Heat & Serve)", avgKcal: 1350, desc: "50-person group, self-heating" },
    { name: "UGR-M (Marine)", avgKcal: 1300, desc: "Marine-specific group ration" },
    { name: "MORE (Modular Enhancement)", avgKcal: 1000, desc: "Augments other rations for extra calories" }
];

export const missionPlanning = [
    {
        phase: "Pre-Mission",
        timing: "2-4 hours before",
        icon: Timer,
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        nutrients: "80-400g CHO depending on body weight",
        fluid: "Drink to thirst",
        tips: [
            "Know your body tolerances; practice during training",
            "If needed, 30-60 min before use caffeine (up to 200mg)",
            "Choose easily digestible CHO sources"
        ],
        examples: ["Toaster Pastry + Dried Fruit + Beverage Base", "Hash Browns + Granola + Snack Bread"]
    },
    {
        phase: "During Mission",
        timing: "Every 20-30 minutes",
        icon: Activity,
        color: "text-orange-600",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        nutrients: "30-60g CHO/hour (50-75g in cold/altitude)",
        fluid: "0.5-1.0 qt (0.5-1.0 L)/hr",
        tips: [
            "During multiple hours of heavy activity, snack regularly",
            "Goal: consume 60-90g CHO/hour for extended operations",
            "Do not exceed 1.5 qt (1.4 L) fluid/hour"
        ],
        examples: ["First Strike Bar", "Pocket Sandwiches", "Energy Gel", "CHO Beverage Base"]
    },
    {
        phase: "Post-Mission",
        timing: "Within 30-60 minutes",
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-900/20",
        nutrients: "80-120g CHO + 15-25g PRO",
        fluid: "Drink to relieve thirst and promote urination",
        tips: [
            "This is the critical recovery window",
            "Combine carbs with protein for optimal recovery",
            "Continue hydrating over several hours"
        ],
        examples: ["Italian Sandwich + Beef Snacks + First Strike Bar Mini", "Tortilla + Peanut Butter + Applesauce"]
    }
];

export const fieldNutrientTargets = {
    cho: { perLb: "~3g", example: "500g for 165 lb warfighter" },
    pro: { perLb: "~0.7g", example: "115g for 165 lb warfighter" },
    fat: { percent: "20-35%", example: "56-98g on 2500 kcal diet" }
};

export const visualResources = [
    {
        title: "Performance Plate",
        filename: "Power Plate 20230103.png",
        description: "Visual guide for building a high-performance meal plate with proper portioning."
    },
    {
        title: "3 Keys to Nutrition",
        filename: "3 keys 20230103.png",
        description: "Core principles for nutritional success: Quality, Quantity, and Timing."
    },
    {
        title: "Fueled for Fitness - Brochure",
        filename: "Fueled for Fitness brochure web.Final__page-0001.jpg",
        description: "Comprehensive guide to fueling for fitness - Part 1."
    },
    {
        title: "Fueled for Fitness - Guide",
        filename: "Fueled for Fitness brochure web.Final__page-0002.jpg",
        description: "Comprehensive guide to fueling for fitness - Part 2."
    },
    {
        title: "Operation Supplement Safety",
        filename: "OPSS 220418.png",
        description: "Official guidance on supplement safety and verification."
    },
    {
        title: "Supplement Safety Guide",
        filename: "Supplement safety 20230103.png",
        description: "Key questions and warnings for supplement use."
    },
    {
        title: "Supplement Safety - Additional",
        filename: "Supplement safety 20230103 (1).png",
        description: "Additional safety information and checklists."
    }
];

export const sections = [
    { id: 'resources', title: 'Visual Guides', desc: 'Infographics and educational brochures', icon: ImageIcon, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'fueled', title: 'Fueled to Fight®', desc: 'USMC stoplight rating system for informed food choices', icon: Target, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'macros', title: 'Macronutrients', desc: 'Understanding carbs, protein, fat, and micronutrients', icon: Flame, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'timing', title: 'Nutrient Timing', desc: 'When to eat matters as much as what you eat', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'hydration', title: 'Performance Hydration', desc: 'Critical hydration protocols for optimal performance', icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'rations', title: 'Operational Rations', desc: 'Field feeding and mission nutrition planning', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'supplements', title: 'Supplement Safety', desc: 'Operation Supplement Safety (OPSS) guidance', icon: Pill, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'garrison', title: 'Garrison Dining', desc: 'Performance fueling at USMC mess halls', icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50' },
    { id: 'commissary', title: 'Commissary Shopping', desc: 'Shop smart with dietitian-approved options', icon: ShoppingCart, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'references', title: 'References', desc: 'Official USMC orders and resources', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' }
];
