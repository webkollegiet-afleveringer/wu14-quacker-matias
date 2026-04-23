import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, reload } from "firebase/auth";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  async function refreshCurrentUser() {
    if (!auth.currentUser) {
      return;
    }

    await reload(auth.currentUser);
    setCurrentUser({ ...auth.currentUser });
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    refreshCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
