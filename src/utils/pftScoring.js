// PFT/CFT Scoring Logic
// Based on simplified USMC scoring tables

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

// Inverse Logic for "What-If" Calculator
export const getRequiredUpperBodyReps = (gender, type, targetScore) => {
    if (targetScore <= 0) return 0;
    
    if (type === 'pullups') {
        if (gender === 'male') {
            if (targetScore > 85) return 20;
            if (targetScore > 70) return 15;
            if (targetScore > 55) return 10;
            if (targetScore > 40) return 5;
            return 3;
        } else {
            if (targetScore > 80) return 8;
            if (targetScore > 65) return 5;
            if (targetScore > 40) return 3;
            return 1;
        }
    } else { // pushups
        if (gender === 'male') {
            if (targetScore > 85) return 80;
            if (targetScore > 70) return 70;
            if (targetScore > 55) return 60;
            if (targetScore > 40) return 50;
            return 40;
        } else {
            if (targetScore > 85) return 45;
            if (targetScore > 70) return 35;
            if (targetScore > 55) return 25;
            if (targetScore > 40) return 20;
            return 18;
        }
    }
};

export const getRequiredPlankTime = (targetScore) => {
    if (targetScore <= 0) return "0:00";
    if (targetScore > 85) return "4:05";
    if (targetScore > 70) return "3:30";
    if (targetScore > 55) return "3:00";
    if (targetScore > 40) return "2:30";
    return "1:10";
};

export const getRequiredRunTime = (gender, targetScore) => {
    if (targetScore <= 0) return "N/A";
    
    if (gender === 'male') {
        if (targetScore > 85) return "18:30";
        if (targetScore > 70) return "21:00";
        if (targetScore > 55) return "24:00";
        if (targetScore > 40) return "27:00";
        return "33:00";
    } else {
        if (targetScore > 85) return "21:30";
        if (targetScore > 70) return "24:00";
        if (targetScore > 55) return "27:00";
        if (targetScore > 40) return "30:00";
        return "36:00";
    }
};

export const getRequiredMTC = (gender, targetScore) => {
    if (targetScore <= 0) return "N/A";
    
    if (gender === 'male') {
        if (targetScore > 85) return "2:40";
        if (targetScore > 70) return "3:00";
        if (targetScore > 40) return "3:20";
        return "3:45";
    } else {
        if (targetScore > 85) return "3:19";
        if (targetScore > 70) return "3:40";
        if (targetScore > 40) return "4:00";
        return "4:36";
    }
};

export const getRequiredAmmoLifts = (gender, targetScore) => {
    if (targetScore <= 0) return 0;
    
    if (gender === 'male') {
        if (targetScore > 85) return 120;
        if (targetScore > 70) return 100;
        if (targetScore > 40) return 80;
        return 62;
    } else {
        if (targetScore > 85) return 66;
        if (targetScore > 70) return 50;
        if (targetScore > 40) return 40;
        return 30;
    }
};

export const getRequiredMANUF = (gender, targetScore) => {
    if (targetScore <= 0) return "N/A";
    
    if (gender === 'male') {
        if (targetScore > 85) return "2:07";
        if (targetScore > 70) return "2:30";
        if (targetScore > 40) return "2:47";
        return "3:17";
    } else {
        if (targetScore > 85) return "2:55";
        if (targetScore > 70) return "3:15";
        if (targetScore > 40) return "3:25";
        return "4:53";
    }
};

const calculateUpperBodyScore = (gender, ageGroup, type, reps) => {
    if (type === 'pullups') {
        if (gender === 'male') {
            if (reps >= 20) return 100;
            if (reps >= 15) return 85;
            if (reps >= 10) return 70;
            if (reps >= 5) return 55;
            if (reps >= 3) return 40;
            return 0;
        } else {
            if (reps >= 8) return 100;
            if (reps >= 5) return 80;
            if (reps >= 3) return 65;
            if (reps >= 1) return 40;
            return 0;
        }
    } else { // pushups
        if (gender === 'male') {
            if (reps >= 80) return 100;
            if (reps >= 70) return 85;
            if (reps >= 60) return 70;
            if (reps >= 50) return 55;
            if (reps >= 40) return 40;
            return 0;
        } else {
            if (reps >= 45) return 100;
            if (reps >= 35) return 85;
            if (reps >= 25) return 70;
            if (reps >= 20) return 55;
            if (reps >= 18) return 40;
            return 0;
        }
    }
};

const calculatePlankScore = (minutes, seconds) => {
    const totalSeconds = (minutes * 60) + seconds;
    if (totalSeconds >= 245) return 100; // 4:05
    if (totalSeconds >= 210) return 85;  // 3:30
    if (totalSeconds >= 180) return 70;  // 3:00
    if (totalSeconds >= 150) return 55;  // 2:30
    if (totalSeconds >= 70) return 40;   // 1:10
    return 0;
};

const calculateRunScore = (gender, ageGroup, minutes, seconds) => {
    const totalMinutes = minutes + (seconds / 60);
    
    if (gender === 'male') {
        if (totalMinutes <= 18.5) return 100;
        if (totalMinutes <= 21) return 85;
        if (totalMinutes <= 24) return 70;
        if (totalMinutes <= 27) return 55;
        if (totalMinutes <= 33) return 40;
        return 0;
    } else {
        if (totalMinutes <= 21.5) return 100;
        if (totalMinutes <= 24) return 85;
        if (totalMinutes <= 27) return 70;
        if (totalMinutes <= 30) return 55;
        if (totalMinutes <= 36) return 40;
        return 0;
    }
};

const calculateMTCScore = (gender, ageGroup, minutes, seconds) => {
    const totalSeconds = (minutes * 60) + seconds;
    
    if (gender === 'male') {
        if (totalSeconds <= 160) return 100;  // 2:40
        if (totalSeconds <= 180) return 85;   // 3:00
        if (totalSeconds <= 200) return 70;   // 3:20
        if (totalSeconds <= 225) return 40;   // 3:45
        return 0;
    } else {
        if (totalSeconds <= 199) return 100;  // 3:19
        if (totalSeconds <= 220) return 85;   // 3:40
        if (totalSeconds <= 240) return 70;   // 4:00
        if (totalSeconds <= 276) return 40;   // 4:36
        return 0;
    }
};

const calculateALScore = (gender, ageGroup, reps) => {
    if (gender === 'male') {
        if (reps >= 120) return 100;
        if (reps >= 100) return 85;
        if (reps >= 80) return 70;
        if (reps >= 62) return 40;
        return 0;
    } else {
        if (reps >= 66) return 100;
        if (reps >= 50) return 85;
        if (reps >= 40) return 70;
        if (reps >= 30) return 40;
        return 0;
    }
};

const calculateMANUFScore = (gender, ageGroup, minutes, seconds) => {
    const totalSeconds = (minutes * 60) + seconds;
    
    if (gender === 'male') {
        if (totalSeconds <= 127) return 100;  // 2:07
        if (totalSeconds <= 150) return 85;   // 2:30
        if (totalSeconds <= 167) return 70;   // 2:47
        if (totalSeconds <= 197) return 40;   // 3:17
        return 0;
    } else {
        if (totalSeconds <= 175) return 100;  // 2:55
        if (totalSeconds <= 195) return 85;   // 3:15
        if (totalSeconds <= 205) return 70;   // 3:25
        if (totalSeconds <= 293) return 40;   // 4:53
        return 0;
    }
};
