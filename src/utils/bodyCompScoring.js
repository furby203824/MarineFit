// Body Composition Scoring Utilities
// Per MARADMIN 066/26 (as modified by MARADMIN 073/26)

import { WHTR_STANDARD, heightWaistTable, bodyFatStandards, performanceConsiderations } from '../data/bodyCompData';

// Round down to nearest 0.5 inch per MARADMIN 066/26, para. 3.d
export const roundDownToHalf = (value) => {
  return Math.floor(value * 2) / 2;
};

// Calculate WHtR from raw height and waist inputs
export const calculateWHtR = (heightInches, waistInches) => {
  const roundedHeight = roundDownToHalf(parseFloat(heightInches));
  const roundedWaist = roundDownToHalf(parseFloat(waistInches));
  if (!roundedHeight || roundedHeight <= 0) return null;
  return {
    ratio: roundedWaist / roundedHeight,
    roundedHeight,
    roundedWaist,
  };
};

// Binary pass/fail: <= 0.52 is within standards (MARADMIN 073/26)
export const isWithinWHtR = (heightInches, waistInches) => {
  const result = calculateWHtR(heightInches, waistInches);
  if (!result) return null;
  return result.ratio <= WHTR_STANDARD;
};

// Lookup max waist for a given height from the official table
export const getMaxWaist = (heightInches) => {
  const rounded = roundDownToHalf(parseFloat(heightInches));
  const entry = heightWaistTable.find((row) => row.height === rounded);
  return entry ? entry.maxWaist : null;
};

// Get the applicable body fat limit considering physical performance
// Per MARADMIN 066/26, para. 2.b.2
export const getBodyFatLimit = (gender, ageGroup, pftScore, cftScore) => {
  const baseMax = bodyFatStandards[gender]?.[ageGroup];
  if (baseMax == null) return null;

  const pft = Number(pftScore) || 0;
  const cft = Number(cftScore) || 0;

  // Tier 1: >= 285 on BOTH PFT and CFT
  if (pft >= performanceConsiderations.tier1.minScore && cft >= performanceConsiderations.tier1.minScore) {
    return performanceConsiderations.tier1[gender];
  }

  // Tier 2: >= 250 on BOTH PFT and CFT — +1% but not to exceed tier 1 caps
  if (pft >= performanceConsiderations.tier2.minScore && cft >= performanceConsiderations.tier2.minScore) {
    const cap = performanceConsiderations.tier1[gender];
    return Math.min(baseMax + 1, cap);
  }

  return baseMax;
};

// Full body composition evaluation flow
// Returns a structured result object
export const evaluateBodyComp = ({
  height,
  waist,
  gender,
  ageGroup,
  bodyFatPercent,
  bodyFatMethod,
  pftScore,
  cftScore,
}) => {
  const whtrResult = calculateWHtR(height, waist);
  if (!whtrResult) return null;

  const maxWaist = getMaxWaist(height);
  const withinWHtR = whtrResult.ratio <= WHTR_STANDARD;

  // Step 1: WHtR check
  if (withinWHtR) {
    return {
      step: 'whtr',
      status: 'WITHIN STANDARDS',
      statusLevel: 'pass',
      message: 'Within the USMC Waist-to-Height Ratio standard.',
      whtr: whtrResult.ratio,
      maxWaist,
      roundedHeight: whtrResult.roundedHeight,
      roundedWaist: whtrResult.roundedWaist,
      requiresBodyFat: false,
      bcp: false,
    };
  }

  // WHtR exceeded — body fat evaluation required
  if (bodyFatPercent == null || bodyFatPercent === '') {
    return {
      step: 'whtr',
      status: 'EXCEEDS WHtR',
      statusLevel: 'warning',
      message: 'Exceeds the WHtR standard. A body fat evaluation is required.',
      whtr: whtrResult.ratio,
      maxWaist,
      roundedHeight: whtrResult.roundedHeight,
      roundedWaist: whtrResult.roundedWaist,
      requiresBodyFat: true,
      bcp: false,
    };
  }

  // Step 2: Body fat evaluation
  const bf = parseFloat(bodyFatPercent);
  const limit = getBodyFatLimit(gender, ageGroup, pftScore, cftScore);
  const baseLimit = bodyFatStandards[gender]?.[ageGroup];
  const withinBodyFat = bf <= limit;

  if (withinBodyFat) {
    const usedPerformance = limit > baseLimit;
    return {
      step: 'bodyFat',
      status: 'WITHIN STANDARDS',
      statusLevel: 'pass',
      message: usedPerformance
        ? `Exceeds WHtR but within body fat standards (${bf}% vs ${limit}% max with physical performance consideration).`
        : `Exceeds WHtR but within body fat standards (${bf}% vs ${limit}% max).`,
      whtr: whtrResult.ratio,
      maxWaist,
      roundedHeight: whtrResult.roundedHeight,
      roundedWaist: whtrResult.roundedWaist,
      bodyFatPercent: bf,
      bodyFatLimit: limit,
      bodyFatMethod: bodyFatMethod || 'tape',
      requiresBodyFat: false,
      bcp: false,
      usedPerformanceConsideration: usedPerformance,
    };
  }

  // Exceeds body fat — BCP assignment
  return {
    step: 'bodyFat',
    status: 'EXCEEDS STANDARDS',
    statusLevel: 'fail',
    message: `Exceeds both WHtR and body fat standards (${bf}% vs ${limit}% max). Processed for BCP.`,
    whtr: whtrResult.ratio,
    maxWaist,
    roundedHeight: whtrResult.roundedHeight,
    roundedWaist: whtrResult.roundedWaist,
    bodyFatPercent: bf,
    bodyFatLimit: limit,
    bodyFatMethod: bodyFatMethod || 'tape',
    requiresBodyFat: false,
    bcp: true,
  };
};
