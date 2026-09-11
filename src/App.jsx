import { useEffect, useState } from "react";
import { getXpProgress } from "./utils/leveling";
import {
  loadAppData,
  saveAppData
} from "./utils/storage";
import starterQuests from "./data/starterQuests";
import QuestList from "./components/QuestList";
import QuestForm from "./components/QuestForm";
import CharacterCard from "./components/CharacterCard";
import Wallet from "./components/Wallet";

function getTodayKey() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function App() {
  const [appData, setAppData] = useState(() => {
    const savedData = loadAppData();

    if (savedData.quests.length === 0) {
      return {
        ...savedData,
        quests: starterQuests
      };
    }

    return savedData;
  });

  const [editingQuest, setEditingQuest] = useState(null);

  const { profile, quests, questCompletions } = appData;

  const xp = profile.totalXp;
  const yBucks = profile.yBucks;

  const progress = getXpProgress(xp);

  const today = getTodayKey();

  const completedTodayIds = questCompletions
    .filter((completion) => completion.completedDate === today)
    .map((completion) => completion.questId);

  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  function completeQuest(quest) {
    if (completedTodayIds.includes(quest.id)) {
      return;
    }

    const completion = {
      id: crypto.randomUUID(),
      questId: quest.id,
      completedAt: new Date().toISOString(),
      completedDate: today,
      xpEarned: quest.xp,
      yEarned: quest.y
    };

    setAppData((currentData) => ({
      ...currentData,

      profile: {
        ...currentData.profile,
        totalXp: currentData.profile.totalXp + quest.xp,
        yBucks: currentData.profile.yBucks + quest.y
      },

      questCompletions: [
        ...currentData.questCompletions,
        completion
      ]
    }));
  }

  function addQuest(newQuest) {
    setAppData((currentData) => ({
      ...currentData,
      quests: [
        ...currentData.quests,
        newQuest
      ]
    }));
  }

  function editQuest(quest) {
    setEditingQuest(quest);
  }

  function saveEditedQuest(updatedQuest) {
    setAppData((currentData) => ({
      ...currentData,

      quests: currentData.quests.map((quest) =>
        quest.id === updatedQuest.id
          ? updatedQuest
          : quest
      )
    }));

    setEditingQuest(null);
  }

  function cancelEdit() {
    setEditingQuest(null);
  }

  function deleteQuest(quest) {
    const shouldDelete = window.confirm(
      `Weet je zeker dat je "${quest.title}" wilt verwijderen?`
    );

    if (!shouldDelete) {
      return;
    }

    setAppData((currentData) => ({
      ...currentData,

      quests: currentData.quests.filter(
        (currentQuest) => currentQuest.id !== quest.id
      )
    }));

    if (editingQuest?.id === quest.id) {
      setEditingQuest(null);
    }
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

            <span>
              {completedTodayIds.length}/{quests.length} completed
            </span>
          </div>

          <QuestForm
            onAddQuest={addQuest}
            editingQuest={editingQuest}
            onSaveEdit={saveEditedQuest}
            onCancelEdit={cancelEdit}
          />

          <QuestList
            quests={quests}
            completedQuests={completedTodayIds}
            onComplete={completeQuest}
            onEdit={editQuest}
            onDelete={deleteQuest}
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
