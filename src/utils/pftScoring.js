// PFT/CFT Scoring Logic
// Based on USMC scoring tables with age group adjustments

// Age groups used by USMC
export const ageGroups = ['17-20', '21-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51+'];

// ============================================
// PFT SCORING TABLES (Age & Gender Specific)
// ============================================

// Pull-up max reps for 100 points by age/gender
const pullupMax = {
    male: { '17-20': 23, '21-25': 23, '26-30': 23, '31-35': 23, '36-40': 22, '41-45': 21, '46-50': 20, '51+': 19 },
    female: { '17-20': 11, '21-25': 11, '26-30': 11, '31-35': 10, '36-40': 9, '41-45': 8, '46-50': 7, '51+': 6 }
};

// Pull-up minimum reps for passing (40 points)
const pullupMin = {
    male: { '17-20': 4, '21-25': 4, '26-30': 4, '31-35': 4, '36-40': 4, '41-45': 4, '46-50': 3, '51+': 3 },
    female: { '17-20': 1, '21-25': 1, '26-30': 1, '31-35': 1, '36-40': 1, '41-45': 1, '46-50': 1, '51+': 1 }
};

// Push-up max reps for 100 points by age/gender
const pushupMax = {
    male: { '17-20': 82, '21-25': 87, '26-30': 84, '31-35': 80, '36-40': 76, '41-45': 72, '46-50': 68, '51+': 64 },
    female: { '17-20': 42, '21-25': 48, '26-30': 50, '31-35': 46, '36-40': 43, '41-45': 40, '46-50': 37, '51+': 34 }
};

// Push-up minimum reps for passing (40 points)
const pushupMin = {
    male: { '17-20': 42, '21-25': 47, '26-30': 44, '31-35': 40, '36-40': 36, '41-45': 32, '46-50': 28, '51+': 25 },
    female: { '17-20': 19, '21-25': 21, '26-30': 20, '31-35': 18, '36-40': 16, '41-45': 14, '46-50': 12, '51+': 11 }
};

// 3-Mile Run max time (seconds) for 100 points by age/gender
const runMax = {
    male: { '17-20': 1080, '21-25': 1080, '26-30': 1080, '31-35': 1080, '36-40': 1110, '41-45': 1140, '46-50': 1200, '51+': 1260 },
    female: { '17-20': 1260, '21-25': 1260, '26-30': 1260, '31-35': 1290, '36-40': 1350, '41-45': 1410, '46-50': 1470, '51+': 1530 }
};

// 3-Mile Run minimum time (seconds) for passing (40 points)
const runMin = {
    male: { '17-20': 1680, '21-25': 1680, '26-30': 1680, '31-35': 1710, '36-40': 1770, '41-45': 1860, '46-50': 1950, '51+': 2040 },
    female: { '17-20': 1860, '21-25': 1860, '26-30': 1890, '31-35': 1950, '36-40': 2040, '41-45': 2130, '46-50': 2220, '51+': 2310 }
};

// Plank is not age-dependent per USMC standards
const plankMaxSeconds = 225; // 3:45 for 100 points
const plankMinSeconds = 40;  // 0:40 minimum for any points

// ============================================
// CFT SCORING TABLES (Age & Gender Specific)
// ============================================

// Movement to Contact (880 yds) - max time in seconds for 100 points
const mtcMax = {
    male: { '17-20': 154, '21-25': 154, '26-30': 154, '31-35': 160, '36-40': 166, '41-45': 172, '46-50': 178, '51+': 190 },
    female: { '17-20': 195, '21-25': 195, '26-30': 195, '31-35': 201, '36-40': 210, '41-45': 222, '46-50': 234, '51+': 246 }
};

// MTC minimum time for passing (40 points)
const mtcMin = {
    male: { '17-20': 217, '21-25': 217, '26-30': 217, '31-35': 226, '36-40': 235, '41-45': 247, '46-50': 259, '51+': 271 },
    female: { '17-20': 271, '21-25': 271, '26-30': 271, '31-35': 283, '36-40': 298, '41-45': 313, '46-50': 328, '51+': 343 }
};

// Ammo Can Lifts - max reps for 100 points
const ammoMax = {
    male: { '17-20': 115, '21-25': 115, '26-30': 115, '31-35': 111, '36-40': 107, '41-45': 103, '46-50': 99, '51+': 95 },
    female: { '17-20': 75, '21-25': 75, '26-30': 70, '31-35': 65, '36-40': 60, '41-45': 55, '46-50': 50, '51+': 45 }
};

