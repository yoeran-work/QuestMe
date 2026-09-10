import { useState } from "react";

function QuestForm({ onAddQuest }) {
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState("");
  const [y, setY] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const xpValue = Number(xp);
    const yValue = Number(y);

    if (!cleanTitle) {
      return;
    }

    if (xpValue < 0 || yValue < 0) {
      return;
    }

    const newQuest = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      xp: xpValue || 0,
      y: yValue || 0
    };

    onAddQuest(newQuest);

    setTitle("");
    setXp("");
    setY("");
  }

  return (
    <form className="quest-form" onSubmit={handleSubmit}>
      <div className="quest-form-grid">
        <input
          type="text"
          placeholder="Nieuwe quest..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <input
          type="number"
          placeholder="XP"
          min="0"
          value={xp}
          onChange={(event) => setXp(event.target.value)}
        />

        <input
          type="number"
          placeholder="Y"
          min="0"
          value={y}
          onChange={(event) => setY(event.target.value)}
        />

        <button type="submit">
          + Quest
        </button>
      </div>
    </form>
  );
}

export default QuestForm;
