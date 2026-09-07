import QuestCard from "./QuestCard";

function QuestList({ quests, completedQuests, onComplete }) {
  return (
    <div className="quest-list">
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          completed={completedQuests.includes(quest.id)}
          onComplete={onComplete}
        />
      ))}
    </div>
  );
}

export default QuestList;
