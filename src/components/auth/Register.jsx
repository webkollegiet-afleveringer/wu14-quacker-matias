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
      alert('User registered successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (userLoggedIn) {
    return <p>You are already logged in.</p>;
  }

  return (
    <form onSubmit={handleRegister}>
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
      <button type="submit">Sign Up</button>
      {error && <p>{error}</p>}
    </form>
  );
};