// Ammo Can minimum for passing (40 points)
const ammoMin = {
    male: { '17-20': 66, '21-25': 66, '26-30': 66, '31-35': 62, '36-40': 58, '41-45': 54, '46-50': 50, '51+': 46 },
    female: { '17-20': 35, '21-25': 35, '26-30': 32, '31-35': 29, '36-40': 26, '41-45': 23, '46-50': 20, '51+': 17 }
};

// Maneuver Under Fire - max time in seconds for 100 points
const manufMax = {
    male: { '17-20': 139, '21-25': 139, '26-30': 139, '31-35': 147, '36-40': 155, '41-45': 163, '46-50': 171, '51+': 179 },
    female: { '17-20': 188, '21-25': 188, '26-30': 188, '31-35': 196, '36-40': 210, '41-45': 224, '46-50': 238, '51+': 252 }
};

// MANUF minimum for passing (40 points)
const manufMin = {
    male: { '17-20': 202, '21-25': 202, '26-30': 202, '31-35': 213, '36-40': 224, '41-45': 238, '46-50': 252, '51+': 266 },
    female: { '17-20': 266, '21-25': 266, '26-30': 266, '31-35': 280, '36-40': 294, '41-45': 308, '46-50': 322, '51+': 336 }
};

// ============================================
// SCORING CALCULATION FUNCTIONS
// ============================================

// Linear interpolation for scoring between min (40 pts) and max (100 pts)
const interpolateScore = (value, minVal, maxVal, isTimeBased = false) => {
    if (isTimeBased) {
        // For time-based events, lower is better
        if (value <= maxVal) return 100;
        if (value >= minVal) return 40;
        // Linear interpolation: as time increases, score decreases
        const ratio = (value - maxVal) / (minVal - maxVal);
        return Math.round(100 - (ratio * 60));
    } else {
        // For rep-based events, higher is better
        if (value >= maxVal) return 100;
        if (value <= minVal) return 40;
        // Linear interpolation: as reps increase, score increases
        const ratio = (value - minVal) / (maxVal - minVal);
        return Math.round(40 + (ratio * 60));
    }
};

// Check if below minimum standard
const isBelowMinimum = (value, minVal, isTimeBased = false) => {
    if (isTimeBased) {
        return value > minVal; // For time, higher is worse
    }
    return value < minVal; // For reps, lower is worse
};

// PFT Scoring
export const calculatePFTScore = (gender, ageGroup, inputs) => {
    const { upperBodyType, upperBodyReps, plankMinutes, plankSeconds, runMinutes, runSeconds } = inputs;

    const upperBodyScore = calculateUpperBodyScore(gender, ageGroup, upperBodyType, upperBodyReps);
    const plankScore = calculatePlankScore(plankMinutes, plankSeconds);
    const runScore = calculateRunScore(gender, ageGroup, runMinutes, runSeconds);

    const totalScore = upperBodyScore + plankScore + runScore;
    const classification = getClassification(totalScore);

    return {
        upperBodyScore,
        plankScore,
        runScore,
        totalScore,
        classification
    };
};

// CFT Scoring
export const calculateCFTScore = (gender, ageGroup, inputs) => {
    const { mtcMinutes, mtcSeconds, ammoLifts, manufMinutes, manufSeconds, isAltitude } = inputs;

    const mtcScore = calculateMTCScore(gender, ageGroup, mtcMinutes, mtcSeconds);
    const alScore = calculateALScore(gender, ageGroup, ammoLifts);
    const manufScore = calculateMANUFScore(gender, ageGroup, manufMinutes, manufSeconds);

    const totalScore = mtcScore + alScore + manufScore;
    const classification = getClassification(totalScore);

    return {
        mtcScore,
        alScore,
        manufScore,
        totalScore,
        classification
    };
};

// Helper Functions
export const getClassification = (score) => {
    if (score >= 235) return { class: 'first-class', name: '1st Class' };
    if (score >= 200) return { class: 'second-class', name: '2nd Class' };
    if (score >= 150) return { class: 'third-class', name: '3rd Class' };
    return { class: 'fail', name: 'Failure' };
};

// ============================================
// UPPER BODY SCORING (Pull-ups / Push-ups)
// ============================================

