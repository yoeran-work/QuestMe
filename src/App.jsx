import { useState } from "react";
import { getXpProgress } from "./utils/leveling";
import starterQuests from "./data/starterQuests";
import QuestList from "./components/QuestList";

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
                {(progress.nextLevelXp - xp).toLocaleString()} XP until level{" "}
                {progress.level + 1}
              </p>
            )}
          </div>
        </section>

        <section className="section">
          <div className="section-heading">
            <h2>⚔️ Quests</h2>
            <span>{completedQuests.length} completed</span>
          </div>

          <QuestList
            quests={starterQuests}
            completedQuests={completedQuests}
            onComplete={completeQuest}
          />
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
