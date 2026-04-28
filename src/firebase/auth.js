import { auth, db, storage } from "./firebase";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
export const register = async ({ email, password, username, displayName, avatarFile }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    let avatarStoragePath = "";
    let avatarDownloadUrl = "";

    if (avatarFile) {
        const filePath = `avatars/${user.uid}/${Date.now()}_${avatarFile.name}`;
        const sRef = storageRef(storage, filePath);
        await uploadBytes(sRef, avatarFile);
        avatarStoragePath = sRef.fullPath;
        avatarDownloadUrl = await getDownloadURL(sRef);
    }

    await updateProfile(user, {
        displayName,
        photoURL: avatarDownloadUrl || null,
    });

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        username,
        displayName,
        photoURL: avatarDownloadUrl || "",
        avatarPath: avatarStoragePath,
        createdAt: serverTimestamp(),
    });

    return userCredential;
};

export const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const { user } = userCredential;
    const userDocRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userDocRef);
    const usernameFallback = user.email?.split("@")[0] || user.displayName || "user";

    await setDoc(
        userDocRef,
        {
            uid: user.uid,
            email: user.email || "",
            username: userSnapshot.data()?.username || usernameFallback,
            displayName: user.displayName || usernameFallback,
            photoURL: user.photoURL || "",
            avatarPath: user.photoURL || "",
            ...(userSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true }
    );

    return userCredential;
};

export const logout = async () => {
    return await signOut(auth);
};