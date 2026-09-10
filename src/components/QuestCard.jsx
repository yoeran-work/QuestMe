function QuestCard({
  quest,
  completed,
  onComplete,
  onEdit,
  onDelete
}) {
  return (
    <div className={`quest-card ${completed ? "completed" : ""}`}>
      <div className="quest-content">
        <h3>{quest.title}</h3>

        <div className="quest-rewards">
          <span>⭐ +{quest.xp} XP</span>
          <span>🪙 +{quest.y} Y</span>
        </div>
      </div>

      <div className="quest-actions">
        {onEdit && (
          <button
            type="button"
            className="quest-action-button"
            onClick={() => onEdit(quest)}
            title="Quest bewerken"
          >
            ✏️
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            className="quest-action-button delete"
            onClick={() => onDelete(quest)}
            title="Quest verwijderen"
          >
            🗑️
          </button>
        )}

        <button
          type="button"
          className="complete-button"
          onClick={() => onComplete(quest)}
          disabled={completed}
        >
          {completed ? "✓ Done" : "Complete"}
        </button>
      </div>
    </div>
  );
}

export default QuestCard;
