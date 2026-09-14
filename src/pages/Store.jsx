import {
  useState
} from "react";

import RewardForm
  from "../components/RewardForm";

import {
  getStoreRewards,
  getArchivedRewards
} from "../utils/rewardInventory";

export default function Store({
  rewards = [],
  yBucks = 0,
  onAddReward,
  onBuyReward,
  onArchiveReward
}) {
  const [
    rewardFormOpen,
    setRewardFormOpen
  ] = useState(false);

  const storeRewards =
    getStoreRewards(rewards);

  const archivedRewards =
    getArchivedRewards(rewards);

  return (
    <div className="store-page">
      <section className="store-hero">
        <div>
          <p className="store-eyebrow">
            RPG Shop
          </p>

          <h1>Store</h1>

          <p>
            Verdien Y-bucks met quests
            en geef ze uit aan rewards
            die je echt wilt verdienen.
          </p>
        </div>

        <div className="store-wallet">
          <span>Y-bucks</span>

          <strong>
            {yBucks}
          </strong>
        </div>
      </section>

      <section className="store-section">
        <div className="store-section-header">
          <div>
            <h2>My Rewards</h2>

            <p>
              Jouw vaste beloningen.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setRewardFormOpen(true)
            }
          >
            + Add reward
          </button>
        </div>

        {storeRewards.length === 0 ? (
          <div className="store-empty">
            <div className="store-empty-icon">
              🎁
            </div>

            <h3>
              Nog geen rewards
            </h3>

            <p>
              Voeg je eerste beloning toe
              en maak iets leuks onderdeel
              van je QuestMe-economie.
            </p>
          </div>
        ) : (
          <div className="reward-grid">
            {storeRewards.map(
              (reward) => (
               <article
                    className={`reward-card ${
                    reward.status === "outOfStock"
                        ? "out-of-stock"
                        : ""
                    }`}
                    key={reward.id}
                >
                    {reward.status === "outOfStock" && (
                        <div className="sold-out-stamp">
                            UITVERKOCHT
                        </div>
            )}

                        <div className="reward-icon">
                            {reward.icon}
                        </div>
                  

                  <div className="reward-card-content">
                    <h3>
                      {reward.name}
                    </h3>

                    {reward.description && (
                      <p>
                        {reward.description}
                      </p>
                    )}

                    <div className="reward-card-meta">
                      <span>
                        {reward.price} Y
                      </span>

                      <span>
                        {reward.stockMode ===
                        "unlimited"
                          ? "Unlimited"
                          : `${reward.stock} left`}
                      </span>
                    </div>
                  </div>

                  <div className="reward-card-actions">
                    <button
                      type="button"
                      onClick={() =>
                        onBuyReward?.(
                          reward.id
                        )
                      }
                    >
                      Buy
                    </button>

                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() =>
                        onArchiveReward?.(
                          reward.id
                        )
                      }
                    >
                      Archive
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      <section className="store-section">
        <div className="store-section-header">
          <div>
            <h2>Specials</h2>

            <p>
              Tijdelijke drops en
              bijzondere aanbiedingen.
            </p>
          </div>
        </div>

        <div className="store-placeholder">
          <span>✨</span>

          <div>
            <strong>
              Specials komen hier
            </strong>

            <p>
              Deze laag koppelen we later
              aan loot, rarity en timers.
            </p>
          </div>
        </div>
      </section>

      <section className="store-section">
        <div className="store-section-header">
          <div>
            <h2>Boosters</h2>

            <p>
              Game-items die quests
              tijdelijk sterker maken.
            </p>
          </div>
        </div>

        <div className="store-placeholder">
          <span>⚡</span>

          <div>
            <strong>
              Booster shelf
            </strong>

            <p>
              Double XP, Double Y en
              Loot Boost komen later.
            </p>
          </div>
        </div>
      </section>

      <section className="store-section">
        <div className="store-section-header">
          <div>
            <h2>Archive</h2>

            <p>
              Oude rewards blijven
              bewaard voor historie.
            </p>
          </div>
        </div>

        {archivedRewards.length === 0 ? (
          <div className="store-placeholder">
            <span>📚</span>

            <div>
              <strong>
                Archive is leeg
              </strong>

              <p>
                Gearchiveerde rewards
                verschijnen hier.
              </p>
            </div>
          </div>
        ) : (
          <div className="reward-grid">
            {archivedRewards.map(
              (reward) => (
                <article
                  className="reward-card archived"
                  key={reward.id}
                >
                  <div className="reward-icon">
                    {reward.icon}
                  </div>

                  <div className="reward-card-content">
                    <h3>
                      {reward.name}
                    </h3>

                    <p>
                      {reward.status}
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
        {rewardFormOpen && (
  <RewardForm
    onSave={(reward) => {
      onAddReward?.(reward);

      setRewardFormOpen(false);
    }}
    onCancel={() => {
      setRewardFormOpen(false);
    }}
  />
)}
    </div>
  );
}