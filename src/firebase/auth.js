import {auth} from './firebase';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export const register = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return  await signInWithPopup(auth, provider);
};

export const logout = async () => {
    return await signOut(auth);
};