import {
  useState
} from "react";

import {
  normalizeReward,
  STOCK_MODES
} from "../utils/rewardInventory";

export default function RewardForm({
  onSave,
  onCancel
}) {
  const [
    name,
    setName
  ] = useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [
    icon,
    setIcon
  ] = useState("🎁");

  const [
    price,
    setPrice
  ] = useState("");

  const [
    stockMode,
    setStockMode
  ] = useState(
    STOCK_MODES.UNLIMITED
  );

  const [
    stock,
    setStock
  ] = useState("");

  const [
    lootEligible,
    setLootEligible
  ] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return;
    }

    const reward =
      normalizeReward({
        name:
          trimmedName,

        description:
          description.trim(),

        icon:
          icon.trim() || "🎁",

        price:
          Number(price),

        stockMode,

        stock:
          stockMode ===
          STOCK_MODES.UNLIMITED
            ? null
            : Number(stock),

        lootEligible
      });

    onSave(reward);
  }

  return (
    <div className="reward-form-backdrop">
      <div className="reward-form-panel">
        <div className="reward-form-heading">
          <div>
            <p className="store-eyebrow">
              New reward
            </p>

            <h2>
              Add to Store
            </h2>
          </div>

          <button
            type="button"
            className="reward-form-close"
            onClick={onCancel}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          className="reward-form"
          onSubmit={handleSubmit}
        >
          <label>
            Reward name

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Pizza night"
              autoFocus
              required
            />
          </label>

          <label>
            Description

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Optional description"
              rows="3"
            />
          </label>

          <div className="reward-form-row">
            <label>
              Icon

              <input
                type="text"
                value={icon}
                onChange={(event) =>
                  setIcon(
                    event.target.value
                  )
                }
                placeholder="🎁"
              />
            </label>

            <label>
              Price in Y

              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(event) =>
                  setPrice(
                    event.target.value
                  )
                }
                placeholder="500"
                required
              />
            </label>
          </div>

          <label>
            Stock type

            <select
              value={stockMode}
              onChange={(event) =>
                setStockMode(
                  event.target.value
                )
              }
            >
              <option
                value={
                  STOCK_MODES.UNLIMITED
                }
              >
                Unlimited
              </option>

              <option
                value={
                  STOCK_MODES.LIMITED
                }
              >
                Limited stock
              </option>

              <option
                value={
                  STOCK_MODES.RESTOCKING
                }
              >
                Restocking
              </option>
            </select>
          </label>

          {stockMode !==
            STOCK_MODES.UNLIMITED && (
            <label>
              Current stock

              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(event) =>
                  setStock(
                    event.target.value
                  )
                }
                placeholder="1"
                required
              />
            </label>
          )}

          <label className="reward-form-checkbox">
            <input
              type="checkbox"
              checked={
                lootEligible
              }
              onChange={(event) =>
                setLootEligible(
                  event.target.checked
                )
              }
            />

            <span>
              <strong>
                Can drop as loot
              </strong>

              <small>
                QuestMe mag deze reward
                later gebruiken als
                mogelijke Rare Drop.
              </small>
            </span>
          </label>

          <div className="reward-form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
            >
              Add reward
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}