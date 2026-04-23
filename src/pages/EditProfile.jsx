import { useState } from "react";
import { useNavigate } from "react-router";
import { updateProfile } from "firebase/auth";
import Header from "../components/Header";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/authContext";

export default function EditProfile() {
	const navigate = useNavigate();
	const { currentUser, refreshCurrentUser } = useAuth();
	const [username, setUsername] = useState(currentUser?.displayName || "");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		const trimmedUsername = username.trim();

		if (!trimmedUsername) {
			setError("Username cannot be empty.");
			return;
		}

		if (!auth.currentUser) {
			setError("You must be logged in.");
			return;
		}

		setSubmitting(true);
		setError("");

		try {
			await updateProfile(auth.currentUser, { displayName: trimmedUsername });
			await refreshCurrentUser();
			navigate("/profile", { replace: true });
		} catch (err) {
			setError(err.message || "Failed to update username.");
			setSubmitting(false);
		}
	};

	return (
		<>
			<Header headerText="Edit Profile" />
			<main className="container">
				<form onSubmit={handleSubmit}>
					<label htmlFor="username">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						value={username}
						onChange={(event) => setUsername(event.target.value)}
						placeholder="Enter your username"
						disabled={submitting}
					/>
					{error ? <p>{error}</p> : null}
					<button type="submit" disabled={submitting}>
						{submitting ? "Saving..." : "Save"}
					</button>
				</form>
			</main>
		</>
	);
}
