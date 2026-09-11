import "../auth.css";

function AuthPanel({
  user,
  authLoading,
  authError,
  onSignIn,
  onSignOut
}) {
  if (user) {
    const fallbackLetter =
      user.displayName?.trim()?.charAt(0)?.toUpperCase() ||
      user.email?.charAt(0)?.toUpperCase() ||
      "?";

    return (
      <div className="auth-panel">
        <div className="auth-status cloud">
          <span className="auth-mode-icon">
            ☁️
          </span>

          <span className="auth-mode-text">
            Cloud
          </span>

          <div className="auth-user">
            {user.photoURL ? (
              <img
                className="auth-avatar"
                src={user.photoURL}
                alt=""
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="auth-avatar-fallback">
                {fallbackLetter}
              </div>
            )}

            <div className="auth-user-info">
              <span className="auth-user-name">
                {user.displayName ||
                  "QuestMe player"}
              </span>

              {user.email && (
                <span className="auth-user-email">
                  {user.email}
                </span>
              )}
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
