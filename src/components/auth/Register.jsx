import { useState } from 'react';
import { register, saveUserProfileDoc } from '../../firebase/auth';
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
      console.log("[RegisterComponent] handleRegister called");
      const { userCredential, avatarData } = await register({
        email: email.trim(),
        password,
        username: username.trim(),
        displayName: displayName.trim(),
        avatarFile,
      });
      console.log("[RegisterComponent] register() completed, avatarData:", avatarData);

      const profileData = {
        uid: userCredential.user.uid,
        email: email.trim(),
        username: username.trim(),
        displayName: displayName.trim(),
        photoURL: avatarData.photoURL,
        avatarPath: avatarData.avatarPath,
      };
      console.log("[RegisterComponent] About to save profile with photoURL:", profileData.photoURL);
      console.log("[RegisterComponent] Full profile data:", profileData);

      await saveUserProfileDoc(userCredential.user, profileData, { merge: true });
      console.log("[RegisterComponent] User profile doc saved");

      console.log("[RegisterComponent] Refreshing current user...");
      await refreshCurrentUser();
      console.log("[RegisterComponent] Signup complete");
    } catch (err) {
      console.error("[RegisterComponent] Error:", err);
      setError(err.message || err.toString());
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