function sum(items, key) {
  return (Array.isArray(items) ? items : []).reduce(
    (total, item) => total + (Number(item?.[key]) || 0),
    0
  );
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "short"
  }).format(new Date(value));
}

export default function Stats({ appData }) {
  const questCompletions = appData.questCompletions || [];
  const purchases = appData.purchases || [];
  const consumptions = appData.consumptions || [];
  const sales = appData.sales || [];

  const totalXpEarned = sum(questCompletions, "xpEarned");
  const totalYEarned = sum(questCompletions, "yEarned");
  const totalYSpent = sum(purchases, "totalPrice");
  const totalYRefunded = sum(sales, "refund");

  const recentActivity = [
    ...questCompletions.map((item) => ({
      id: item.id,
      at: item.completedAt,
      icon: "⚔️",
      title: item.questTitle || "Quest completed",
      detail: `+${item.xpEarned || 0} XP · +${item.yEarned || 0} Y`
    })),
    ...purchases.map((item) => ({
      id: item.id,
      at: item.purchasedAt,
      icon: "🛒",
      title: item.rewardName || "Reward purchased",
      detail: `-${item.totalPrice || 0} Y`
    })),
    ...consumptions.map((item) => ({
      id: item.id,
      at: item.consumedAt,
      icon: "🎁",
      title: item.itemName || "Reward consumed",
      detail: "Consumed"
    })),
    ...sales.map((item) => ({
      id: item.id,
      at: item.soldAt,
      icon: "🪙",
      title: item.itemName || "Reward sold",
      detail: `+${item.refund || 0} Y`
    }))
  ]
    .filter((item) => item.at)
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 8);

  return (
    <div className="stats-page">
      <section className="stats-hero">
        <div>
          <p className="store-eyebrow">Adventure log</p>
          <h1>Stats</h1>
          <p>
            Alles wat je in QuestMe verdient, koopt en gebruikt
            begint hier een verhaal te vormen.
          </p>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stats-card">
          <span>⚔️ Quests completed</span>
          <strong>{questCompletions.length}</strong>
        </article>

        <article className="stats-card">
          <span>✨ XP earned</span>
          <strong>{totalXpEarned}</strong>
        </article>

        <article className="stats-card">
          <span>🪙 Y earned</span>
          <strong>{totalYEarned}</strong>
        </article>

        <article className="stats-card">
          <span>🛒 Y spent</span>
          <strong>{totalYSpent}</strong>
        </article>

        <article className="stats-card">
          <span>🎒 Rewards purchased</span>
          <strong>
            {purchases.reduce(
              (total, item) => total + (Number(item.quantity) || 0),
              0
            )}
          </strong>
        </article>

        <article className="stats-card">
          <span>🔥 Rewards consumed</span>
          <strong>{consumptions.length}</strong>
        </article>

        <article className="stats-card">
          <span>↩️ Rewards sold</span>
          <strong>
            {sales.reduce(
              (total, item) => total + (Number(item.quantity) || 0),
              0
            )}
          </strong>
        </article>

        <article className="stats-card">
          <span>💰 Y recovered</span>
          <strong>{totalYRefunded}</strong>
        </article>
      </section>

      <section className="stats-section">
        <div className="stats-section-heading">
          <div>
            <p className="store-eyebrow">Chronicle</p>
            <h2>Recent activity</h2>
          </div>
        </div>

        {recentActivity.length === 0 ? (
          <div className="stats-empty">
            <span>📜</span>
            <div>
              <strong>Your adventure log is empty</strong>
              <p>
                Complete a quest and your first entry appears here.
              </p>
            </div>
          </div>
        ) : (
          <div className="activity-list">
            {recentActivity.map((item) => (
              <article className="activity-row" key={item.id}>
                <div className="activity-icon">{item.icon}</div>
                <div className="activity-copy">
                  <strong>{item.title}</strong>
                  <span>{formatDate(item.at)}</span>
                </div>
                <div className="activity-detail">{item.detail}</div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
