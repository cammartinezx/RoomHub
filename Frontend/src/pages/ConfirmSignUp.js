import React, { useState } from 'react';
import styles from '../styles/ConfirmSignUp.module.css';
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
      if (isSignUpComplete) {
        console.log('Verification successful');
        // Send the additional field to your backend
        const response = await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/add-user', {
          id: username,
          name: name, // The additional field you want to store
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
    <div className={styles.container}>
      <div className={styles.verificationBox}>
        <h2 className={styles.header}>Verify Your Account</h2>
        <p className={styles.instructions}>
          Enter the verification code sent to your email.
        </p>
        <input
          type="text"
          placeholder="Verification Code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          className={styles.input}
        />
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <button
          onClick={handleVerify}
          className={styles.button}
          disabled={loading || !confirmationCode.trim()}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>
    </div>
  );
};

export default VerificationCodePage;
