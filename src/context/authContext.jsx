import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, reload } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

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

  async function buildCurrentUser(user) {
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);
    const userData = userSnapshot.exists() ? userSnapshot.data() : {};
    console.log("[Auth] Building current user from uid", user.uid);
    console.log("[Auth] Firestore userData:", userData);
    console.log("[Auth] Auth user object:", { displayName: user.displayName, photoURL: user.photoURL });

    return {
      ...user,
      displayName: userData.displayName || user.displayName || "",
      username: userData.username || "",
      photoURL: userData.photoURL || user.photoURL || "",
      avatarPath: userData.avatarPath || "",
      email: userData.email || user.email || "",
    };
  }

  async function upsertUserDocIfMissing(user) {
    if (!user?.uid) return;
    try {
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);
      const userData = snapshot.exists() ? snapshot.data() : {};
      const usernameFallback = user.email?.split("@")[0] || user.displayName || "user";

      console.log("[Auth] Upserting user doc for", user.uid);
      console.log("[Auth] Existing user data:", userData);
      console.log("[Auth] User auth object displayName:", user.displayName);

      const docToSave = {
        uid: user.uid,
        email: user.email || userData.email || "",
        username: userData.username || usernameFallback,
        displayName: userData.displayName || user.displayName || usernameFallback,
        photoURL: userData.photoURL || user.photoURL || "",
        ...(userData.avatarPath ? { avatarPath: userData.avatarPath } : {}),
        ...(snapshot.exists() ? {} : { createdAt: serverTimestamp() }),
      };
      console.log("[Auth] About to save:", docToSave);

      await setDoc(
        userRef,
        docToSave,
        { merge: true }
      );
      console.log("[Auth] User doc saved successfully");
    } catch (err) {
      console.error("[Auth] Error upserting user doc:", err);
    }
  }

  async function initializeUser(user) {
    if (user) {
      try {
        await upsertUserDocIfMissing(user);
        const hydratedUser = await buildCurrentUser(user);
        setCurrentUser(hydratedUser);
      } catch {
        setCurrentUser({ ...user });
      }
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

    try {
      const hydratedUser = await buildCurrentUser(auth.currentUser);
      setCurrentUser(hydratedUser);
    } catch {
      setCurrentUser({ ...auth.currentUser });
    }
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
