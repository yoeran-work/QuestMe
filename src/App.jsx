import { useState } from "react";
import { getXpProgress } from "./utils/leveling";
import starterQuests from "./data/starterQuests";
import QuestList from "./components/QuestList";
import CharacterCard from "./components/CharacterCard";
import Wallet from "./components/Wallet";

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

        <Wallet yBucks={yBucks} />
      </header>

      <main>
        <CharacterCard
          progress={progress}
          xp={xp}
        />

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
