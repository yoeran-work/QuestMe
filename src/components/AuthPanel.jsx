import "../auth.css";

function AuthPanel({
  user,
  characterName,
  authLoading,
  authError,
  onSignIn,
  onSignOut
}) {
  if (user) {
    return (
      <div className="auth-panel">
        <div className="auth-status cloud">
          <span className="auth-mode-icon">
            ☁️
          </span>

          <span className="auth-mode-text">
            Synced
          </span>

          <div className="auth-user">
            <div className="auth-avatar-fallback">
              {characterName
                ?.charAt(0)
                ?.toUpperCase() || "?"}
            </div>

            <div className="auth-user-info">
              <span className="auth-user-name">
                {characterName ||
                  "QuestMe player"}
              </span>

              <span className="auth-user-email">
                Google connected
              </span>
            </div>
          </div>

          <button
            type="button"
            className="auth-button sign-out"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>

        {authError && (
          <div className="auth-error">
            {authError}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="auth-panel">
      <div className="auth-status">
        <span className="auth-mode-icon">
          💾
        </span>

        <span className="auth-mode-text">
          Local
        </span>

        <div className="auth-user">
          <div className="auth-avatar-fallback">
            {characterName
              ?.charAt(0)
              ?.toUpperCase() || "?"}
          </div>

          <div className="auth-user-info">
            <span className="auth-user-name">
              {characterName ||
                "QuestMe player"}
            </span>

            <span className="auth-user-email">
              Device only
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="auth-button"
        onClick={onSignIn}
        disabled={authLoading}
      >
        {authLoading
          ? "Checking..."
          : "☁️ Sign in"}
      </button>

      {authError && (
        <div className="auth-error">
          {authError}
        </div>
      )}
    </div>
  );
}

export default AuthPanel;
