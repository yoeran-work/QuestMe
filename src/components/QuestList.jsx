import QuestCard from "./QuestCard";

function QuestList({
  quests,
  completedQuests,
  onComplete,
  onEdit,
  onDelete
}) {
  if (quests.length === 0) {
    return (
      <div className="empty-quest-state">
        <span>⚔️</span>
        <h3>No quests yet</h3>
        <p>
          Maak hierboven je eerste quest en begin je
          adventure.
        </p>
      </div>
    );
  }

  return (
    <div className="quest-list">
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          completed={completedQuests.includes(
            quest.id
          )}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default QuestList;
