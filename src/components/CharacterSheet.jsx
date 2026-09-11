import {
  useEffect,
  useState
} from "react";

import "../character-sheet.css";

function CharacterSheet({
  open,
  onClose,
  characterName,
  progress,
  xp,
  yBucks,
  quests,
  questCompletions,
  user,
  cloudState,
  onRename,
  onSignOut
}) {
  const [editingName, setEditingName] =
    useState(false);

  const [name, setName] =
    useState(characterName || "");

  useEffect(() => {
    setName(
      characterName || ""
    );
  }, [characterName]);

  useEffect(() => {
    if (!open) {
      setEditingName(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  function handleRename(
    event
  ) {
    event.preventDefault();

    const cleanName =
      name.trim().slice(0, 30);

    if (!cleanName) {
      return;
    }

    onRename(
      cleanName
    );

    setEditingName(
      false
    );
  }

  const cloudLabels = {
    idle: "Ready",
    checking: "Checking...",
    uploading: "Uploading...",
    downloading: "Loading...",
    conflict: "Action required",
    synced: "Synced",
    saving: "Saving...",
    error: "Error"
  };

  const fallbackLetter =
    characterName
      ?.charAt(0)
      ?.toUpperCase() || "?";

  return (
    <div
      className="character-sheet-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section className="character-sheet">
        <div className="character-sheet-header">
          <div>
            <h2>
              ⚔️ Character Sheet
            </h2>

            <p>
              Your QuestMe profile, progress
              and account.
            </p>
          </div>

          <button
            type="button"
            className="character-sheet-close"
            onClick={onClose}
            aria-label="Close character sheet"
          >
            ✕
          </button>
        </div>

        <div className="character-sheet-hero">
          <div className="character-sheet-avatar">
            {fallbackLetter}
          </div>

          <div className="character-sheet-identity">
            <h3 className="character-sheet-name">
              {characterName}
            </h3>

            <div className="character-sheet-level">
              Level {progress.level}
            </div>
          </div>

          <button
            type="button"
            className="character-sheet-edit"
            onClick={() =>
              setEditingName(
                (current) => !current
              )
            }
          >
            ✏️ Edit name
          </button>
        </div>

        {editingName && (
          <form
            className="character-sheet-name-form"
            onSubmit={handleRename}
          >
            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              maxLength="30"
              autoFocus
            />

            <button type="submit">
              Save
            </button>
          </form>
        )}

        <div className="character-sheet-section">
          <h3>
            Progress
          </h3>

          <div className="character-sheet-stats">
            <div className="character-sheet-stat">
              <span>Level</span>

              <strong>
                {progress.level}
              </strong>
            </div>

            <div className="character-sheet-stat">
              <span>Total XP</span>

              <strong>
                {xp.toLocaleString()}
              </strong>
            </div>

            <div className="character-sheet-stat">
              <span>Y-bucks</span>

              <strong>
                {yBucks.toLocaleString()}
              </strong>
            </div>

            <div className="character-sheet-stat">
              <span>Completed</span>

              <strong>
                {questCompletions.length}
              </strong>
            </div>

            <div className="character-sheet-stat">
              <span>Quests</span>

              <strong>
                {quests.length}
              </strong>
            </div>

            <div className="character-sheet-stat">
              <span>Next level</span>

              <strong>
                {progress.nextLevelXp !== null
                  ? `${(
                      progress.nextLevelXp - xp
                    ).toLocaleString()} XP`
                  : "MAX"}
              </strong>
            </div>
          </div>
        </div>

        <div className="character-sheet-section">
          <h3>
            Account
          </h3>

          <div className="character-sheet-cloud">
            <div className="character-sheet-cloud-main">
              <strong>
                {user
                  ? "☁️ Cloud connected"
                  : "💾 Local save"}
              </strong>

              <span>
                {user
                  ? `Status: ${
                      cloudLabels[
                        cloudState
                      ] || "Ready"
                    }`
                  : "Stored on this device only"}
              </span>
            </div>

            {user && (
              <button
                type="button"
                className="character-sheet-signout"
                onClick={onSignOut}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CharacterSheet;
