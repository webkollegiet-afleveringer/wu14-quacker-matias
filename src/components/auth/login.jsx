import { login, doSignInWithGoogle } from "../../firebase/auth";
import { useAuth } from "../../context/authContext";
import { useState } from "react";

const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            alert("Logged in successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");

        try {
            await doSignInWithGoogle();
            alert("Logged in with Google!");
        } catch (err) {
            setError(err.message);
        }
    };

    if (userLoggedIn) {
        return <p>You are already logged in.</p>;
    }

    return (
        <form onSubmit={handleLogin}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Log In</button>
            <button type="button" onClick={handleGoogleLogin}>
                Continue with Google
            </button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;