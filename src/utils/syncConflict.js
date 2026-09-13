import starterQuests from "../data/starterQuests";

function getArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

function getNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function getCharacterName(data) {
  return typeof data?.profile?.characterName === "string"
    ? data.profile.characterName.trim()
    : "";
}

function getLootState(data) {
  return {
    pity:
      getNumber(
        data?.lootState?.pity
      )
  };
}

function getComparableSave(data) {
  return {
    version: data?.version ?? 4,

    meta: {
      starterQuestsSeeded:
        Boolean(
          data?.meta?.starterQuestsSeeded
        )
    },

    profile: {
      characterName:
        getCharacterName(data),

      totalXp:
        getNumber(
          data?.profile?.totalXp
        ),

      yBucks:
        getNumber(
          data?.profile?.yBucks
        )
    },

    quests:
      getArray(data?.quests),

    questCompletions:
      getArray(
        data?.questCompletions
      ),

    rewards:
      getArray(data?.rewards),

    inventory:
      getArray(data?.inventory),

    purchases:
      getArray(data?.purchases),

    consumptions:
      getArray(
        data?.consumptions
      ),

    sales:
      getArray(data?.sales),

    specials:
      getArray(data?.specials),

    lootEvents:
      getArray(
        data?.lootEvents
      ),

    lootState:
      getLootState(data),

    /*
     * Tijdelijk behouden zolang oude v3-data
     * nog kan bestaan.
     */
    consumedRewards:
      getArray(
        data?.consumedRewards
      )
  };
}

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(
      stableValue
    );
  }

  if (
    value &&
    typeof value === "object"
  ) {
    return Object.keys(value)
      .sort()
      .reduce(
        (result, key) => {
          result[key] =
            stableValue(
              value[key]
            );

          return result;
        },
        {}
      );
  }

  return value;
}

function stableStringify(value) {
  return JSON.stringify(
    stableValue(value)
  );
}

function getQuestSignature(
  quests
) {
  return getArray(quests).map(
    (quest) => ({
      id:
        String(quest.id),

      title:
        quest.title || "",

      xp:
        getNumber(quest.xp),

      y:
        getNumber(quest.y),

      type:
        quest.type || "daily"
    })
  );
}

function hasStarterQuestSet(
  quests
) {
  return (
    stableStringify(
      getQuestSignature(quests)
    ) ===
    stableStringify(
      getQuestSignature(
        starterQuests
      )
    )
  );
}

export function areSavesEquivalent(
  localData,
  cloudData
) {
  return (
    stableStringify(
      getComparableSave(
        localData
      )
    ) ===
    stableStringify(
      getComparableSave(
        cloudData
      )
    )
  );
}

export function hasMeaningfulLocalProgress(
  data
) {
  if (!data) {
    return false;
  }

  /*
   * Zodra de gebruiker bewust een character
   * heeft aangemaakt, behandelen we deze
   * installatie als een echte lokale save.
   *
   * Daardoor mag een bestaande cloudsave
   * deze character nooit automatisch vervangen.
   */
  if (
    getCharacterName(data)
  ) {
    return true;
  }

  const profile =
    data.profile || {};

  if (
    getNumber(
      profile.totalXp
    ) > 0 ||
    getNumber(
      profile.yBucks
    ) > 0
  ) {
    return true;
  }

  if (
    getArray(
      data.questCompletions
    ).length > 0 ||
    getArray(
      data.rewards
    ).length > 0 ||
    getArray(
      data.inventory
    ).length > 0 ||
    getArray(
      data.purchases
    ).length > 0 ||
    getArray(
      data.consumptions
    ).length > 0 ||
    getArray(
      data.sales
    ).length > 0 ||
    getArray(
      data.specials
    ).length > 0 ||
    getArray(
      data.lootEvents
    ).length > 0 ||
    getArray(
      data.consumedRewards
    ).length > 0
  ) {
    return true;
  }

  if (
    getNumber(
      data?.lootState?.pity
    ) > 0
  ) {
    return true;
  }

  const quests =
    getArray(data.quests);

  if (
    !hasStarterQuestSet(
      quests
    )
  ) {
    return true;
  }

  return false;
}

export function getSaveSummary(
  data
) {
  return {
    characterName:
      getCharacterName(data) ||
      "Adventurer",

    totalXp:
      getNumber(
        data?.profile?.totalXp
      ),

    yBucks:
      getNumber(
        data?.profile?.yBucks
      ),

    quests:
      getArray(
        data?.quests
      ).length,

    completions:
      getArray(
        data?.questCompletions
      ).length,

    inventoryItems:
      getArray(
        data?.inventory
      ).length,

    rewards:
      getArray(
        data?.rewards
      ).length
  };
}