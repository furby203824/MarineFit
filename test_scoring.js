
import { calculatePFTScore, calculateCFTScore, getAgeGroup } from './src/utils/pftScoring.js';

console.log("Starting Scoring Verification...");

// Test Case 1: PFT - Male, 25 years old (Age Group 21-25)
try {
    const age = 25;
    const ageGroup = getAgeGroup(age);
    console.log(`Age: ${age}, Group: ${ageGroup}`);

    const pftInputs = {
        upperBodyType: 'pullups',
        upperBodyReps: 20,
        plankMinutes: 3,
        plankSeconds: 45,
        runMinutes: 20,
        runSeconds: 0
    };

    const pftResult = calculatePFTScore('male', ageGroup, pftInputs);
    console.log("PFT Result (Male 25):", pftResult);
} catch (error) {
    console.error("PFT Test Failed:", error);
}

// Test Case 2: CFT - Female, 19 years old (Age Group 17-20)
try {
    const age = 19;
    const ageGroup = getAgeGroup(age);
    console.log(`Age: ${age}, Group: ${ageGroup}`);

    const cftInputs = {
        mtcMinutes: 3,
        mtcSeconds: 15, // 195s
        ammoLifts: 75,
        manufMinutes: 3,
        manufSeconds: 8, // 188s
        isAltitude: false
    };

    const cftResult = calculateCFTScore('female', ageGroup, cftInputs);
    console.log("CFT Result (Female 19):", cftResult);
} catch (error) {
    console.error("CFT Test Failed:", error);
}

// Test Case 3: Edge Case - Undefined Age Group (Simulating the bug)
try {
    // If getAgeGroup returns undefined or something invalid, the scoring functions should handle it or fail gracefully
    // But now we know getAgeGroup handles all ages.
    // Let's test an age that might have caused issues if the logic was bad, e.g., 55
    const age = 55;
    const ageGroup = getAgeGroup(age);
    console.log(`Age: ${age}, Group: ${ageGroup}`); // Should be '51+'

    const pftInputs = {
        upperBodyType: 'pushups',
        upperBodyReps: 40,
        plankMinutes: 2,
        plankSeconds: 0,
        runMinutes: 25,
        runSeconds: 0
    };

    const pftResult = calculatePFTScore('male', ageGroup, pftInputs);
    console.log("PFT Result (Male 55):", pftResult);
} catch (error) {
    console.error("Edge Case Test Failed:", error);
}

console.log("Verification Complete.");