const calculateUpperBodyScore = (gender, ageGroup, type, reps) => {
    const g = gender.toLowerCase();
    const age = ageGroup || '21-25'; // Default to 21-25 if not specified

    if (type === 'pullups') {
        const maxReps = pullupMax[g]?.[age] || pullupMax[g]['21-25'];
        const minReps = pullupMin[g]?.[age] || pullupMin[g]['21-25'];

        if (reps < minReps) return 0;
        return interpolateScore(reps, minReps, maxReps, false);
    } else { // pushups
        const maxReps = pushupMax[g]?.[age] || pushupMax[g]['21-25'];
        const minReps = pushupMin[g]?.[age] || pushupMin[g]['21-25'];

        if (reps < minReps) return 0;
        return interpolateScore(reps, minReps, maxReps, false);
    }
};

// ============================================
// PLANK SCORING (Not age-dependent)
// ============================================

const calculatePlankScore = (minutes, seconds) => {
    const totalSeconds = (minutes * 60) + seconds;

    if (totalSeconds < plankMinSeconds) return 0;
    if (totalSeconds >= plankMaxSeconds) return 100;

    // Linear interpolation between 40 points at 40s and 100 points at 3:45
    const ratio = (totalSeconds - plankMinSeconds) / (plankMaxSeconds - plankMinSeconds);
    return Math.round(40 + (ratio * 60));
};

// ============================================
// 3-MILE RUN SCORING
// ============================================

const calculateRunScore = (gender, ageGroup, minutes, seconds) => {
    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';
    const totalSeconds = (minutes * 60) + seconds;

    const maxTime = runMax[g]?.[age] || runMax[g]['21-25'];
    const minTime = runMin[g]?.[age] || runMin[g]['21-25'];

    if (totalSeconds > minTime) return 0;
    return interpolateScore(totalSeconds, minTime, maxTime, true);
};

// ============================================
// CFT: MOVEMENT TO CONTACT (880 yds)
// ============================================

const calculateMTCScore = (gender, ageGroup, minutes, seconds) => {
    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';
    const totalSeconds = (minutes * 60) + seconds;

    const maxTime = mtcMax[g]?.[age] || mtcMax[g]['21-25'];
    const minTime = mtcMin[g]?.[age] || mtcMin[g]['21-25'];

    if (totalSeconds > minTime) return 0;
    return interpolateScore(totalSeconds, minTime, maxTime, true);
};

// ============================================
// CFT: AMMO CAN LIFTS
// ============================================

const calculateALScore = (gender, ageGroup, reps) => {
    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';

    const maxReps = ammoMax[g]?.[age] || ammoMax[g]['21-25'];
    const minReps = ammoMin[g]?.[age] || ammoMin[g]['21-25'];

    if (reps < minReps) return 0;
    return interpolateScore(reps, minReps, maxReps, false);
};

// ============================================
// CFT: MANEUVER UNDER FIRE
// ============================================

const calculateMANUFScore = (gender, ageGroup, minutes, seconds) => {
    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';
    const totalSeconds = (minutes * 60) + seconds;

    const maxTime = manufMax[g]?.[age] || manufMax[g]['21-25'];
    const minTime = manufMin[g]?.[age] || manufMin[g]['21-25'];

    if (totalSeconds > minTime) return 0;
    return interpolateScore(totalSeconds, minTime, maxTime, true);
};

// ============================================
// INVERSE FUNCTIONS (for Promotion Planner)
// ============================================

export const getRequiredUpperBodyReps = (gender, ageGroup, type, targetScore) => {
    if (targetScore <= 0) return 0;
    if (targetScore > 100) targetScore = 100;

    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';

    if (type === 'pullups') {
        const maxReps = pullupMax[g]?.[age] || pullupMax[g]['21-25'];
        const minReps = pullupMin[g]?.[age] || pullupMin[g]['21-25'];

        if (targetScore >= 100) return maxReps;
        if (targetScore <= 40) return minReps;

        // Reverse interpolation
        const ratio = (targetScore - 40) / 60;
        return Math.ceil(minReps + (ratio * (maxReps - minReps)));
    } else { // pushups
        const maxReps = pushupMax[g]?.[age] || pushupMax[g]['21-25'];
        const minReps = pushupMin[g]?.[age] || pushupMin[g]['21-25'];

        if (targetScore >= 100) return maxReps;
        if (targetScore <= 40) return minReps;

        const ratio = (targetScore - 40) / 60;
        return Math.ceil(minReps + (ratio * (maxReps - minReps)));
    }
};

