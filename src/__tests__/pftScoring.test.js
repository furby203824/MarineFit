import { describe, it, expect } from 'vitest';
import {
  calculatePFTScore,
  calculateCFTScore,
  getClassification,
  getAgeGroup,
  calculateUpperBodyScore,
  calculatePlankScore,
  calculateRunScore,
  calculateMTCScore,
  calculateALScore,
  calculateMANUFScore,
  getRequiredUpperBodyReps,
  getRequiredPlankTime,
  getRequiredRunTime,
  getScoringThresholds,
  ageGroups,
} from '../utils/pftScoring';

// ============================================
// CLASSIFICATION TESTS
// ============================================
describe('getClassification', () => {
  it('returns 1st Class for score >= 235', () => {
    expect(getClassification(235).name).toBe('1st Class');
    expect(getClassification(300).name).toBe('1st Class');
  });

  it('returns 2nd Class for 200-234', () => {
    expect(getClassification(200).name).toBe('2nd Class');
    expect(getClassification(234).name).toBe('2nd Class');
  });

  it('returns 3rd Class for 150-199', () => {
    expect(getClassification(150).name).toBe('3rd Class');
    expect(getClassification(199).name).toBe('3rd Class');
  });

  it('returns Failure for < 150', () => {
    expect(getClassification(149).name).toBe('Failure');
    expect(getClassification(0).name).toBe('Failure');
  });
});

// ============================================
// AGE GROUP TESTS
// ============================================
describe('getAgeGroup', () => {
  it('returns correct age groups', () => {
    expect(getAgeGroup(17)).toBe('17-20');
    expect(getAgeGroup(20)).toBe('17-20');
    expect(getAgeGroup(21)).toBe('21-25');
    expect(getAgeGroup(30)).toBe('26-30');
    expect(getAgeGroup(55)).toBe('51+');
  });

  it('handles edge cases gracefully', () => {
    expect(getAgeGroup(16)).toBe('17-20'); // Below minimum
    expect(getAgeGroup(100)).toBe('51+');  // Very old
  });
});

// ============================================
// INDIVIDUAL EVENT SCORING TESTS
// ============================================
describe('calculateUpperBodyScore', () => {
  it('returns 100 for max pull-ups (male 21-25)', () => {
    expect(calculateUpperBodyScore('male', '21-25', 'pullups', 23)).toBe(100);
  });

  it('returns 100 for exceeding max (capped)', () => {
    expect(calculateUpperBodyScore('male', '21-25', 'pullups', 30)).toBe(100);
  });

  it('returns 40 for minimum pull-ups (male 21-25)', () => {
    expect(calculateUpperBodyScore('male', '21-25', 'pullups', 4)).toBe(40);
  });

  it('returns 0 for below minimum', () => {
    expect(calculateUpperBodyScore('male', '21-25', 'pullups', 3)).toBe(0);
    expect(calculateUpperBodyScore('male', '21-25', 'pullups', 0)).toBe(0);
  });

  it('handles push-ups correctly', () => {
    expect(calculateUpperBodyScore('male', '21-25', 'pushups', 87)).toBe(100);
    expect(calculateUpperBodyScore('male', '21-25', 'pushups', 47)).toBe(40);
  });

  it('handles female scoring', () => {
    expect(calculateUpperBodyScore('female', '21-25', 'pullups', 11)).toBe(100);
    expect(calculateUpperBodyScore('female', '21-25', 'pullups', 1)).toBe(40);
  });

  it('returns 0 for invalid inputs', () => {
    expect(calculateUpperBodyScore(null, '21-25', 'pullups', 10)).toBe(0);
    expect(calculateUpperBodyScore('male', '21-25', 'pullups', -5)).toBe(0);
    expect(calculateUpperBodyScore('invalid', '21-25', 'pullups', 10)).toBe(0);
  });
});

describe('calculatePlankScore', () => {
  it('returns 100 for 3:45 (225s)', () => {
    expect(calculatePlankScore(3, 45)).toBe(100);
  });

  it('returns 100 for over 3:45', () => {
    expect(calculatePlankScore(4, 0)).toBe(100);
  });

  it('returns 40 for 0:40 minimum', () => {
    expect(calculatePlankScore(0, 40)).toBe(40);
  });

  it('returns 0 for below 0:40', () => {
    expect(calculatePlankScore(0, 39)).toBe(0);
    expect(calculatePlankScore(0, 0)).toBe(0);
  });

  it('returns score between 40-100 for intermediate values', () => {
    const score = calculatePlankScore(2, 0); // 120 seconds
    expect(score).toBeGreaterThan(40);
    expect(score).toBeLessThan(100);
  });
});

describe('calculateRunScore', () => {
  it('returns 100 for max run time (male 21-25: 18:00)', () => {
    expect(calculateRunScore('male', '21-25', 18, 0)).toBe(100);
  });

  it('returns 0 for run time exceeding minimum', () => {
    expect(calculateRunScore('male', '21-25', 30, 0)).toBe(0);
  });

  it('returns 0 for invalid gender', () => {
    expect(calculateRunScore('invalid', '21-25', 18, 0)).toBe(0);
  });
});

