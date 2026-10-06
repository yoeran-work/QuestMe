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

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function getInventoryQuantity(
  inventory,
  itemId
) {
  return getArray(inventory)
    .filter(
      (acquisition) =>
        acquisition.itemId === itemId
    )
    .reduce(
      (total, acquisition) =>
        total +
        Math.max(
          0,
          getNumber(
            acquisition.quantity
          )
        ),
      0
    );
}

export function getInventoryLots(
  inventory,
  itemId
) {
  return getArray(inventory)
    .filter(
      (acquisition) =>
        acquisition.itemId === itemId &&
        getNumber(
          acquisition.quantity
        ) > 0
    );
}

export function consumeInventoryItem(
  inventory,
  acquisitionId
) {
  const currentInventory =
    getArray(inventory);

  const acquisition =
    currentInventory.find(
      (item) =>
        item.id === acquisitionId
    );

  if (
    !acquisition ||
    getNumber(
      acquisition.quantity
    ) <= 0
  ) {
    return {
      success: false,
      inventory: currentInventory,
      consumption: null
    };
  }

  const newQuantity =
    getNumber(
      acquisition.quantity
    ) - 1;

  const updatedInventory =
    newQuantity > 0
      ? currentInventory.map(
          (item) =>
            item.id === acquisitionId
              ? {
                  ...item,
                  quantity:
                    newQuantity
                }
              : item
        )
      : currentInventory.filter(
          (item) =>
            item.id !== acquisitionId
        );

  const consumption = {
    id:
      createId("consumption"),

    itemId:
      acquisition.itemId,

    itemName:
      acquisition.itemName || "",

    acquisitionId:
      acquisition.id,

    source:
      acquisition.source || "unknown",

    consumedAt:
      new Date().toISOString()
  };

  return {
    success: true,
    inventory: updatedInventory,
    consumption
  };
}

export function sellInventoryItems(
  inventory,
  acquisitionId,
  quantity = 1,
  resaleRate = 1
) {
  const currentInventory =
    getArray(inventory);

  const acquisition =
    currentInventory.find(
      (item) =>
        item.id === acquisitionId
    );

  if (
    !acquisition ||
    acquisition.sellable === false
  ) {
    return {
      success: false,
      inventory: currentInventory,
      sale: null,
      refund: 0
    };
  }

  const availableQuantity =
    Math.max(
      0,
      Math.floor(
        getNumber(
          acquisition.quantity
        )
      )
    );

  const requestedQuantity =
    Math.max(
      1,
      Math.floor(
        getNumber(quantity)
      )
    );

  if (
    availableQuantity === 0 ||
    requestedQuantity >
      availableQuantity
  ) {
    return {
      success: false,
      inventory: currentInventory,
      sale: null,
      refund: 0
    };
  }

  const safeResaleRate =
    Math.max(
      0,
      getNumber(resaleRate)
    );

  const unitPricePaid =
    Math.max(
      0,
      getNumber(
        acquisition.unitPricePaid
      )
    );

  const refund =
    Math.round(
      unitPricePaid *
        requestedQuantity *
        safeResaleRate
    );

  const newQuantity =
    availableQuantity -
    requestedQuantity;

  const updatedInventory =
    newQuantity > 0
      ? currentInventory.map(
          (item) =>
            item.id === acquisitionId
              ? {
                  ...item,
                  quantity:
                    newQuantity
                }
              : item
        )
      : currentInventory.filter(
          (item) =>
            item.id !== acquisitionId
        );

  const sale = {
    id:
      createId("sale"),

    itemId:
      acquisition.itemId,

    itemName:
      acquisition.itemName || "",

    acquisitionId:
      acquisition.id,

    quantity:
      requestedQuantity,

    unitPricePaid,

    resaleRate:
      safeResaleRate,

    refund,

    soldAt:
      new Date().toISOString()
  };

  return {
    success: true,
    inventory: updatedInventory,
    sale,
    refund
  };
}

export function sellInventoryStack(
  inventory,
  itemId,
  quantity = 1,
  resaleRate = 1
) {
  const currentInventory = getArray(inventory);
  const requestedQuantity = Math.max(
    1,
    Math.floor(getNumber(quantity))
  );
  const safeResaleRate = Math.max(0, getNumber(resaleRate));

  const sellableLots = currentInventory
    .filter(
      (item) =>
        item.itemId === itemId &&
        item.sellable !== false &&
        getNumber(item.quantity) > 0 &&
        getNumber(item.unitPricePaid) > 0
    )
    .sort(
      (a, b) =>
        new Date(a.acquiredAt || 0) -
        new Date(b.acquiredAt || 0)
    );

  const availableQuantity = sellableLots.reduce(
    (total, item) =>
      total + Math.max(0, Math.floor(getNumber(item.quantity))),
    0
  );

  if (requestedQuantity > availableQuantity) {
    return {
      success: false,
      inventory: currentInventory,
      sales: [],
      refund: 0
    };
  }

  let remaining = requestedQuantity;
  let refund = 0;
  const soldByLot = new Map();
  const sales = [];

  for (const lot of sellableLots) {
    if (remaining <= 0) {
      break;
    }

    const lotQuantity = Math.max(
      0,
      Math.floor(getNumber(lot.quantity))
    );
    const soldQuantity = Math.min(lotQuantity, remaining);
    const unitPricePaid = Math.max(0, getNumber(lot.unitPricePaid));
    const lotRefund = Math.round(
      unitPricePaid * soldQuantity * safeResaleRate
    );

    soldByLot.set(lot.id, soldQuantity);
    refund += lotRefund;
    remaining -= soldQuantity;

    sales.push({
      id: createId("sale"),
      itemId: lot.itemId,
      itemName: lot.itemName || "",
      acquisitionId: lot.id,
      quantity: soldQuantity,
      unitPricePaid,
      resaleRate: safeResaleRate,
      refund: lotRefund,
      soldAt: new Date().toISOString()
    });
  }

  const updatedInventory = currentInventory
    .map((item) => {
      const soldQuantity = soldByLot.get(item.id) || 0;

      if (!soldQuantity) {
        return item;
      }

      return {
        ...item,
        quantity:
          Math.max(0, Math.floor(getNumber(item.quantity))) -
          soldQuantity
      };
    })
    .filter((item) => getNumber(item.quantity) > 0);

  return {
    success: true,
    inventory: updatedInventory,
    sales,
    refund
  };
}

export function getSellableInventorySummary(
  inventory,
  itemId,
  resaleRate = 1
) {
  const safeResaleRate = Math.max(0, getNumber(resaleRate));
  const lots = getInventoryLots(inventory, itemId).filter(
    (item) =>
      item.sellable !== false &&
      getNumber(item.unitPricePaid) > 0
  );

  return {
    quantity: lots.reduce(
      (total, item) =>
        total + Math.max(0, Math.floor(getNumber(item.quantity))),
      0
    ),
    maxRefund: lots.reduce(
      (total, item) =>
        total +
        Math.round(
          Math.max(0, getNumber(item.unitPricePaid)) *
          Math.max(0, Math.floor(getNumber(item.quantity))) *
          safeResaleRate
        ),
      0
    )
  };
}

export function getSellRefundForQuantity(
  inventory,
  itemId,
  quantity = 1,
  resaleRate = 1
) {
  const result = sellInventoryStack(
    inventory,
    itemId,
    quantity,
    resaleRate
  );

  return result.success ? result.refund : 0;
}
