import { useEffect, useState } from "react";

function QuestForm({
  onAddQuest,
  editingQuest,
  onSaveEdit,
  onCancelEdit
}) {
  const [title, setTitle] = useState("");
  const [xp, setXp] = useState("");
  const [y, setY] = useState("");
  const [type, setType] = useState("daily");

  useEffect(() => {
    if (editingQuest) {
      setTitle(editingQuest.title);
      setXp(editingQuest.xp);
      setY(editingQuest.y);
      setType(editingQuest.type || "daily");
      return;
    }

    resetForm();
  }, [editingQuest]);

  function resetForm() {
    setTitle("");
    setXp("");
    setY("");
    setType("daily");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const xpValue = Number(xp);
    const yValue = Number(y);

    if (!cleanTitle) {
      return;
    }

    if (
      !Number.isFinite(xpValue) ||
      !Number.isFinite(yValue) ||
      xpValue < 0 ||
      yValue < 0
    ) {
      return;
    }

    if (editingQuest) {
      onSaveEdit({
        ...editingQuest,

        title: cleanTitle,
        xp: xpValue,
        y: yValue,
        type,

        updatedAt: new Date().toISOString()
      });

      return;
    }

    onAddQuest({
      id: crypto.randomUUID(),

      title: cleanTitle,
      xp: xpValue,
      y: yValue,
      type,

      createdAt: new Date().toISOString()
    });

    resetForm();
  }

  function handleCancel() {
    resetForm();
    onCancelEdit();
  }

  return (
    <form
      className={`quest-form ${
        editingQuest ? "quest-form-editing" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <div className="quest-form-header">
        <div>
          <strong>
            {editingQuest
              ? "✏️ Edit quest"
              : "✨ Create a quest"}
          </strong>

          <span>
            {editingQuest
              ? "Pas de quest aan en sla je wijzigingen op."
              : "Maak iets uit het echte leven onderdeel van je RPG."}
          </span>
        </div>

        {editingQuest && (
          <button
            type="button"
            className="quest-cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="quest-form-fields">
        <label className="quest-field quest-title-field">
          <span>Quest</span>

          <input
            type="text"
            placeholder="Bijvoorbeeld: Gitaar oefenen"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />
        </label>

        <label className="quest-field">
          <span>XP</span>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="100"
            value={xp}
            onChange={(event) =>
              setXp(event.target.value)
            }
            required
          />
        </label>

        <label className="quest-field">
          <span>Y-bucks</span>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="50"
            value={y}
            onChange={(event) =>
              setY(event.target.value)
            }
            required
          />
        </label>

        <label className="quest-field quest-type-field">
          <span>Repeat</span>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
          >
            <option value="daily">
              ☀️ Daily
            </option>

            <option value="weekly">
              📅 Weekly
            </option>

            <option value="one-time">
              🏆 One-time
            </option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="quest-submit-button"
      >
        {editingQuest
          ? "Save changes"
          : "+ Add quest"}
      </button>
    </form>
  );
}

export default QuestForm;
