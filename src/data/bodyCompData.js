// Body Composition Data per MARADMIN 066/26 (as modified by MARADMIN 073/26)
// Effective 1 January 2026

// WHtR standard: <= 0.52 regardless of sex (MARADMIN 073/26 corrected to "less than or equal to")
export const WHTR_STANDARD = 0.52;

// Official Height / Max Waist table from MARADMIN 066/26, paragraph 6
// Heights and max waist values in inches (already account for rounding down to nearest 1/2 inch)
export const heightWaistTable = [
  { height: 53, maxWaist: 27.5 },
  { height: 53.5, maxWaist: 27.5 },
  { height: 54, maxWaist: 28.0 },
  { height: 54.5, maxWaist: 28.0 },
  { height: 55, maxWaist: 28.5 },
  { height: 55.5, maxWaist: 28.5 },
  { height: 56, maxWaist: 29.0 },
  { height: 56.5, maxWaist: 29.0 },
  { height: 57, maxWaist: 29.5 },
  { height: 57.5, maxWaist: 29.5 },
  { height: 58, maxWaist: 30.0 },
  { height: 58.5, maxWaist: 30.0 },
  { height: 59, maxWaist: 30.5 },
  { height: 59.5, maxWaist: 30.5 },
  { height: 60, maxWaist: 31.0 },
  { height: 60.5, maxWaist: 31.0 },
  { height: 61, maxWaist: 31.5 },
  { height: 61.5, maxWaist: 31.5 },
  { height: 62, maxWaist: 32.0 },
  { height: 62.5, maxWaist: 32.5 },
  { height: 63, maxWaist: 32.5 },
  { height: 63.5, maxWaist: 33.0 },
  { height: 64, maxWaist: 33.0 },
  { height: 64.5, maxWaist: 33.5 },
  { height: 65, maxWaist: 33.5 },
  { height: 65.5, maxWaist: 34.0 },
  { height: 66, maxWaist: 34.0 },
  { height: 66.5, maxWaist: 34.5 },
  { height: 67, maxWaist: 34.5 },
  { height: 67.5, maxWaist: 35.0 },
  { height: 68, maxWaist: 35.0 },
  { height: 68.5, maxWaist: 35.5 },
  { height: 69, maxWaist: 35.5 },
  { height: 69.5, maxWaist: 36.0 },
  { height: 70, maxWaist: 36.0 },
  { height: 70.5, maxWaist: 36.5 },
  { height: 71, maxWaist: 36.5 },
  { height: 71.5, maxWaist: 37.0 },
  { height: 72, maxWaist: 37.0 },
  { height: 72.5, maxWaist: 37.5 },
  { height: 73, maxWaist: 37.5 },
  { height: 73.5, maxWaist: 38.0 },
  { height: 74, maxWaist: 38.0 },
  { height: 74.5, maxWaist: 38.5 },
  { height: 75, maxWaist: 39.0 },
  { height: 75.5, maxWaist: 39.0 },
  { height: 76, maxWaist: 39.5 },
  { height: 76.5, maxWaist: 39.5 },
  { height: 77, maxWaist: 40.0 },
  { height: 77.5, maxWaist: 40.0 },
  { height: 78, maxWaist: 40.5 },
  { height: 78.5, maxWaist: 40.5 },
  { height: 79, maxWaist: 41.0 },
  { height: 79.5, maxWaist: 41.0 },
  { height: 80, maxWaist: 41.5 },
  { height: 80.5, maxWaist: 41.5 },
  { height: 81, maxWaist: 42.0 },
  { height: 81.5, maxWaist: 42.0 },
  { height: 82, maxWaist: 42.5 },
  { height: 82.5, maxWaist: 42.5 },
  { height: 83, maxWaist: 43.0 },
  { height: 83.5, maxWaist: 43.0 },
  { height: 84, maxWaist: 43.5 },
];

// Body fat standards per MCO 6110.3A (unchanged by MARADMIN 066/26)
export const bodyFatStandards = {
  male: { '17-20': 18, '21-25': 18, '26-30': 19, '31-35': 19, '36-40': 20, '41-45': 20, '46-50': 21, '51+': 21 },
  female: { '17-20': 26, '21-25': 26, '26-30': 27, '31-35': 27, '36-40': 28, '41-45': 28, '46-50': 29, '51+': 29 },
};

// Physical performance consideration thresholds per MARADMIN 066/26, para. 2.b.2
// Requires 1st class PFT AND CFT in current semiannual period
export const performanceConsiderations = {
  // >= 285 on BOTH PFT and CFT: absolute body fat caps
  tier1: {
    minScore: 285,
    male: 26,
    female: 36,
  },
  // >= 250 on BOTH PFT and CFT: +1% above age-group max (not to exceed tier1 caps)
  tier2: {
    minScore: 250,
  },
};
