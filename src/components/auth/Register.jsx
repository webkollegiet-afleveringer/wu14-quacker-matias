import { useState } from 'react';
import { register } from '../../firebase/auth';
import { useAuth } from '../../context/authContext';

export const Register = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  if (userLoggedIn) {
    return null;
  }

  return (
    <form className="auth-card" onSubmit={handleRegister}>
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
      <button className="auth-card__btn" type="submit">Sign up</button>
      {error && <p className="auth-card__error">{error}</p>}
    </form>
  );
};