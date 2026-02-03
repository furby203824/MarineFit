import { hittExercises, categories, goals, prescriptionTemplates } from '../data/hittData';

// Fisher-Yates shuffle for uniform random ordering
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get prescription based on category, goal, and exercise tags
const getPrescription = (exercise, category, goal) => {
  const tags = exercise.tags || [];
  const difficulty = exercise.difficulty || 2;

  // Base prescriptions by category
  if (category === categories.MOVEMENT_PREP) {
    return { sets: 1, reps: '10 each', rest: '0s', notes: 'Controlled movement' };
  }

  if (category === categories.FLEXIBILITY) {
    return { sets: 1, reps: '30s hold', rest: '0s', notes: 'Breathe deeply' };
  }

  if (category === categories.SPEED_AGILITY) {
    if (tags.includes('Conditioning') || tags.includes('Anaerobic')) {
      return { sets: 3, reps: '1 rep', rest: '90s', notes: 'Max effort' };
    }
    if (tags.includes('Agility') || tags.includes('Footwork')) {
      return { sets: 3, reps: '20 yds', rest: '30s', notes: 'Quick feet' };
    }
    return { sets: 3, reps: '30s', rest: '30s', notes: 'High intensity' };
  }

  // Strength & Power - varies by goal and exercise type
  if (category === categories.STRENGTH_POWER) {
    // Check for plyometric/explosive exercises
    if (tags.includes('Plyometric') || tags.includes('Power') || tags.includes('Olympic')) {
      if (goal === goals.POWER) {
        return { sets: 5, reps: '3-5', rest: '120s', notes: 'Explosive, full recovery' };
      }
      return { sets: 4, reps: '5-6', rest: '90s', notes: 'Explosive movement' };
    }

    // Core exercises
    if (tags.includes('Core') || tags.includes('Abs')) {
      if (goal === goals.ENDURANCE) {
        return { sets: 3, reps: '20-25', rest: '30s', notes: 'Controlled pace' };
      }
      return { sets: 3, reps: '12-15', rest: '45s', notes: 'Brace core' };
    }

    // Metabolic/cardio strength exercises
    if (tags.includes('Metabolic') || tags.includes('Cardio')) {
      return { sets: 3, reps: '30s', rest: '30s', notes: 'Keep moving' };
    }

    // Standard strength exercises - adjust by goal
    if (goal === goals.STRENGTH) {
      // Higher difficulty = heavier load expectation = lower reps
      if (difficulty >= 3) {
        return { sets: 4, reps: '6-8', rest: '90s', notes: 'Heavy load' };
      }
      return { sets: 4, reps: '8-10', rest: '75s', notes: 'Moderate-heavy load' };
    }

    if (goal === goals.ENDURANCE) {
      return { sets: 3, reps: '15-20', rest: '30s', notes: 'Light load, high reps' };
    }

    if (goal === goals.POWER) {
      return { sets: 4, reps: '5-8', rest: '90s', notes: 'Fast concentric' };
    }

    // Standard Combat Readiness (default)
    if (difficulty >= 3) {
      return { sets: 3, reps: '8-10', rest: '60s', notes: 'Control the movement' };
    }
    return { sets: 3, reps: '10-12', rest: '60s', notes: 'Steady tempo' };
  }

  // Fallback
  return { sets: 3, reps: '10', rest: '60s', notes: '' };
};

export const generateWorkout = (options) => {
  const {
    time = 30, // 30 or 60 minutes
    equipment = [], // Array of strings, e.g., ['Kettlebell', 'Ammo Can']
    goal = goals.STANDARD,
    difficultyModifier = 0
  } = options;

  // 1. Determine Work Capacity (Volume)
  // 60 min workout gets ~2x the main work volume of 30 min
  const isLongWorkout = parseInt(time) >= 60;

  const structure = {
    [categories.MOVEMENT_PREP]: { count: 3, intensity: 'low' },
    [categories.STRENGTH_POWER]: { count: isLongWorkout ? 6 : 3, intensity: 'high' },
    [categories.SPEED_AGILITY]: { count: isLongWorkout ? 4 : 2, intensity: 'high' },
    [categories.FLEXIBILITY]: { count: 3, intensity: 'low' }
  };

  // 2. Adjust for Goals (Logic Rule #2)
  if (goal === goals.STRENGTH) {
    structure[categories.STRENGTH_POWER].count += 1;
    structure[categories.SPEED_AGILITY].count = Math.max(1, structure[categories.SPEED_AGILITY].count - 1);
  } else if (goal === goals.ENDURANCE) {
    structure[categories.STRENGTH_POWER].count = Math.max(2, structure[categories.STRENGTH_POWER].count - 1);
    structure[categories.SPEED_AGILITY].count += 2;
  } else if (goal === goals.RECOVERY) {
    structure[categories.MOVEMENT_PREP].count += 2;
    structure[categories.FLEXIBILITY].count += 3;
    structure[categories.STRENGTH_POWER].count = 0;
    structure[categories.SPEED_AGILITY].count = 0;
  }

  // 3. Filter Candidates
  const availableExercises = hittExercises.filter(ex => {
    // Equipment Check: If exercise needs equipment, user must have it.
    // 'Bodyweight' is always allowed.
    if (ex.equipment !== 'Bodyweight' && !equipment.includes(ex.equipment)) {
      return false;
    }
    return true;
  });

  // 4. Select Exercises
  const workout = {
    id: Date.now(),
    date: new Date().toISOString(),
    title: `${goal} - ${time} Min`,
    goal: goal,
    duration: time,
    blocks: []
  };

  Object.entries(structure).forEach(([category, config]) => {
    if (config.count === 0) return;

    let candidates = availableExercises.filter(ex => ex.category === category);

    // Logic Rule #3: Difficulty Balancing
    // We use the difficultyModifier to bias the selection.
    // > 0: Prefer harder exercises (Sort Descending)
    // < 0: Prefer easier exercises (Sort Ascending)
    // 0: Random Mix

    // First, apply a weighted sort based on modifier
    if (difficultyModifier > 0 || (goal === goals.POWER && category === categories.STRENGTH_POWER)) {
      // User wants it HARD or is doing Power training -> Descending Difficulty
      candidates = candidates.sort((a, b) => b.difficulty - a.difficulty);
    } else if (difficultyModifier < 0) {
      // User wants it EASY -> Ascending Difficulty
      candidates = candidates.sort((a, b) => a.difficulty - b.difficulty);
    } else {
       // Standard/Neutral -> Pure Shuffle
       candidates = shuffleArray(candidates);
    }

    const selected = [];
    const usedTags = new Set();

    for (const ex of candidates) {
      if (selected.length >= config.count) break;

      // Logic Rule #4: Avoid Redundancy
      // Try not to pick two "Upper Push" exercises in a short workout
      // This is a soft rule; we check if primary tags overlap too much
      const primaryTag = ex.tags?.[0]; // Heuristic: first tag is primary
      if (primaryTag && usedTags.has(primaryTag) && candidates.length > config.count) {
        continue; // Skip if we have alternatives
      }

      // Add prescription to exercise
      const prescription = getPrescription(ex, category, goal);
      const exerciseWithPrescription = {
        ...ex,
        prescription
      };

      selected.push(exerciseWithPrescription);
      if (primaryTag) usedTags.add(primaryTag);
    }

    if (selected.length > 0) {
      workout.blocks.push({
        name: category,
        exercises: selected
      });
    }
  });

  return workout;
};