// ============================================
// CFT EVENT SCORING TESTS
// ============================================
describe('calculateMTCScore', () => {
  it('returns 100 for max MTC (male 21-25: 2:34)', () => {
    expect(calculateMTCScore('male', '21-25', 2, 34)).toBe(100);
  });

  it('returns 0 for invalid inputs', () => {
    expect(calculateMTCScore(null, '21-25', 2, 34)).toBe(0);
  });
});

describe('calculateALScore', () => {
  it('returns 100 for max ammo lifts (male 21-25: 115)', () => {
    expect(calculateALScore('male', '21-25', 115)).toBe(100);
  });

  it('returns 0 for below minimum', () => {
    expect(calculateALScore('male', '21-25', 10)).toBe(0);
  });
});

describe('calculateMANUFScore', () => {
  it('returns 100 for max MANUF (male 21-25: 2:19)', () => {
    expect(calculateMANUFScore('male', '21-25', 2, 19)).toBe(100);
  });
});

// ============================================
// COMPOSITE SCORE TESTS
// ============================================
describe('calculatePFTScore', () => {
  it('calculates complete PFT score', () => {
    const result = calculatePFTScore('male', '21-25', {
      upperBodyType: 'pullups',
      upperBodyReps: 23,
      plankMinutes: 3,
      plankSeconds: 45,
      runMinutes: 18,
      runSeconds: 0,
    });

    expect(result.totalScore).toBe(300);
    expect(result.upperBodyScore).toBe(100);
    expect(result.plankScore).toBe(100);
    expect(result.runScore).toBe(100);
    expect(result.classification.name).toBe('1st Class');
  });

  it('calculates a mid-range PFT score', () => {
    const result = calculatePFTScore('male', '21-25', {
      upperBodyType: 'pullups',
      upperBodyReps: 10,
      plankMinutes: 2,
      plankSeconds: 0,
      runMinutes: 24,
      runSeconds: 0,
    });

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThan(300);
  });

  it('handles invalid gender gracefully', () => {
    const result = calculatePFTScore('invalid', '21-25', {
      upperBodyType: 'pullups',
      upperBodyReps: 10,
      plankMinutes: 2,
      plankSeconds: 0,
      runMinutes: 22,
      runSeconds: 0,
    });

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateCFTScore', () => {
  it('calculates complete CFT score', () => {
    const result = calculateCFTScore('male', '21-25', {
      mtcMinutes: 2,
      mtcSeconds: 34,
      ammoLifts: 115,
      manufMinutes: 2,
      manufSeconds: 19,
      isAltitude: false,
    });

    expect(result.totalScore).toBe(300);
    expect(result.classification.name).toBe('1st Class');
  });
});

// ============================================
// INVERSE SCORING (REQUIRED FOR TARGET)
// ============================================
describe('getRequiredUpperBodyReps', () => {
  it('returns min reps for score of 40', () => {
    const reps = getRequiredUpperBodyReps('male', '21-25', 'pullups', 40);
    expect(reps).toBe(4); // pullupMin for male 21-25
  });

  it('returns max reps for score of 100', () => {
    const reps = getRequiredUpperBodyReps('male', '21-25', 'pullups', 100);
    expect(reps).toBe(23); // pullupMax for male 21-25
  });

  it('returns 0 for invalid inputs', () => {
    expect(getRequiredUpperBodyReps('invalid', '21-25', 'pullups', 80)).toBe(0);
  });
});

describe('getRequiredPlankTime', () => {
  it('returns "3:45" for score of 100', () => {
    expect(getRequiredPlankTime(100)).toBe('3:45');
  });

  it('returns "0:40" for score of 40', () => {
    expect(getRequiredPlankTime(40)).toBe('0:40');
  });

  it('returns formatted time for intermediate scores', () => {
    const time = getRequiredPlankTime(70);
    expect(typeof time).toBe('string');
    expect(time).toMatch(/^\d+:\d{2}$/);
  });
});

describe('getRequiredRunTime', () => {
  it('returns formatted max time for score of 100', () => {
    const time = getRequiredRunTime('male', '21-25', 100);
    expect(time).toBe('18:00');
  });

  it('returns N/A for invalid gender', () => {
    expect(getRequiredRunTime('invalid', '21-25', 100)).toBe('N/A');
  });
});

// ============================================
// SCORING THRESHOLDS
// ============================================
describe('getScoringThresholds', () => {
  it('returns correct thresholds for pullups', () => {
    const thresholds = getScoringThresholds('male', '21-25', 'pullups');
    expect(thresholds).toHaveProperty('max');
    expect(thresholds).toHaveProperty('min');
    expect(thresholds.max).toBe(23);
    expect(thresholds.min).toBe(4);
  });

  it('returns null for invalid gender', () => {
    expect(getScoringThresholds('invalid', '21-25', 'pullups')).toBeNull();
  });
});

// ============================================
// DATA INTEGRITY
// ============================================
describe('ageGroups', () => {
  it('has 8 age groups', () => {
    expect(ageGroups).toHaveLength(8);
  });

  it('starts with 17-20 and ends with 51+', () => {
    expect(ageGroups[0]).toBe('17-20');
    expect(ageGroups[ageGroups.length - 1]).toBe('51+');
  });
});
