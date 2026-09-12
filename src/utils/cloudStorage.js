const STORAGE_KEY = "questme-data";
const STORAGE_VERSION = 4;

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

    inventory: [],

    purchases: [],

    consumptions: [],

    sales: [],

    specials: [],

    lootEvents: [],

    lootState: {
      pity: 0
    },

    // Tijdelijk behouden voor backwards compatibility.
    // Oude v3-data mag niet stilletjes verdwijnen.
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

    inventory: Array.isArray(data.inventory)
      ? data.inventory
      : [],

    purchases: Array.isArray(data.purchases)
      ? data.purchases
      : [],

    consumptions: Array.isArray(
      data.consumptions
    )
      ? data.consumptions
      : [],

    sales: Array.isArray(data.sales)
      ? data.sales
      : [],

    specials: Array.isArray(data.specials)
      ? data.specials
      : [],

    lootEvents: Array.isArray(data.lootEvents)
      ? data.lootEvents
      : [],

    lootState: {
      ...initialData.lootState,
      ...(data.lootState || {})
    },

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
    oldData.version === 3 ||
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

    const parsedData =
      JSON.parse(storedData);

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
