import { useState } from 'react';
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
    const { isSignedIn, nextStep } = await signIn({ username , password });

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
    <div>
      <h2>Login</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin}>Log In</button>

      {error && <p>{error}</p>}

      <p>
        If you don't have an account, 
        <span 
          style={{ color: 'blue', cursor: 'pointer' }} 
          onClick={() => navigate('/sign-up')}
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default CustomLogin;
