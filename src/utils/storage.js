const STORAGE_KEY = "questme-data";
const STORAGE_VERSION = 3;

export function createInitialData() {
  return {
    version: STORAGE_VERSION,

    meta: {
      starterQuestsSeeded: false
    },

    profile: {
      characterName: "",
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

function normalizeData(data) {
  const initialData = createInitialData();

  return {
    ...initialData,
    ...data,

    version: STORAGE_VERSION,

    meta: {
      ...initialData.meta,
      ...(data.meta || {})
    },

    profile: {
      ...initialData.profile,
      ...(data.profile || {})
    },

    quests: Array.isArray(data.quests)
      ? data.quests
      : [],

    questCompletions: Array.isArray(
      data.questCompletions
    )
      ? data.questCompletions
      : [],

    rewards: Array.isArray(data.rewards)
      ? data.rewards
      : [],

    purchases: Array.isArray(data.purchases)
      ? data.purchases
      : [],

    consumedRewards: Array.isArray(
      data.consumedRewards
    )
      ? data.consumedRewards
      : []
  };
}

function migrateData(oldData) {
  if (
    oldData.version === 1 ||
    oldData.version === 2 ||
    oldData.version === undefined
  ) {
    return normalizeData({
      ...oldData,

      meta: {
        ...(oldData.meta || {}),

        starterQuestsSeeded:
          oldData.meta?.starterQuestsSeeded ??
          (
            Array.isArray(oldData.quests) &&
            oldData.quests.length > 0
          )
      },

      profile: {
        ...(oldData.profile || {}),

        characterName:
          oldData.profile?.characterName || ""
      }
    });
  }

  console.warn(
    "QuestMe: unknown save version. Starting with fresh data."
  );

  return createInitialData();
}

export function loadAppData() {
  try {
    const storedData =
      localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return createInitialData();
    }

    const parsedData = JSON.parse(storedData);

    if (
      !parsedData ||
      typeof parsedData !== "object"
    ) {
      return createInitialData();
    }

    if (
      parsedData.version !== STORAGE_VERSION
    ) {
      return migrateData(parsedData);
    }

    return normalizeData(parsedData);
  } catch (error) {
    console.error(
      "QuestMe: failed to load saved data.",
      error
    );

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
    console.error(
      "QuestMe: failed to save data.",
      error
    );
  }
}

export function clearAppData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error(
      "QuestMe: failed to clear saved data.",
      error
    );
  }
}
