const LEVEL_THRESHOLDS = [
  0,      // Level 1
  500,    // Level 2
  1200,   // Level 3
  2100,   // Level 4
  3200,   // Level 5
  4500,   // Level 6
  6000,   // Level 7
  7700,   // Level 8
  9600,   // Level 9
  11700,  // Level 10
  14000,  // Level 11
  16500,  // Level 12
  19200,  // Level 13
  22100,  // Level 14
  25200,  // Level 15
  28500,  // Level 16
  32000,  // Level 17
  35500,  // Level 18
  39500,  // Level 19
  44500,  // Level 20
  50000,  // Level 21
  56000,  // Level 22
  62500,  // Level 23
  69000,  // Level 24
  76000,  // Level 25
  83500,  // Level 26
  91500,  // Level 27
  99500,  // Level 28
  108000, // Level 29
  117000  // Level 30
];

export function getLevelFromXp(totalXp) {
  const xp = Math.max(0, totalXp);

  let level = 1;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  return level;
}

export function getLevelStartXp(level) {
  const safeLevel = Math.max(1, Math.floor(level));

  if (safeLevel <= LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[safeLevel - 1];
  }

  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getNextLevelXp(level) {
  const safeLevel = Math.max(1, Math.floor(level));

  if (safeLevel < LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[safeLevel];
  }

  return null;
}

export function getXpProgress(totalXp) {
  const xp = Math.max(0, totalXp);
  const level = getLevelFromXp(xp);
  const currentLevelXp = getLevelStartXp(level);
  const nextLevelXp = getNextLevelXp(level);

  if (nextLevelXp === null) {
    return {
      level,
      currentLevelXp,
      nextLevelXp: null,
      xpIntoLevel: xp - currentLevelXp,
      xpNeeded: null,
      percentage: 100
    };
  }

  const xpIntoLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;
  const percentage = Math.min(100, (xpIntoLevel / xpNeeded) * 100);

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    xpIntoLevel,
    xpNeeded,
    percentage
  };
}
