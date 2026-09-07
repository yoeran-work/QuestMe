import { useState } from "react";
import { getXpProgress } from "./utils/leveling";

const starterQuests = [
  {
    id: 1,
    title: "2 liter water drinken",
    xp: 50,
    y: 25
  },
  {
    id: 2,
    title: "Mijn stappen halen",
    xp: 75,
    y: 30
  },
  {
    id: 3,
    title: "Haargroeispray gebruiken",
    xp: 15,
    y: 5
  },
  {
    id: 4,
    title: "Naar de sportschool",
    xp: 150,
    y: 100
  },
  {
    id: 5,
    title: "Kamer opruimen",
    xp: 300,
    y: 250
  }
];

function App() {
  const [xp, setXp] = useState(0);
  const [yBucks, setYBucks] = useState(0);
  const [completedQuests, setCompletedQuests] = useState([]);

  const progress = getXpProgress(xp);

  function completeQuest(quest) {
    if (completedQuests.includes(quest.id)) {
      return;
    }

    setXp((currentXp) => currentXp + quest.xp);
    setYBucks((currentY) => currentY + quest.y);
    setCompletedQuests((current) => [...current, quest.id]);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>⚔️ QuestMe</h1>
          <p>Turn real life into an RPG.</p>
        </div>

        <div className="wallet">
          <span>🪙</span>
          <strong>{yBucks}</strong>
          <span>Y</span>
        </div>
      </header>

      <main>
        <section className="character-card">
          <div className="character-info">
            <span className="level-label">LEVEL</span>
            <span className="level-number">{progress.level}</span>
          </div>

          <div className="xp-info">
            <div className="xp-header">
              <span>XP</span>
              <span>
                {xp.toLocaleString()}{" "}
                {progress.nextLevelXp !== null &&
                  `/ ${progress.nextLevelXp.toLocaleString()}`}
              </span>
            </div>

            <div className="xp-bar">
              <div
                className="xp-fill"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>

            {progress.nextLevelXp !== null && (
              <p>
                {(
                  progress.nextLevelXp - xp
                ).toLocaleString()} XP until level {progress.level + 1}
              </p>
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <h2>⚔️ Quests</h2>
            <span>{completedQuests.length} completed</span>
          </div>

          <div className="quest-list">
            {starterQuests.map((quest) => {
              const completed = completedQuests.includes(quest.id);

              return (
                <div
                  className={`quest-card ${completed ? "completed" : ""}`}
                  key={quest.id}
                >
                  <div className="quest-content">
                    <h3>{quest.title}</h3>

                    <div className="quest-rewards">
                      <span>⭐ +{quest.xp} XP</span>
                      <span>🪙 +{quest.y} Y</span>
                    </div>
                  </div>

                  <button
                    onClick={() => completeQuest(quest)}
                    disabled={completed}
                  >
                    {completed ? "✓ Done" : "Complete"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="coming-soon">
          <div>
            <h2>🛒 Store</h2>
            <p>Coming soon...</p>
          </div>

          <div>
            <h2>🎒 Inventory</h2>
            <p>Coming soon...</p>
          </div>

          <div>
            <h2>📊 Statistics</h2>
            <p>Coming soon...</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
