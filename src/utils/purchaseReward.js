import {
  canBuyReward,
  createPurchase,
  createInventoryAcquisition,
  reduceRewardStock
} from "./rewardInventory";

export function purchaseReward(
  appData,
  rewardId,
  quantity = 1
) {
  const reward = appData.rewards.find(
    (item) => item.id === rewardId
  );

  if (!reward) {
    return {
      success: false,
      reason: "not-found",
      data: appData
    };
  }

  const safeQuantity =
    Math.max(
      1,
      Math.floor(Number(quantity) || 1)
    );

  const totalPrice =
    reward.price * safeQuantity;

  const purchaseCheck =
    canBuyReward(
      {
        ...reward,
        price: totalPrice
      },
      appData.profile.yBucks
    );

  if (!purchaseCheck.allowed) {
    return {
      success: false,
      reason:
        purchaseCheck.reason ===
        "Not enough Y-bucks."
          ? "not-enough-y"
          : "unavailable",
      data: appData,
      reward,
      missingY:
        Math.max(
          0,
          totalPrice -
            appData.profile.yBucks
        )
    };
  }

  if (
    reward.stockMode !== "unlimited" &&
    reward.stock < safeQuantity
  ) {
    return {
      success: false,
      reason: "out-of-stock",
      data: appData,
      reward
    };
  }

  const purchase =
    createPurchase(
      reward,
      safeQuantity
    );

  const acquisition =
    createInventoryAcquisition({
      itemId: reward.id,
      itemName: reward.name,
      quantity: safeQuantity,
      source: "purchase",
      unitPricePaid: reward.price,
      sellable: true,
      rerollable: false
    });

  const updatedRewards =
    appData.rewards.map(
      (item) =>
        item.id === reward.id
          ? reduceRewardStock(
              item,
              safeQuantity
            )
          : item
    );

  return {
    success: true,

    reason: null,

    reward,

    purchase,

    acquisition,

    data: {
      ...appData,

      profile: {
        ...appData.profile,
        yBucks:
          appData.profile.yBucks -
          totalPrice
      },

      rewards:
        updatedRewards,

      inventory: [
        ...appData.inventory,
        acquisition
      ],

      purchases: [
        ...appData.purchases,
        purchase
      ]
    }
  };
}