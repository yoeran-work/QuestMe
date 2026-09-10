import QuestCard from "./QuestCard";

function QuestList({
  quests,
  completedQuests,
  onComplete,
  onEdit,
  onDelete
}) {
  return (
    <div className="quest-list">
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          completed={completedQuests.includes(quest.id)}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default QuestList;
