import { useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "../firebase/auth";
import { useAuth } from "../context/authContext";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Profile() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [error, setError] = useState("");

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
                {currentUser && <p>Email: {currentUser.email}</p>}
                <button onClick={handleSignOut} className="profile-signout-btn">
                    Sign Out
                </button>
                {error && <p className="profile-error">{error}</p>}
            </div>
            <Navbar />
        </>
    );
}