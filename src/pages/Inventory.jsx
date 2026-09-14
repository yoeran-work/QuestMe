import {
  getInventoryQuantity,
  getInventoryLots
} from "../utils/inventoryActions";

export default function Inventory({
  inventory = [],
  rewards = [],
    onConsume,
    onSell
}) {
  const itemIds = [
    ...new Set(
      inventory.map(
        (item) => item.itemId
      )
    )
  ];

  const inventoryItems =
    itemIds
      .map((itemId) => {
        const lots =
          getInventoryLots(
            inventory,
            itemId
          );

        if (lots.length === 0) {
          return null;
        }

        const firstLot =
          lots[0];

        const reward =
          rewards.find(
            (item) =>
              item.id === itemId
          );

        return {
          itemId,

          name:
            reward?.name ||
            firstLot.itemName ||
            "Unknown reward",

          icon:
            reward?.icon ||
            "🎁",

          description:
            reward?.description ||
            "",

          quantity:
            getInventoryQuantity(
              inventory,
              itemId
            ),

          lots
        };
      })
      .filter(Boolean);

  return (
    <div className="inventory-page">
      <section className="inventory-hero">
        <div>
          <p className="store-eyebrow">
            Backpack
          </p>

          <h1>
            Inventory
          </h1>

          <p>
            Hier vind je rewards
            die je hebt gekocht
            of later als loot hebt
            ontvangen.
          </p>
        </div>

        <div className="inventory-count">
          <span>
            Items
          </span>

          <strong>
            {inventoryItems.reduce(
              (
                total,
                item
              ) =>
                total +
                item.quantity,
              0
            )}
          </strong>
        </div>
      </section>

      {inventoryItems.length === 0 ? (
        <section className="inventory-empty">
          <div className="inventory-empty-icon">
            🎒
          </div>

          <h2>
            Je inventory is leeg
          </h2>

          <p>
            Koop een reward in de Store
            of ontvang later loot
            tijdens quests.
          </p>
        </section>
      ) : (
        <section className="inventory-grid">
          {inventoryItems.map(
            (item) => (
              <article
                className="inventory-card"
                key={item.itemId}
              >
                <div className="inventory-card-top">
                  <div className="inventory-icon">
                    {item.icon}
                  </div>

                  <div className="inventory-quantity">
                    ×{item.quantity}
                  </div>
                </div>

                <div className="inventory-card-content">
                  <h2>
                    {item.name}
                  </h2>

                  {item.description && (
                    <p>
                      {item.description}
                    </p>
                  )}
                </div>

               <div className="inventory-card-meta">
                    <span>
                        {item.lots[0]?.source === "purchase"
                            ? "🛒 Purchased"
                            : item.lots[0]?.source === "loot"
                                ? "✨ Rare Drop"
                                : item.lots[0]?.source === "special"
                                    ? "⭐ Special"
                                    : "🎁 Reward"}
                    </span>

  <span>
    {item.lots[0]?.unitPricePaid > 0
      ? `${item.lots[0].unitPricePaid} Y value`
      : "Free"}
  </span>
</div>

                <div className="inventory-card-actions">
                 <button
                    type="button"
                    onClick={() =>
                        onConsume?.(
                            item.lots[0].id
                        )
                    }
                  >
                    Consume
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                        onSell?.(
                            item.lots[0].id,
                            1
                        )
                    }
                  >
                    Sell  
                </button>
                </div>
              </article>
            )
          )}
        </section>
      )}
    </div>
  );
}