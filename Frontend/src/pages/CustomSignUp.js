import { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const CustomSignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      // Call AWS Amplify's sign-up method to create the user
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password
      })

      console.log(isSignUpComplete)
      console.log(userId)
      console.log(nextStep)

    //   getting to this point successfully means we are going for validation in the next step.
    // pass the username=email and the name=a name as that is passed accross required for the add-user path
    navigate('/verify', { state: { username,  name} });

    } catch (error) {
      setError(error.message);
      console.error('Error during sign-up:', error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <button onClick={handleSignUp}>Sign Up</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CustomSignUp;
