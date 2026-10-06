import { useMemo, useState } from "react";

import {
  getInventoryQuantity,
  getInventoryLots,
  getSellableInventorySummary,
  getSellRefundForQuantity
} from "../utils/inventoryActions";

function getSourceLabel(lots) {
  const sources = new Set(lots.map((lot) => lot.source));

  if (sources.size > 1) {
    return "🎒 Mixed sources";
  }

  const source = lots[0]?.source;

  if (source === "purchase") return "🛒 Purchased";
  if (source === "loot") return "✨ Rare Drop";
  if (source === "special") return "⭐ Special";
  return "🎁 Reward";
}

export default function Inventory({
  inventory = [],
  rewards = [],
  onConsume,
  onSell
}) {
  const [sellItem, setSellItem] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(1);

  const inventoryItems = useMemo(() => {
    const itemIds = [
      ...new Set(inventory.map((item) => item.itemId))
    ];

    return itemIds
      .map((itemId) => {
        const lots = getInventoryLots(inventory, itemId);

        if (lots.length === 0) {
          return null;
        }

        const firstLot = lots[0];
        const reward = rewards.find((item) => item.id === itemId);
        const sellable = getSellableInventorySummary(
          inventory,
          itemId
        );

        return {
          itemId,
          name:
            reward?.name ||
            firstLot.itemName ||
            "Unknown reward",
          icon: reward?.icon || "🎁",
          description: reward?.description || "",
          quantity: getInventoryQuantity(inventory, itemId),
          lots,
          sellable
        };
      })
      .filter(Boolean);
  }, [inventory, rewards]);

  const selectedItem = sellItem
    ? inventoryItems.find((item) => item.itemId === sellItem)
    : null;

  const sellRefund = selectedItem
    ? getSellRefundForQuantity(
        inventory,
        selectedItem.itemId,
        sellQuantity
      )
    : 0;

  function openSell(item) {
    if (item.sellable.quantity <= 0) {
      return;
    }

    setSellItem(item.itemId);
    setSellQuantity(1);
  }

  function closeSell() {
    setSellItem(null);
    setSellQuantity(1);
  }

  function confirmSell() {
    if (!selectedItem) {
      return;
    }

    onSell?.(selectedItem.itemId, sellQuantity);
    closeSell();
  }

  return (
    <div className="inventory-page">
      <section className="inventory-hero">
        <div>
          <p className="store-eyebrow">Backpack</p>
          <h1>Inventory</h1>
          <p>
            Hier vind je rewards die je hebt gekocht
            of later als loot hebt ontvangen.
          </p>
        </div>

        <div className="inventory-count">
          <span>Items</span>
          <strong>
            {inventoryItems.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          </strong>
        </div>
      </section>

      {inventoryItems.length === 0 ? (
        <section className="inventory-empty">
          <div className="inventory-empty-icon">🎒</div>
          <h2>Je inventory is leeg</h2>
          <p>
            Koop een reward in de Store of ontvang later
            loot tijdens quests.
          </p>
        </section>
      ) : (
        <section className="inventory-grid">
          {inventoryItems.map((item) => (
            <article className="inventory-card" key={item.itemId}>
              <div className="inventory-card-top">
                <div className="inventory-icon">{item.icon}</div>
                <div className="inventory-quantity">
                  ×{item.quantity}
                </div>
              </div>

              <div className="inventory-card-content">
                <h2>{item.name}</h2>
                {item.description && <p>{item.description}</p>}
              </div>

              <div className="inventory-card-meta">
                <span>{getSourceLabel(item.lots)}</span>
                <span>
                  {item.sellable.quantity > 0
                    ? `${item.sellable.maxRefund} Y sell value`
                    : "Not sellable"}
                </span>
              </div>

              <div className="inventory-card-actions">
                <button
                  type="button"
                  onClick={() => onConsume?.(item.lots[0].id)}
                >
                  Consume
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  disabled={item.sellable.quantity <= 0}
                  onClick={() => openSell(item)}
                >
                  Sell
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {selectedItem && (
        <div
          className="inventory-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSell();
            }
          }}
        >
          <section
            className="inventory-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sell-reward-title"
          >
            <div className="inventory-modal-heading">
              <div>
                <p className="store-eyebrow">Merchant</p>
                <h2 id="sell-reward-title">
                  Sell {selectedItem.name}
                </h2>
              </div>

              <button
                type="button"
                className="inventory-modal-close"
                onClick={closeSell}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="sell-quantity-row">
              <button
                type="button"
                onClick={() =>
                  setSellQuantity((value) => Math.max(1, value - 1))
                }
                disabled={sellQuantity <= 1}
              >
                −
              </button>

              <strong>{sellQuantity}</strong>

              <button
                type="button"
                onClick={() =>
                  setSellQuantity((value) =>
                    Math.min(
                      selectedItem.sellable.quantity,
                      value + 1
                    )
                  )
                }
                disabled={
                  sellQuantity >= selectedItem.sellable.quantity
                }
              >
                +
              </button>
            </div>

            <div className="sell-summary">
              <span>Refund</span>
              <strong>{sellRefund} Y</strong>
            </div>

            <p className="sell-note">
              QuestMe verkoopt eerst je oudste betaalde exemplaren.
              Gratis loot blijft in je inventory.
            </p>

            <div className="inventory-modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={closeSell}
              >
                Cancel
              </button>
              <button type="button" onClick={confirmSell}>
                Sell ×{sellQuantity}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
