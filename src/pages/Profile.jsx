import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "../firebase/auth";
import { useAuth } from "../context/authContext";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./Profile.scss";

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [error, setError] = useState("");
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        async function fetchProfile() {
            if (!currentUser?.uid) {
                setProfileData({});
                return;
            }

            try {
                const snapshot = await getDoc(doc(db, "users", currentUser.uid));
                setProfileData(snapshot.exists() ? snapshot.data() : {});
            } catch {
                setProfileData({});
            }
        }

        fetchProfile();
    }, [currentUser?.uid]);

    const displayName = profileData.displayName || currentUser?.displayName || "Anonymous";
    const username = profileData.username || currentUser?.username || currentUser?.email?.split("@")[0] || "";
    const avatarPath = profileData.avatarPath || profileData.photoURL || currentUser?.photoURL || "";

    const handleSignOut = async () => {
        setError("");
        try {
            await logout();
            navigate("/auth", { replace: true });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Header />
            <div className="profile-container">
                <h1>Profile</h1>
                {avatarPath ? (
                    <img src={avatarPath} alt={`${displayName} profile`} width="72" height="72" />
                ) : null}
                <p>Display name: {displayName}</p>
                {username ? <p>Username: @{username}</p> : null}
                {currentUser && <p>Email: {currentUser.email}</p>}
                <div className="profile-actions">
                    <button onClick={() => navigate("/edit-profile")} className="btn-primary">
                        Edit Profile
                    </button>
                    <button onClick={handleSignOut} className="btn-secondary">
                        Sign Out
                    </button>
                </div>
                {error && <p className="profile-error">{error}</p>}
            </div>
            <Navbar />
        </>
    );
}