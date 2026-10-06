import {
  createInventoryAcquisition,
  normalizeReward
} from "./rewardInventory";

export const LOOT_RARITIES = {
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic"
};

const RARITY_ORDER = [
  LOOT_RARITIES.COMMON,
  LOOT_RARITIES.UNCOMMON,
  LOOT_RARITIES.RARE,
  LOOT_RARITIES.EPIC
];

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getQuestWeight(quest = {}) {
  const xp = Math.max(0, Number(quest.xp) || 0);
  const y = Math.max(0, Number(quest.y) || 0);

  return clamp(
    (xp / 300) + (y / 250),
    0,
    1.5
  );
}

function getDropChance(quest, pity) {
  const baseChance = 0.08;
  const questBonus = getQuestWeight(quest) * 0.08;
  const pityBonus = clamp(pity, 0, 8) * 0.025;

  return clamp(
    baseChance + questBonus + pityBonus,
    0.08,
    0.42
  );
}

function rollRarity(quest, pity) {
  const roll = Math.random();
  const qualityBonus =
    clamp(
      getQuestWeight(quest) * 0.04 +
        Math.max(0, pity - 3) * 0.01,
      0,
      0.12
    );

  if (roll < 0.02 + qualityBonus * 0.25) {
    return LOOT_RARITIES.EPIC;
  }

  if (roll < 0.12 + qualityBonus) {
    return LOOT_RARITIES.RARE;
  }

  if (roll < 0.38 + qualityBonus) {
    return LOOT_RARITIES.UNCOMMON;
  }

  return LOOT_RARITIES.COMMON;
}

function getRewardRarity(reward) {
  const price = Math.max(0, Number(reward.price) || 0);

  if (price >= 1500) {
    return LOOT_RARITIES.EPIC;
  }

  if (price >= 750) {
    return LOOT_RARITIES.RARE;
  }

  if (price >= 300) {
    return LOOT_RARITIES.UNCOMMON;
  }

  return LOOT_RARITIES.COMMON;
}

function pickReward(rewards, rolledRarity) {
  const eligible = rewards
    .map(normalizeReward)
    .filter((reward) =>
      reward.lootEligible &&
      reward.status !== "archived"
    );

  if (eligible.length === 0) {
    return null;
  }

  const maxIndex =
    RARITY_ORDER.indexOf(rolledRarity);

  const candidates = eligible.filter((reward) =>
    RARITY_ORDER.indexOf(
      getRewardRarity(reward)
    ) <= maxIndex
  );

  const pool =
    candidates.length > 0
      ? candidates
      : eligible;

  return pool[
    Math.floor(Math.random() * pool.length)
  ];
}

export function tryQuestLootDrop({
  quest,
  rewards = [],
  lootState = {}
}) {
  const pity =
    Math.max(
      0,
      Number(lootState.pity) || 0
    );

  const chance =
    getDropChance(quest, pity);

  const guaranteed =
    pity >= 8;

  const dropped =
    guaranteed ||
    Math.random() < chance;

  if (!dropped) {
    return {
      dropped: false,
      lootState: {
        ...lootState,
        pity: pity + 1
      }
    };
  }

  const rolledRarity =
    rollRarity(quest, pity);

  const reward =
    pickReward(
      rewards,
      rolledRarity
    );

  if (!reward) {
    return {
      dropped: false,
      lootState: {
        ...lootState,
        pity: pity + 1
      }
    };
  }

  const rarity =
    getRewardRarity(reward);

  const acquisition =
    createInventoryAcquisition({
      itemId: reward.id,
      itemName: reward.name,
      quantity: 1,
      source: "loot",
      unitPricePaid: 0,
      originalRarity: rarity,
      sellable: false,
      rerollable: true
    });

  const lootEvent = {
    id: createId("loot"),
    questId: quest.id,
    questTitle: quest.title,
    itemId: reward.id,
    itemName: reward.name,
    rarity,
    droppedAt: new Date().toISOString()
  };

  return {
    dropped: true,
    reward,
    rarity,
    acquisition,
    lootEvent,
    lootState: {
      ...lootState,
      pity: 0
    }
  };
}

export function getRarityLabel(rarity) {
  switch (rarity) {
    case LOOT_RARITIES.EPIC:
      return "EPIC";
    case LOOT_RARITIES.RARE:
      return "RARE";
    case LOOT_RARITIES.UNCOMMON:
      return "UNCOMMON";
    default:
      return "COMMON";
  }
}
