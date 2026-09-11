import { formatQuestType } from "../utils/questSchedule";

function QuestCard({
  quest,
  completed,
  onComplete,
  onEdit,
  onDelete
}) {
  return (
    <div
      className={`quest-card ${
        completed ? "completed" : ""
      }`}
    >
      <div className="quest-content">
        <div className="quest-title-row">
          <h3>{quest.title}</h3>

          <span className="quest-type-badge">
            {formatQuestType(quest.type)}
          </span>
        </div>

        <div className="quest-rewards">
          <span>⭐ +{quest.xp} XP</span>
          <span>🪙 +{quest.y} Y</span>
        </div>
      </div>

      <div className="quest-actions">
        <button
          type="button"
          className="quest-action-button"
          onClick={() => onEdit(quest)}
          title="Quest bewerken"
          aria-label={`Edit ${quest.title}`}
        >
          ✏️
        </button>

        <button
          type="button"
          className="quest-action-button quest-delete-button"
          onClick={() => onDelete(quest)}
          title="Quest verwijderen"
          aria-label={`Delete ${quest.title}`}
        >
          🗑️
        </button>

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
