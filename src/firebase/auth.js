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

async function fileToDataUrl(file) {
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Unable to read profile image."));
        reader.readAsDataURL(file);
    });
}

export const register = async ({ email, password, username, displayName, avatarFile }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    const avatarUrl = await fileToDataUrl(avatarFile);

    await updateProfile(user, {
        displayName,
        photoURL: avatarUrl,
    });

    await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        username,
        displayName,
        photoURL: avatarUrl,
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
            ...(userSnapshot.exists() ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true }
    );

    return userCredential;
};

export const logout = async () => {
    return await signOut(auth);
};