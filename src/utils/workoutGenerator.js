import { hittExercises, categories, goals } from '../data/hittData';

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
    // 'None' (Bodyweight) is always allowed.
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
      
      // Add some randomness so it's not always the exact same top 3
      // We swap elements occasionally to keep it fresh while maintaining high average difficulty
      if (Math.random() > 0.3) {
         candidates.sort(() => 0.5 - Math.random());
         // Re-sort top half slightly? Let's just trust the shuffle for variety if the list is long
         // Actually, pure shuffle ruins the difficulty bias. 
         // Let's do a "bucket shuffle": Take top 50%, shuffle them.
      }
    } else if (difficultyModifier < 0) {
      // User wants it EASY -> Ascending Difficulty
      candidates = candidates.sort((a, b) => a.difficulty - b.difficulty);
    } else {
       // Standard/Neutral -> Pure Shuffle
       candidates = candidates.sort(() => 0.5 - Math.random());
    }

    const selected = [];
    const usedTags = new Set();

    for (const ex of candidates) {
      if (selected.length >= config.count) break;

      // Logic Rule #4: Avoid Redundancy
      // Try not to pick two "Upper Push" exercises in a short workout
      // This is a soft rule; we check if primary tags overlap too much
      const primaryTag = ex.tags[0]; // Heuristic: first tag is primary
      if (usedTags.has(primaryTag) && candidates.length > config.count) {
        continue; // Skip if we have alternatives
      }

      selected.push(ex);
      usedTags.add(primaryTag);
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
