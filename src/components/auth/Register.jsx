import { useState } from 'react';
import { register } from '../../firebase/auth';
import { useAuth } from '../../context/authContext';

export const Register = () => {
  const { userLoggedIn, refreshCurrentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!avatarFile) {
      setError('Please upload a profile image.');
      return;
    }

    try {
      await register({
        email: email.trim(),
        password,
        username: username.trim(),
        displayName: displayName.trim(),
        avatarFile,
      });
      await refreshCurrentUser();
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
      <input
        className="auth-card__input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        className="auth-card__input"
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Display name"
        required
      />
      <input
        className="auth-card__input"
        type="file"
        accept="image/*"
        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
        required
      />
      <button className="auth-card__btn" type="submit">Sign up</button>
      {error && <p className="auth-card__error">{error}</p>}
    </form>
  );
};