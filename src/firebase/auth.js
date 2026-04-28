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

function getUsernameFallback(user) {
    return user.email?.split("@")[0] || user.displayName || "user";
}

async function writeUserDoc(user, data, options = {}) {
    console.log("[writeUserDoc] Writing to users/" + user.uid);
    const userDocRef = doc(db, "users", user.uid);

    const docData = {
        uid: user.uid,
        email: user.email || "",
        username: data.username || getUsernameFallback(user),
        displayName: data.displayName || user.displayName || getUsernameFallback(user),
        photoURL: data.photoURL || user.photoURL || "",
        avatarPath: data.avatarPath || "",
        createdAt: data.createdAt || serverTimestamp(),
    };
    console.log("[writeUserDoc] Doc data:", docData);

    try {
        await setDoc(userDocRef, docData, options);
        console.log("[writeUserDoc] Successfully written");
    } catch (err) {
        console.error("[writeUserDoc] Error writing:", err);
        throw err;
    }
}

export async function saveUserProfileDoc(user, data, options = {}) {
    return await writeUserDoc(user, data, options);
}

async function uploadAvatar(user, avatarFile) {
    if (!avatarFile) {
        return { avatarPath: "", photoURL: "" };
    }

    const filePath = `avatars/${user.uid}/${Date.now()}_${avatarFile.name}`;
    const avatarRef = storageRef(storage, filePath);
    await uploadBytes(avatarRef, avatarFile);
    const photoURL = await getDownloadURL(avatarRef);

    return {
        avatarPath: photoURL,
        photoURL: photoURL,
    };
}

export const register = async ({ email, password, username, displayName, avatarFile }) => {
    console.log("[Register] Starting signup for", email);
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;
        console.log("[Register] Auth user created:", user.uid);

        console.log("[Register] Writing initial user doc...");
        await writeUserDoc(user, {
            username,
            displayName,
            createdAt: serverTimestamp(),
        });
        console.log("[Register] Initial user doc written");

        let avatarData = { avatarPath: "", photoURL: "" };

        try {
            console.log("[Register] Uploading avatar...", avatarFile?.name);
            avatarData = await uploadAvatar(user, avatarFile);
            console.log("[Register] Avatar uploaded successfully");
            console.log("[Register] avatarPath:", avatarData.avatarPath);
            console.log("[Register] photoURL:", avatarData.photoURL);
        } catch (avatarErr) {
            console.error("[Register] Avatar upload failed (non-fatal):", avatarErr);
            avatarData = { avatarPath: "", photoURL: "" };
        }

        console.log("[Register] Writing user doc with avatar...");
        await writeUserDoc(
            user,
            {
                username,
                displayName,
                avatarPath: avatarData.avatarPath,
                photoURL: avatarData.photoURL,
            },
            { merge: true }
        );
        console.log("[Register] User doc with avatar written");

        await updateProfile(user, {
            displayName,
            photoURL: avatarData.photoURL || null,
        });
        console.log("[Register] Auth profile updated");

        return { userCredential, avatarData };
    } catch (err) {
        console.error("[Register] Signup error:", err);
        throw err;
    }
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
    const usernameFallback = getUsernameFallback(user);

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