function QuestCard({ quest, completed, onComplete }) {
  return (
    <div className={`quest-card ${completed ? "completed" : ""}`}>
      <div className="quest-content">
        <h3>{quest.title}</h3>

        <div className="quest-rewards">
          <span>⭐ +{quest.xp} XP</span>
          <span>🪙 +{quest.y} Y</span>
        </div>
      </div>

      <button
        onClick={() => onComplete(quest)}
        disabled={completed}
      >
        {completed ? "✓ Done" : "Complete"}
      </button>
    </div>
  );
}

export default QuestCard;
