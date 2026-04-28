import { useState } from "react";
import { useNavigate } from "react-router";
import { doc, setDoc } from "firebase/firestore";
import Header from "../components/Header";
import { auth, db } from "../firebase/firebase";
import { useAuth } from "../context/authContext";
import "./EditProfile.scss";

export default function EditProfile() {
	const navigate = useNavigate();
	const { currentUser, refreshCurrentUser } = useAuth();
	const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();
		const trimmedDisplayName = displayName.trim();

		if (!trimmedDisplayName) {
			setError("Display name cannot be empty.");
			return;
		}

		if (!auth.currentUser) {
			setError("You must be logged in.");
			return;
		}

		setSubmitting(true);
		setError("");

		try {
			await setDoc(doc(db, "users", auth.currentUser.uid), {
				displayName: trimmedDisplayName,
			}, { merge: true });

			await refreshCurrentUser();
			navigate("/profile", { replace: true });
		} catch (err) {
			setError(err.message || "Failed to update display name.");
			setSubmitting(false);
		}
	};

	return (
		<>
			<Header headerText="Edit Profile" />
			<main className="edit-profile-container">
				<form className="edit-profile-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="displayName">Display Name</label>
						<input
							id="displayName"
							name="displayName"
							type="text"
							value={displayName}
							onChange={(event) => setDisplayName(event.target.value)}
							placeholder="Enter your display name"
							disabled={submitting}
						/>
					</div>
					{error && <p className="error-message">{error}</p>}
					<div className="form-actions">
						<button type="submit" disabled={submitting} className="btn-save">
							{submitting ? "Saving..." : "Save"}
						</button>
						<button type="button" onClick={() => navigate("/profile")} className="btn-cancel">
							Cancel
						</button>
					</div>
				</form>
			</main>
		</>
	);
}
