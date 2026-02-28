import { describe, it, expect } from 'vitest';
import {
  roundDownToHalf,
  calculateWHtR,
  isWithinWHtR,
  getMaxWaist,
  getBodyFatLimit,
  evaluateBodyComp,
} from '../utils/bodyCompScoring';

describe('roundDownToHalf', () => {
  it('rounds down to nearest 0.5', () => {
    expect(roundDownToHalf(70.3)).toBe(70.0);
    expect(roundDownToHalf(70.7)).toBe(70.5);
    expect(roundDownToHalf(70.5)).toBe(70.5);
    expect(roundDownToHalf(70.0)).toBe(70.0);
    expect(roundDownToHalf(65.9)).toBe(65.5);
    expect(roundDownToHalf(65.1)).toBe(65.0);
  });
});

describe('calculateWHtR', () => {
  it('computes ratio with rounding', () => {
    const result = calculateWHtR(70, 35);
    expect(result.ratio).toBe(0.5);
    expect(result.roundedHeight).toBe(70);
    expect(result.roundedWaist).toBe(35);
  });

  it('rounds inputs down before computing', () => {
    // 70.3 -> 70.0, 36.8 -> 36.5
    const result = calculateWHtR(70.3, 36.8);
    expect(result.roundedHeight).toBe(70);
    expect(result.roundedWaist).toBe(36.5);
    expect(result.ratio).toBeCloseTo(36.5 / 70, 10);
  });

  it('returns null for invalid height', () => {
    expect(calculateWHtR(0, 35)).toBeNull();
    expect(calculateWHtR(-5, 35)).toBeNull();
  });
});

describe('isWithinWHtR', () => {
  it('passes at exactly 0.52 (<=0.52 per MARADMIN 073/26)', () => {
    // 70" height, 36.4" waist -> rounds to 36.0 -> 36/70 = 0.5143 (pass)
    // Need exact 0.52: waist/height = 0.52 => waist = 0.52 * height
    // height=50, waist=26 => 26/50 = 0.52
    expect(isWithinWHtR(50, 26)).toBe(true);
  });

  it('fails above 0.52', () => {
    // height=50, waist=26.5 => 26.5/50 = 0.53
    expect(isWithinWHtR(50, 26.5)).toBe(false);
  });

  it('passes below 0.52', () => {
    // height=70, waist=35 => 35/70 = 0.50
    expect(isWithinWHtR(70, 35)).toBe(true);
  });
});

describe('getMaxWaist', () => {
  it('returns correct max waist for common heights', () => {
    expect(getMaxWaist(70)).toBe(36.0);
    expect(getMaxWaist(66)).toBe(34.0);
    expect(getMaxWaist(72)).toBe(37.0);
    expect(getMaxWaist(60)).toBe(31.0);
    expect(getMaxWaist(84)).toBe(43.5);
    expect(getMaxWaist(53)).toBe(27.5);
  });

  it('rounds height down before lookup', () => {
    // 70.3 rounds to 70.0
    expect(getMaxWaist(70.3)).toBe(36.0);
    // 70.7 rounds to 70.5
    expect(getMaxWaist(70.7)).toBe(36.5);
  });

  it('returns null for heights not in the table', () => {
    expect(getMaxWaist(50)).toBeNull();
    expect(getMaxWaist(90)).toBeNull();
  });
});

describe('getBodyFatLimit', () => {
  it('returns base standards for no PFT/CFT scores', () => {
    expect(getBodyFatLimit('male', '21-25', 0, 0)).toBe(18);
    expect(getBodyFatLimit('female', '21-25', 0, 0)).toBe(26);
    expect(getBodyFatLimit('male', '41-45', 0, 0)).toBe(20);
  });

  it('returns tier 1 caps for scores >= 285 on both', () => {
    expect(getBodyFatLimit('male', '21-25', 285, 285)).toBe(26);
    expect(getBodyFatLimit('female', '21-25', 285, 285)).toBe(36);
    expect(getBodyFatLimit('male', '21-25', 300, 290)).toBe(26);
  });

  it('returns base + 1 for scores >= 250 on both (tier 2)', () => {
    expect(getBodyFatLimit('male', '21-25', 250, 260)).toBe(19); // 18 + 1
    expect(getBodyFatLimit('female', '31-35', 260, 250)).toBe(28); // 27 + 1
  });

  it('does not apply tier 2 if only one test >= 250', () => {
    expect(getBodyFatLimit('male', '21-25', 250, 200)).toBe(18);
    expect(getBodyFatLimit('male', '21-25', 200, 260)).toBe(18);
  });

  it('tier 2 is capped at tier 1 maximums', () => {
    // If somehow base + 1 exceeds 26 for male, cap it
    // male 51+ base is 21, +1 = 22, which is below 26, so no cap
    expect(getBodyFatLimit('male', '51+', 260, 260)).toBe(22);
  });
});

describe('evaluateBodyComp', () => {
  it('returns WITHIN STANDARDS when WHtR passes', () => {
    const result = evaluateBodyComp({
      height: 70,
      waist: 35,
      gender: 'male',
      ageGroup: '21-25',
    });
    expect(result.status).toBe('WITHIN STANDARDS');
    expect(result.statusLevel).toBe('pass');
    expect(result.requiresBodyFat).toBe(false);
    expect(result.bcp).toBe(false);
  });

  it('returns EXCEEDS WHtR when ratio exceeds 0.52 and no body fat entered', () => {
    const result = evaluateBodyComp({
      height: 70,
      waist: 38,
      gender: 'male',
      ageGroup: '21-25',
    });
    expect(result.status).toBe('EXCEEDS WHtR');
    expect(result.statusLevel).toBe('warning');
    expect(result.requiresBodyFat).toBe(true);
  });

  it('returns WITHIN STANDARDS when WHtR fails but body fat passes', () => {
    const result = evaluateBodyComp({
      height: 70,
      waist: 38,
      gender: 'male',
      ageGroup: '21-25',
      bodyFatPercent: 17,
    });
    expect(result.status).toBe('WITHIN STANDARDS');
    expect(result.statusLevel).toBe('pass');
    expect(result.bcp).toBe(false);
  });

  it('returns EXCEEDS STANDARDS / BCP when both fail', () => {
    const result = evaluateBodyComp({
      height: 70,
      waist: 38,
      gender: 'male',
      ageGroup: '21-25',
      bodyFatPercent: 25,
    });
    expect(result.status).toBe('EXCEEDS STANDARDS');
    expect(result.statusLevel).toBe('fail');
    expect(result.bcp).toBe(true);
  });

  it('applies physical performance considerations', () => {
    // Male 21-25, base max = 18%. With 285+ on both PFT/CFT => 26% max
    const result = evaluateBodyComp({
      height: 70,
      waist: 38,
      gender: 'male',
      ageGroup: '21-25',
      bodyFatPercent: 22,
      pftScore: 290,
      cftScore: 285,
    });
    expect(result.status).toBe('WITHIN STANDARDS');
    expect(result.bodyFatLimit).toBe(26);
    expect(result.usedPerformanceConsideration).toBe(true);
  });

  it('records body fat method', () => {
    const result = evaluateBodyComp({
      height: 70,
      waist: 38,
      gender: 'male',
      ageGroup: '21-25',
      bodyFatPercent: 17,
      bodyFatMethod: 'bia',
    });
    expect(result.bodyFatMethod).toBe('bia');
  });
});
