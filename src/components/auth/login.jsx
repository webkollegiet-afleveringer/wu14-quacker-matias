import { login, doSignInWithGoogle, logout } from "../../firebase/auth";
import { useAuth } from "../../context/authContext";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");

    try {
      await doSignInWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    setError("");

    try {
      await logout();
    } catch (err) {
      setError(err.message);
    }
  };

  if (userLoggedIn) {
    return (
      <div className="auth-card auth-card--logged-in">
        <p className="auth-card__title">You are logged in.</p>
        <button
          className="auth-card__btn auth-card__btn--danger"
          type="button"
          onClick={handleLogout}
        >
          Log out
        </button>
        {error && <p className="auth-card__error">{error}</p>}
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={handleLogin}>
      <input
        className="auth-card__input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        className="auth-card__input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="auth-card__btn" type="submit">
        Log in
      </button>
      <span className="or_btn">
        <hr />
        or
        <hr />
      </span>
      <button
        className="auth-card__btn auth-card__btn--secondary"
        type="button"
        onClick={handleGoogleLogin}
      >
        <FcGoogle size={20} />
        Continue with Google
      </button>
      {error && <p className="auth-card__error">{error}</p>}
    </form>
  );
};

export default Login;
