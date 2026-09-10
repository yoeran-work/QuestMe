const STORAGE_KEY = "questme-data";
const STORAGE_VERSION = 1;

export function createInitialData() {
  return {
    version: STORAGE_VERSION,

    profile: {
      totalXp: 0,
      yBucks: 0
    },

    quests: [],

    questCompletions: [],

    rewards: [],

    purchases: [],

    consumedRewards: []
  };
}

export function loadAppData() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return createInitialData();
    }

    const parsedData = JSON.parse(storedData);

    if (!parsedData || typeof parsedData !== "object") {
      return createInitialData();
    }

    if (parsedData.version !== STORAGE_VERSION) {
      return migrateData(parsedData);
    }

    return {
      ...createInitialData(),
      ...parsedData,
      profile: {
        ...createInitialData().profile,
        ...(parsedData.profile || {})
      },
      quests: Array.isArray(parsedData.quests)
        ? parsedData.quests
        : [],
      questCompletions: Array.isArray(parsedData.questCompletions)
        ? parsedData.questCompletions
        : [],
      rewards: Array.isArray(parsedData.rewards)
        ? parsedData.rewards
        : [],
      purchases: Array.isArray(parsedData.purchases)
        ? parsedData.purchases
        : [],
      consumedRewards: Array.isArray(parsedData.consumedRewards)
        ? parsedData.consumedRewards
        : []
    };
  } catch (error) {
    console.error("QuestMe: failed to load saved data.", error);

    return createInitialData();
  }
}

export function saveAppData(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...data,
        version: STORAGE_VERSION
      })
    );
  } catch (error) {
    console.error("QuestMe: failed to save data.", error);
  }
}

export function clearAppData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("QuestMe: failed to clear saved data.", error);
  }
}

function migrateData(oldData) {
  console.warn(
    "QuestMe: saved data uses an older version. Returning a fresh data structure."
  );

  return createInitialData();
}
