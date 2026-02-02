// Marine Corps HITT Database
// Expanded to support dynamic workout generation, progression/regression, and equipment tagging.

export const equipmentTags = {
  NONE: 'Bodyweight',
  KETTLEBELL: 'Kettlebell',
  DUMBBELL: 'Dumbbell',
  SANDBAG: 'Sandbag',
  AMMO_CAN: 'Ammo Can',
  TRX: 'TRX',
  BARBELL: 'Barbell',
  BOX: 'Box',
  SLED: 'Sled',
  BATTLE_ROPE: 'Battle Rope',
  CONES: 'Cones'
};

export const categories = {
  MOVEMENT_PREP: 'Movement Prep',
  STRENGTH_POWER: 'Strength & Power',
  SPEED_AGILITY: 'Speed, Agility & Endurance',
  CORE: 'Core',
  FLEXIBILITY: 'Flexibility & Recovery' // New category
};

export const goals = {
  STANDARD: 'Standard Combat Readiness',
  STRENGTH: 'Strength & Hypertrophy',
  POWER: 'Explosive Power',
  ENDURANCE: 'Tactical Endurance',
  RECOVERY: 'Active Recovery'
};

// Helper to infer tags if not explicitly provided (Logic Rule #1)
const inferTags = (name, specifiedEquipment) => {
  const tags = [];
  const lowerName = name.toLowerCase();
  
  if (specifiedEquipment && specifiedEquipment !== 'None') {
    tags.push(specifiedEquipment);
  } else {
    tags.push(equipmentTags.NONE);
  }

  // Auto-tagging based on name keywords
  if (lowerName.includes('jump') || lowerName.includes('sprint') || lowerName.includes('plyo')) tags.push('Plyometric');
  if (lowerName.includes('squat') || lowerName.includes('lunge')) tags.push('Lower Body');
  if (lowerName.includes('push') || lowerName.includes('press')) tags.push('Upper Push');
  if (lowerName.includes('pull') || lowerName.includes('row')) tags.push('Upper Pull');
  
  return tags;
};

