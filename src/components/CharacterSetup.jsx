import { useState } from "react";

import "../character.css";

function CharacterSetup({
  currentName,
  onSave
}) {
  const [name, setName] =
    useState(currentName || "");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanName =
      name.trim().slice(0, 30);

    if (!cleanName) {
      return;
    }

    onSave(cleanName);
  }

  return (
    <div className="character-setup-backdrop">
      <form
        className="character-setup"
        onSubmit={handleSubmit}
      >
        <div className="character-setup-icon">
          ⚔️
        </div>

        <h2>Create your character</h2>

        <p>
          Dit is jouw naam binnen QuestMe.
          Je Google-account wordt alleen gebruikt
          voor inloggen en cloud sync.
        </p>

        <label>
          <span>Character name</span>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Bijvoorbeeld: Yoe"
            maxLength="30"
            autoFocus
          />
        </label>

        <button type="submit">
          Begin Adventure
        </button>
      </form>
    </div>
  );
}

export default CharacterSetup;
