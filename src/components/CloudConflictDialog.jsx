import {
  getSaveSummary
} from "../utils/syncConflict";

import "../cloud-conflict.css";

function SaveCard({
  title,
  icon,
  data
}) {
  const summary =
    getSaveSummary(data);

  return (
    <div className="cloud-save-card">
      <h3>
        {icon} {title}
      </h3>

      <div className="cloud-save-character">
        {summary.characterName}
      </div>

      <div className="cloud-save-stats">
        <div className="cloud-save-stat">
          <span>XP</span>

          <strong>
            {summary.totalXp.toLocaleString()}
          </strong>
        </div>

        <div className="cloud-save-stat">
          <span>Y-bucks</span>

          <strong>
            {summary.yBucks.toLocaleString()}
          </strong>
        </div>

        <div className="cloud-save-stat">
          <span>Quests</span>

          <strong>
            {summary.quests}
          </strong>
        </div>

        <div className="cloud-save-stat">
          <span>Completed</span>

          <strong>
            {summary.completions}
          </strong>
        </div>
      </div>
    </div>
  );
}

function CloudConflictDialog({
  localData,
  cloudData,
  resolving,
  onUseCloud,
  onKeepLocal
}) {
  return (
    <div className="cloud-conflict-backdrop">
      <div className="cloud-conflict-dialog">
        <div className="cloud-conflict-header">
          <h2>
            ⚔️ Two saves found
          </h2>

          <p>
            This device and your cloud account
            both contain QuestMe progress.
            Choose which save should become
            your active character.
          </p>
        </div>

        <div className="cloud-conflict-saves">
          <SaveCard
            title="This device"
            icon="💾"
            data={localData}
          />

          <SaveCard
            title="Cloud save"
            icon="☁️"
            data={cloudData}
          />
        </div>

        <div className="cloud-conflict-warning">
          Choosing <strong>Keep this device</strong>{" "}
          will replace the current cloud save
          with the progress stored on this device.
        </div>

        <div className="cloud-conflict-actions">
          <button
            type="button"
            className="cloud-conflict-button cloud"
            onClick={onUseCloud}
            disabled={resolving}
          >
            ☁️ Use cloud save
          </button>

          <button
            type="button"
            className="cloud-conflict-button local"
            onClick={onKeepLocal}
            disabled={resolving}
          >
            💾 Keep this device
          </button>
        </div>
      </div>
    </div>
  );
}

export default CloudConflictDialog;
