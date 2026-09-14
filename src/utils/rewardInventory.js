export const STOCK_MODES = {
  UNLIMITED: "unlimited",
  LIMITED: "limited",
  RESTOCKING: "restocking"
};

export const REWARD_STATUSES = {
  ACTIVE: "active",
  ARCHIVED: "archived",
  OUT_OF_STOCK: "outOfStock"
};

function getNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

function getArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function normalizeReward(reward = {}) {
  const stockMode =
    Object.values(STOCK_MODES).includes(
      reward.stockMode
    )
      ? reward.stockMode
      : STOCK_MODES.UNLIMITED;

  const stock =
    stockMode === STOCK_MODES.UNLIMITED
      ? null
      : Math.max(
          0,
          getNumber(reward.stock, 0)
        );

  return {
    id:
      reward.id ||
      createId("reward"),

    name:
      typeof reward.name === "string"
        ? reward.name.trim()
        : "",

    description:
      typeof reward.description === "string"
        ? reward.description.trim()
        : "",

    icon:
      typeof reward.icon === "string"
        ? reward.icon
        : "🎁",

    price:
      Math.max(
        0,
        getNumber(reward.price, 0)
      ),

    stockMode,

    stock,

    restockRules:
      reward.restockRules || null,

    lootEligible:
      Boolean(reward.lootEligible),

    maxOwned:
      reward.maxOwned ?? null,

    status:
      Object.values(
        REWARD_STATUSES
      ).includes(reward.status)
        ? reward.status
        : REWARD_STATUSES.ACTIVE,

    createdAt:
      reward.createdAt ||
      new Date().toISOString()
  };
}

export function getActiveRewards(rewards) {
  return getArray(rewards)
    .map(normalizeReward)
    .filter(
      (reward) =>
        reward.status ===
        REWARD_STATUSES.ACTIVE
    );
}

export function getStoreRewards(rewards) {
  return getArray(rewards)
    .map(normalizeReward)
    .filter(
      (reward) =>
        reward.status ===
          REWARD_STATUSES.ACTIVE ||
        reward.status ===
          REWARD_STATUSES.OUT_OF_STOCK
    );
}

export function getArchivedRewards(rewards) {
  return getArray(rewards)
    .map(normalizeReward)
    .filter(
      (reward) =>
        reward.status ===
        REWARD_STATUSES.ARCHIVED
    );
}

export function canBuyReward(
  reward,
  yBucks
) {
  const normalizedReward =
    normalizeReward(reward);

  if (
    normalizedReward.status !==
    REWARD_STATUSES.ACTIVE
  ) {
    return {
      allowed: false,
      reason: "Reward is not active."
    };
  }

  if (
    normalizedReward.price >
    getNumber(yBucks)
  ) {
    return {
      allowed: false,
      reason: "Not enough Y-bucks."
    };
  }

  if (
    normalizedReward.stockMode !==
      STOCK_MODES.UNLIMITED &&
    normalizedReward.stock <= 0
  ) {
    return {
      allowed: false,
      reason: "Reward is out of stock."
    };
  }

  return {
    allowed: true,
    reason: null
  };
}

export function createPurchase(
  reward,
  quantity = 1
) {
  const normalizedReward =
    normalizeReward(reward);

  const safeQuantity =
    Math.max(
      1,
      Math.floor(
        getNumber(quantity, 1)
      )
    );

  return {
    id:
      createId("purchase"),

    rewardId:
      normalizedReward.id,

    rewardName:
      normalizedReward.name,

    quantity:
      safeQuantity,

    unitPricePaid:
      normalizedReward.price,

    totalPrice:
      normalizedReward.price *
      safeQuantity,

    purchasedAt:
      new Date().toISOString()
  };
}

export function createInventoryAcquisition({
  itemId,
  itemName = "",
  quantity = 1,
  source = "purchase",
  unitPricePaid = 0,
  expiresAt = null,
  originalRarity = null,
  sellable = true,
  rerollable = false
}) {
  return {
    id:
      createId("acq"),

    itemId:
      String(itemId),

    itemName:
      typeof itemName === "string"
        ? itemName
        : "",

    quantity:
      Math.max(
        1,
        Math.floor(
          getNumber(quantity, 1)
        )
      ),

    source,

    unitPricePaid:
      Math.max(
        0,
        getNumber(
          unitPricePaid,
          0
        )
      ),

    acquiredAt:
      new Date().toISOString(),

    expiresAt,

    originalRarity,

    rerollCount: 0,

    sellable:
      Boolean(sellable),

    rerollable:
      Boolean(rerollable)
  };
}

export function reduceRewardStock(
  reward,
  quantity = 1
) {
  const normalizedReward =
    normalizeReward(reward);

  if (
    normalizedReward.stockMode ===
    STOCK_MODES.UNLIMITED
  ) {
    return normalizedReward;
  }

  const safeQuantity =
    Math.max(
      1,
      Math.floor(
        getNumber(quantity, 1)
      )
    );

  const newStock =
    Math.max(
      0,
      normalizedReward.stock -
        safeQuantity
    );

  return {
    ...normalizedReward,

    stock:
      newStock,

    status:
      newStock === 0
        ? REWARD_STATUSES.OUT_OF_STOCK
        : normalizedReward.status
  };
}

export function archiveReward(reward) {
  return {
    ...normalizeReward(reward),

    status:
      REWARD_STATUSES.ARCHIVED
  };
}

export function restoreReward(reward) {
  const normalizedReward =
    normalizeReward(reward);

  return {
    ...normalizedReward,

    status:
      normalizedReward.stockMode !==
        STOCK_MODES.UNLIMITED &&
      normalizedReward.stock <= 0
        ? REWARD_STATUSES.OUT_OF_STOCK
        : REWARD_STATUSES.ACTIVE
  };
}