import React, { useState } from 'react';
import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios'


const VerificationCodePage = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { username, name } = location.state || {}; // Safely access state



  const handleVerify = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Confirm the verification code with AWS Cognito

      console.log(username);
      console.log(confirmationCode);
    //   confirm signup function
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode
      });
      
      console.log(isSignUpComplete);
      console.log(nextStep);

    //   if sign up complete-- backend call to add the user with their username
      if(isSignUpComplete){
        console.log('Verification successful');
        // Send the additional field to your backend
        const response = await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/add-user', {
            id:username,
            name:name, // The additional field you want to store
        });
        console.log("Successful sign up");
        console.log(response);
        // navigate to the home page--- for some reason this requires user to log in.
        navigate('/home');
      }
      
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage(error.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Enter Verification Code</h2>
      <p style={styles.instructions}>
        Please enter the verification code sent to your email address.
      </p>
      <input
        type="text"
        placeholder="Verification Code"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
        style={styles.input}
      />
      {errorMessage && <p style={styles.error}>{errorMessage}</p>}
      <button
        onClick={handleVerify}
        style={styles.button}
        disabled={loading || !confirmationCode.trim()}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  instructions: {
    fontSize: '16px',
    marginBottom: '20px',
    color: '#555',
  },
  input: {
    fontSize: '16px',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '80%',
    maxWidth: '400px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
};

export default VerificationCodePage;
