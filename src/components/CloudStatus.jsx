function CloudStatus({
  user,
  cloudState
}) {
  if (!user) {
    return null;
  }

  const labels = {
    idle: "Cloud ready",
    checking: "Checking cloud...",
    uploading: "Uploading local save...",
    downloading: "Loading cloud save...",
    synced: "Cloud synced",
    saving: "Saving...",
    error: "Cloud error"
  };

  const icons = {
    idle: "☁️",
    checking: "🔎",
    uploading: "⬆️",
    downloading: "⬇️",
    synced: "☁️",
    saving: "☁️",
    error: "⚠️"
  };

  return (
    <div
      className={`cloud-status cloud-status-${cloudState}`}
    >
      <span>
        {icons[cloudState] || "☁️"}
      </span>

      <span>
        {labels[cloudState] ||
          "Cloud ready"}
      </span>
    </div>
  );
}

export default CloudStatus;
