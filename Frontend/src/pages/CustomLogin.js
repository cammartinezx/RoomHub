import { useState } from 'react';
import styles from '../styles/CustomLogin.module.css';
// import { Auth } from 'aws-amplify';
import { signIn } from 'aws-amplify/auth';

import { useNavigate } from 'react-router-dom';

const CustomLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Call AWS Amplify's sign-in method
      //   const user = await Auth.signIn(email, password);
      console.log(username)
      console.log(password)
      const { isSignedIn, nextStep } = await signIn({ username, password });

      console.log('Logged in successfully:', isSignedIn);
      console.log(nextStep);

      // Redirect to home after successful login
      navigate('/home');
    } catch (error) {
      setError(error.message);
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
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
        <button onClick={handleLogin} className={styles.loginButton}>
          Log In
        </button>
        {error && <p className={styles.errorText}>{error}</p>}
        <p className={styles.signUpText}>
          Don’t have an account?{' '}
          <span
            className={styles.signUpLink}
            onClick={() => navigate('/sign-up')}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default CustomLogin;
