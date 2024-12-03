import { useState } from 'react';
import styles from '../styles/CustomSignUp.module.css';
import { signUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const CustomSignUp = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }

    if (!username.trim()) {
      setError('Email is required.');
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Password and confirm password are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Call AWS Amplify's sign-up method to create the user
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
      });

      console.log(isSignUpComplete, userId, nextStep);

      // Navigate to the verification page with username and name
      navigate('/verify', { state: { username, name } });
    } catch (error) {
      setError(error.message);
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.signUpBox}>
        <h2 className={styles.title}>Create an Account</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.inputField}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.inputField}
        />
        <button onClick={handleSignUp} className={styles.signUpButton}>
          Sign Up
        </button>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    </div>
  );
};

export default CustomSignUp;
