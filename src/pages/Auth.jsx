import { useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/authContext";
import Login from "../components/auth/Login";
import { Register } from "../components/auth/Register";
import Logo from "../assets/quacker-logo.svg";

import "./Auth.scss";
import { log } from "firebase/firestore/pipelines";

export default function Auth() {
  const { userLoggedIn, loading } = useAuth();
  const [activeForm, setActiveForm] = useState("login");

  if (loading) {
    return <div className="auth-page auth-page__loading">Loading...</div>;
  }

  if (userLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <img className="auth-shell__logo" src={Logo} alt="Quacker" />
        <p className="auth-shell__lead">{activeForm === "login" ? "Welcome back" : "Join Quacker"}</p>

        <div className="auth-switch" role="tablist">
          <button
            className={`auth-switch__btn ${activeForm === "login" ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveForm("login")}
            role="tab"
            aria-selected={activeForm === "login"}
          >
            Log in
          </button>
          <button
            className={`auth-switch__btn ${activeForm === "register" ? "is-active" : ""}`}
            type="button"
            onClick={() => setActiveForm("register")}
            role="tab"
            aria-selected={activeForm === "register"}
          >
            Sign up
          </button>
        </div>

        {activeForm === "login" ? <Login /> : <Register />}
      </div>
    </main>
  );
}
