import "../auth.css";

function AuthPanel({
  user,
  characterName,
  authLoading,
  authError,
  onSignIn,
  onOpenCharacter
}) {
  const fallbackLetter =
    characterName
      ?.charAt(0)
      ?.toUpperCase() || "?";

  function handleOpenCharacter() {
    if (typeof onOpenCharacter === "function") {
      onOpenCharacter();
    }
  }

  if (user) {
    return (
      <div className="auth-panel">
        <button
          type="button"
          className="auth-status cloud"
          onClick={handleOpenCharacter}
        >
          <span className="auth-mode-icon">
            ☁️
          </span>

          <span className="auth-mode-text">
            Account
          </span>

          <div className="auth-user">
            <div className="auth-avatar-fallback">
              {fallbackLetter}
            </div>

            <div className="auth-user-info">
              <span className="auth-user-name">
                {characterName ||
                  "QuestMe player"}
              </span>

              <span className="auth-user-email">
                Cloud connected
              </span>
            </div>
          </div>
        </button>

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
      <button
        type="button"
        className="auth-status"
        onClick={handleOpenCharacter}
      >
        <span className="auth-mode-icon">
          💾
        </span>

        <span className="auth-mode-text">
          Local
        </span>

        <div className="auth-user">
          <div className="auth-avatar-fallback">
            {fallbackLetter}
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
      </button>

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
