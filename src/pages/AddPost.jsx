import { useState } from "react";
import { useNavigate } from "react-router";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import Header from "../components/Header";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/authContext";
import "./AddPost.scss";

export default function AddPost() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedContent = content.trim();

        if (!trimmedContent) {
            setError("Post content cannot be empty.");
            return;
        }

        if (!currentUser) {
            setError("You must be logged in to post.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const fallbackUsername = currentUser.email?.split("@")[0] || "anonymous";
            let userData = {};

            try {
                const userSnapshot = await getDoc(doc(db, "users", currentUser.uid));
                userData = userSnapshot.exists() ? userSnapshot.data() : {};
            } catch {
                userData = {};
            }

            const postDisplayName = userData.displayName || currentUser.displayName || userData.username || fallbackUsername;
            const postUsername = userData.username || currentUser.username || fallbackUsername;
            const postPhotoUrl = userData.photoURL || currentUser.photoURL || "";

            await addDoc(collection(db, "quacks"), {
                content: trimmedContent,
                uid: currentUser.uid,
                displayName: postDisplayName,
                username: postUsername,
                userEmail: currentUser.email || "",
                photoURL: postPhotoUrl,
                avatarPath: postPhotoUrl,
                createdAt: serverTimestamp(),
            });

            navigate("/", { replace: true });
        } catch (err) {
            setError(err.message || "Failed to publish post.");
            setSubmitting(false);
        }
    };

    return (
        <>
            <Header headerText="Add Quack" />
            <main className="container add-post-page">
                <form className="add-post-page__card" onSubmit={handleSubmit}>
                    <div className="add-post-page__header">
                        {currentUser?.photoURL ? (
                            <img
                                className="add-post-page__avatar"
                                src={currentUser.photoURL}
                                alt="Your profile"
                            />
                         ) : (
                            <div className="add-post-page__avatar add-post-page__avatar--fallback" aria-hidden="true" />
                        )}
                        <div>
                            <p className="add-post-page__name">
                                {currentUser?.displayName || currentUser?.email || "Anonymous"}
                            </p>
                            <p className="add-post-page__label">Share a new quack</p>
                        </div>
                    </div>
                    <label className="add-post-page__label-text" htmlFor="post-content">
                        What's happening?
                    </label>
                    <textarea
                        id="post-content"
                        name="content"
                        rows={6}
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Share your quack..."
                        disabled={submitting}
                    />
                    {error ? <p className="add-post-page__error">{error}</p> : null}
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Publishing..." : "Publish"}
                    </button>
                </form>
            </main>
        </>
    );
}