export const getRequiredPlankTime = (targetScore) => {
    if (targetScore <= 0) return "0:00";
    if (targetScore >= 100) return "3:45";
    if (targetScore <= 40) return "0:40";

    const ratio = (targetScore - 40) / 60;
    const totalSeconds = Math.ceil(plankMinSeconds + (ratio * (plankMaxSeconds - plankMinSeconds)));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getRequiredRunTime = (gender, ageGroup, targetScore) => {
    if (targetScore <= 0) return "N/A";
    if (targetScore > 100) targetScore = 100;

    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';

    const maxTime = runMax[g]?.[age] || runMax[g]['21-25'];
    const minTime = runMin[g]?.[age] || runMin[g]['21-25'];

    if (targetScore >= 100) {
        const mins = Math.floor(maxTime / 60);
        const secs = maxTime % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    if (targetScore <= 40) {
        const mins = Math.floor(minTime / 60);
        const secs = minTime % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Reverse interpolation (for time, lower score = more time)
    const ratio = (targetScore - 40) / 60;
    const totalSeconds = Math.floor(minTime - (ratio * (minTime - maxTime)));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getRequiredMTC = (gender, ageGroup, targetScore) => {
    if (targetScore <= 0) return "N/A";
    if (targetScore > 100) targetScore = 100;

    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';

    const maxTime = mtcMax[g]?.[age] || mtcMax[g]['21-25'];
    const minTime = mtcMin[g]?.[age] || mtcMin[g]['21-25'];

    if (targetScore >= 100) {
        const mins = Math.floor(maxTime / 60);
        const secs = maxTime % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    if (targetScore <= 40) {
        const mins = Math.floor(minTime / 60);
        const secs = minTime % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const ratio = (targetScore - 40) / 60;
    const totalSeconds = Math.floor(minTime - (ratio * (minTime - maxTime)));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getRequiredAmmoLifts = (gender, ageGroup, targetScore) => {
    if (targetScore <= 0) return 0;
    if (targetScore > 100) targetScore = 100;

    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';

    const maxReps = ammoMax[g]?.[age] || ammoMax[g]['21-25'];
    const minReps = ammoMin[g]?.[age] || ammoMin[g]['21-25'];

    if (targetScore >= 100) return maxReps;
    if (targetScore <= 40) return minReps;

    const ratio = (targetScore - 40) / 60;
    return Math.ceil(minReps + (ratio * (maxReps - minReps)));
};

export const getRequiredMANUF = (gender, ageGroup, targetScore) => {
    if (targetScore <= 0) return "N/A";
    if (targetScore > 100) targetScore = 100;

    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';

    const maxTime = manufMax[g]?.[age] || manufMax[g]['21-25'];
    const minTime = manufMin[g]?.[age] || manufMin[g]['21-25'];

    if (targetScore >= 100) {
        const mins = Math.floor(maxTime / 60);
        const secs = maxTime % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    if (targetScore <= 40) {
        const mins = Math.floor(minTime / 60);
        const secs = minTime % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const ratio = (targetScore - 40) / 60;
    const totalSeconds = Math.floor(minTime - (ratio * (minTime - maxTime)));
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// ============================================
// UTILITY: Get scoring thresholds for display
// ============================================

export const getScoringThresholds = (gender, ageGroup, event) => {
    const g = gender.toLowerCase();
    const age = ageGroup || '21-25';

    switch (event) {
        case 'pullups':
            return { max: pullupMax[g]?.[age], min: pullupMin[g]?.[age], unit: 'reps' };
        case 'pushups':
            return { max: pushupMax[g]?.[age], min: pushupMin[g]?.[age], unit: 'reps' };
        case 'plank':
            return { max: '3:45', min: '0:40', unit: 'time' };
        case 'run':
            return {
                max: formatSeconds(runMax[g]?.[age]),
                min: formatSeconds(runMin[g]?.[age]),
                unit: 'time'
            };
        case 'mtc':
            return {
                max: formatSeconds(mtcMax[g]?.[age]),
                min: formatSeconds(mtcMin[g]?.[age]),
                unit: 'time'
            };
        case 'ammo':
            return { max: ammoMax[g]?.[age], min: ammoMin[g]?.[age], unit: 'reps' };
        case 'manuf':
            return {
                max: formatSeconds(manufMax[g]?.[age]),
                min: formatSeconds(manufMin[g]?.[age]),
                unit: 'time'
            };
        default:
            return null;
    }
};

const formatSeconds = (totalSeconds) => {
    if (!totalSeconds) return 'N/A';
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};
