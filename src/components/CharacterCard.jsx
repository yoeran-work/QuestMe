import "../character.css";

function CharacterCard({
  progress,
  xp,
  characterName
}) {
  return (
    <section className="character-card">
      <div className="character-info">
        <h2 className="character-name">
          {characterName ||
            "Unnamed Adventurer"}
        </h2>

        <p className="character-subtitle">
          QuestMe Character
        </p>

        <span className="level-label">
          LEVEL
        </span>

        <span className="level-number">
          {progress.level}
        </span>
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
            style={{
              width:
                `${progress.percentage}%`
            }}
          />
        </div>

        {progress.nextLevelXp !== null && (
          <p>
            {(
              progress.nextLevelXp - xp
            ).toLocaleString()}{" "}
            XP until level{" "}
            {progress.level + 1}
          </p>
        )}
      </div>
    </section>
  );
}

export default CharacterCard;
