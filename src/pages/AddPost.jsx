import { useState } from "react";
import { useNavigate } from "react-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Header from "../components/Header";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/authContext";

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
            await addDoc(collection(db, "quacks"), {
                content: trimmedContent,
                uid: currentUser.uid,
                username: currentUser.displayName || currentUser.email || "Anonymous",
                userEmail: currentUser.email || "",
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
            <main className="container">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="post-content">What's happening?</label>
                    <textarea
                        id="post-content"
                        name="content"
                        rows={6}
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Share your quack..."
                        disabled={submitting}
                    />
                    {error ? <p>{error}</p> : null}
                    <button type="submit" disabled={submitting}>
                        {submitting ? "Publishing..." : "Publish"}
                    </button>
                </form>
            </main>
        </>
    );
}