const rawExercises = [
  // MOVEMENT PREP (Dynamic Warmup)
  {
    id: 'mp-1',
    category: categories.MOVEMENT_PREP,
    name: 'Glute Bridge',
    url: 'https://www.youtube.com/watch?v=wPM8icPu6t8',
    equipment: equipmentTags.NONE,
    difficulty: 1,
    progression: 'mp-1-p', // Single Leg Glute Bridge
  },
  {
    id: 'mp-2',
    category: categories.MOVEMENT_PREP,
    name: 'Frankensteins',
    url: 'https://www.youtube.com/watch?v=Kz6-4-1',
    equipment: equipmentTags.NONE,
    difficulty: 1,
  },
  {
    id: 'mp-3',
    category: categories.MOVEMENT_PREP,
    name: 'Lateral Lunge',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
    regression: 'mp-3-r', // Stationary Side Stretch
  },
  {
    id: 'mp-4',
    category: categories.MOVEMENT_PREP,
    name: 'World\'s Greatest Stretch',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
  },
  {
    id: 'mp-5',
    category: categories.MOVEMENT_PREP,
    name: 'Inchworm',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
  },
  {
    id: 'mp-6',
    category: categories.MOVEMENT_PREP,
    name: 'Thoracic Rotations',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 1,
  },

  // STRENGTH & POWER
  {
    id: 'sp-1',
    category: categories.STRENGTH_POWER,
    name: 'Kettlebell Swing',
    url: '',
    equipment: equipmentTags.KETTLEBELL,
    difficulty: 2,
    tags: ['Hinge', 'Power', 'Posterior Chain'],
  },
  {
    id: 'sp-2',
    category: categories.STRENGTH_POWER,
    name: 'Goblet Squat',
    url: '',
    equipment: equipmentTags.KETTLEBELL,
    difficulty: 2,
    regression: 'sp-9', // Air Squat
    tags: ['Squat', 'Lower Body'],
  },
  {
    id: 'sp-3',
    category: categories.STRENGTH_POWER,
    name: 'Sandbag Clean',
    url: '',
    equipment: equipmentTags.SANDBAG,
    difficulty: 3,
    tags: ['Power', 'Full Body'],
  },
  {
    id: 'sp-4',
    category: categories.STRENGTH_POWER,
    name: 'Pull-ups',
    url: '',
    equipment: 'Pull-up Bar',
    difficulty: 3,
    regression: 'sp-4-r', // Banded Pull-up or Inverted Row
    tags: ['Upper Pull', 'Back'],
  },
  {
    id: 'sp-5',
    category: categories.STRENGTH_POWER,
    name: 'Push-ups (Hand Release)',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
    regression: 'sp-5-r', // Knee Push-ups
    progression: 'sp-11', // Diamond Push-ups
    tags: ['Upper Push', 'Chest'],
  },
  {
    id: 'sp-6',
    category: categories.STRENGTH_POWER,
    name: 'Box Jumps',
    url: '',
    equipment: equipmentTags.BOX,
    difficulty: 3,
    regression: 'sp-6-r', // Step Ups
    tags: ['Plyometric', 'Lower Body'],
  },
  {
    id: 'sp-7',
    category: categories.STRENGTH_POWER,
    name: 'Thrusters',
    url: '',
    equipment: 'Barbell/Dumbbell',
    difficulty: 4,
    tags: ['Full Body', 'Power', 'Metabolic'],
  },
  {
    id: 'sp-8',
    category: categories.STRENGTH_POWER,
    name: 'Ammo Can Press',
    url: '',
    equipment: equipmentTags.AMMO_CAN,
    difficulty: 2,
    tags: ['Upper Push', 'Shoulders'],
  },
  {
    id: 'sp-9',
    category: categories.STRENGTH_POWER,
    name: 'Air Squats',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 1,
    progression: 'sp-2', // Goblet Squat
    tags: ['Squat', 'Lower Body'],
  },
  {
    id: 'sp-10',
    category: categories.STRENGTH_POWER,
    name: 'Walking Lunges',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
    tags: ['Unilateral', 'Lower Body'],
  },
  {
    id: 'sp-11',
    category: categories.STRENGTH_POWER,
    name: 'Diamond Push-ups',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 3,
    tags: ['Upper Push', 'Triceps'],
  },
  {
    id: 'sp-12',
    category: categories.STRENGTH_POWER,
    name: 'Pike Push-ups',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 3,
    tags: ['Upper Push', 'Shoulders'],
  },
  {
    id: 'sp-13',
    category: categories.STRENGTH_POWER,
    name: 'Broad Jumps',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
    tags: ['Plyometric', 'Power'],
  },

  // SPEED, AGILITY & ENDURANCE
  {
    id: 'sae-1',
    category: categories.SPEED_AGILITY,
    name: '300 Yard Shuttle',
    url: '',
    equipment: equipmentTags.CONES,
    difficulty: 4,
    tags: ['Anaerobic', 'Running'],
  },
  {
    id: 'sae-2',
    category: categories.SPEED_AGILITY,
    name: 'Burpees',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 3,
    tags: ['Metabolic', 'Full Body'],
  },
  {
    id: 'sae-3',
    category: categories.SPEED_AGILITY,
    name: 'Mountain Climbers',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
    tags: ['Core', 'Metabolic'],
  },
  {
    id: 'sae-4',
    category: categories.SPEED_AGILITY,
    name: 'Sled Push',
    url: '',
    equipment: equipmentTags.SLED,
    difficulty: 4,
    tags: ['Power', 'Legs'],
  },
  {
    id: 'sae-5',
    category: categories.SPEED_AGILITY,
    name: 'Battle Ropes',
    url: '',
    equipment: equipmentTags.BATTLE_ROPE,
    difficulty: 3,
    tags: ['Upper Body', 'Metabolic'],
  },
  {
    id: 'sae-6',
    category: categories.SPEED_AGILITY,
    name: '400m Sprint',
    url: '',
    equipment: 'Track/Field',
    difficulty: 3,
    tags: ['Running', 'Anaerobic'],
  },
  {
    id: 'sae-7',
    category: categories.SPEED_AGILITY,
    name: 'High Knees',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 1,
    tags: ['Cardio'],
  },
  {
    id: 'sae-8',
    category: categories.SPEED_AGILITY,
    name: 'Jumping Jacks',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 1,
    tags: ['Cardio'],
  },
  {
    id: 'sae-9',
    category: categories.SPEED_AGILITY,
    name: 'Bear Crawl',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 3,
    tags: ['Full Body', 'Mobility'],
  },
  {
    id: 'sae-10',
    category: categories.SPEED_AGILITY,
    name: '8-Count Bodybuilders',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 4,
    tags: ['Full Body', 'Metabolic'],
  },

  // FLEXIBILITY & RECOVERY (New Category)
  {
    id: 'flx-1',
    category: categories.FLEXIBILITY,
    name: 'Pigeon Stretch',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 1,
    tags: ['Hips', 'Static'],
  },
  {
    id: 'flx-2',
    category: categories.FLEXIBILITY,
    name: 'Couch Stretch',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
    tags: ['Quads', 'Hip Flexors'],
  },
  {
    id: 'flx-3',
    category: categories.FLEXIBILITY,
    name: 'Doorway Pec Stretch',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 1,
    tags: ['Chest', 'Shoulders'],
  },
  {
    id: 'flx-4',
    category: categories.FLEXIBILITY,
    name: 'Hamstring Flossing',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 1,
    tags: ['Hamstrings', 'Mobility'],
  },
  {
    id: 'flx-5',
    category: categories.FLEXIBILITY,
    name: 'Bretzel Stretch',
    url: '',
    equipment: equipmentTags.NONE,
    difficulty: 2,
    tags: ['Thoracic', 'Hips', 'Rotation'],
  }
];

// Enrich exercises with inferred tags if missing
export const hittExercises = rawExercises.map(ex => ({
  ...ex,
  tags: ex.tags ? [...ex.tags, ...inferTags(ex.name, ex.equipment)] : inferTags(ex.name, ex.equipment)
}));
