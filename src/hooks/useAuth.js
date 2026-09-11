import { useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";

import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,

      (firebaseUser) => {
        setUser(firebaseUser);
        setAuthLoading(false);
        setAuthError("");
      },

      (error) => {
        console.error(
          "QuestMe: authentication state error.",
          error
        );

        setAuthError(
          "Could not determine login status."
        );

        setAuthLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  async function signInWithGoogle() {
    setAuthError("");
    setAuthLoading(true);

    try {
      await signInWithPopup(
        auth,
        googleProvider
      );
    } catch (error) {
      console.error(
        "QuestMe: Google sign-in failed.",
        error
      );

      if (
        error.code !==
        "auth/popup-closed-by-user"
      ) {
        setAuthError(
          getReadableAuthError(error)
        );
      }
    } finally {
      setAuthLoading(false);
    }
  }

  async function signOutUser() {
    setAuthError("");

    try {
      await signOut(auth);
    } catch (error) {
      console.error(
        "QuestMe: sign-out failed.",
        error
      );

      setAuthError(
        "Signing out failed. Please try again."
      );
    }
  }

  return {
    user,
    authLoading,
    authError,
    signInWithGoogle,
    signOutUser
  };
}

function getReadableAuthError(error) {
  switch (error.code) {
    case "auth/popup-blocked":
      return "Your browser blocked the Google login popup.";

    case "auth/unauthorized-domain":
      return "This domain is not authorized for Google login.";

    case "auth/network-request-failed":
      return "Google login could not connect to the internet.";

    case "auth/cancelled-popup-request":
      return "";

    default:
      return "Google login failed. Please try again.";
  }
}
