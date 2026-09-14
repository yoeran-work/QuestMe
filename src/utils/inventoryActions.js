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