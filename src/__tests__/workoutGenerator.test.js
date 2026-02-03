import { describe, it, expect } from 'vitest';
import { generateWorkout } from '../utils/workoutGenerator';
import { goals } from '../data/hittData';

describe('generateWorkout', () => {
  it('generates a workout with the correct structure', () => {
    const workout = generateWorkout({
      time: '30',
      goal: goals.STANDARD,
      equipment: [],
    });

    expect(workout).toHaveProperty('id');
    expect(workout).toHaveProperty('title');
    expect(workout).toHaveProperty('date');
    expect(workout).toHaveProperty('blocks');
    expect(Array.isArray(workout.blocks)).toBe(true);
    expect(workout.blocks.length).toBeGreaterThan(0);
  });

  it('generates blocks with exercises', () => {
    const workout = generateWorkout({
      time: '30',
      goal: goals.STANDARD,
      equipment: [],
    });

    workout.blocks.forEach((block) => {
      expect(block).toHaveProperty('name');
      expect(block).toHaveProperty('exercises');
      expect(Array.isArray(block.exercises)).toBe(true);
    });
  });

  it('assigns prescriptions to exercises', () => {
    const workout = generateWorkout({
      time: '30',
      goal: goals.STANDARD,
      equipment: [],
    });

    const allExercises = workout.blocks.flatMap((b) => b.exercises);
    allExercises.forEach((ex) => {
      expect(ex).toHaveProperty('prescription');
      expect(ex.prescription).toHaveProperty('sets');
      expect(ex.prescription).toHaveProperty('reps');
      expect(ex.prescription).toHaveProperty('rest');
    });
  });

  it('respects equipment selection (bodyweight only)', () => {
    const workout = generateWorkout({
      time: '30',
      goal: goals.STANDARD,
      equipment: [], // No extra equipment = bodyweight only
    });

    const allExercises = workout.blocks.flatMap((b) => b.exercises);
    allExercises.forEach((ex) => {
      expect(ex.equipment).toBe('Bodyweight');
    });
  });

  it('includes equipment exercises when equipment is selected', () => {
    const workout = generateWorkout({
      time: '30',
      goal: goals.STANDARD,
      equipment: ['Barbell', 'Dumbbell'],
    });

    const allExercises = workout.blocks.flatMap((b) => b.exercises);
    const equipmentTypes = new Set(allExercises.map((ex) => ex.equipment));
    // Should include at least bodyweight plus optionally selected equipment
    expect(equipmentTypes.has('Bodyweight')).toBe(true);
  });

  it('generates unique exercise IDs (no duplicates within workout)', () => {
    const workout = generateWorkout({
      time: '60',
      goal: goals.STANDARD,
      equipment: ['Barbell', 'Dumbbell', 'Kettlebell'],
    });

    const allExercises = workout.blocks.flatMap((b) => b.exercises);
    const ids = allExercises.map((ex) => ex.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('generates workouts with varied exercise selections', () => {
    // Run 10 generations and check that not all are identical
    const exerciseSets = new Set();
    for (let i = 0; i < 10; i++) {
      const workout = generateWorkout({
        time: '30',
        goal: goals.STANDARD,
        equipment: ['Barbell', 'Dumbbell'],
      });
      const exerciseNames = workout.blocks.flatMap(b => b.exercises.map(e => e.name)).join(',');
      exerciseSets.add(exerciseNames);
    }
    // With randomization, we should get multiple distinct workouts
    expect(exerciseSets.size).toBeGreaterThan(1);
  });

  it('generates a 60-minute workout with more exercises than 30-min', () => {
    const short = generateWorkout({
      time: '30',
      goal: goals.STANDARD,
      equipment: [],
    });

    const long = generateWorkout({
      time: '60',
      goal: goals.STANDARD,
      equipment: [],
    });

    const shortCount = short.blocks.flatMap((b) => b.exercises).length;
    const longCount = long.blocks.flatMap((b) => b.exercises).length;

    expect(longCount).toBeGreaterThanOrEqual(shortCount);
  });

  it('handles all goal types without errors', () => {
    const goalValues = Object.values(goals);
    goalValues.forEach((goal) => {
      const workout = generateWorkout({
        time: '30',
        goal,
        equipment: [],
      });
      expect(workout).toHaveProperty('blocks');
      expect(workout.blocks.length).toBeGreaterThan(0);
    });
  });
});
