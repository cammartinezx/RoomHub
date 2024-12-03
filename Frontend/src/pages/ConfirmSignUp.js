import React, { useState } from 'react';
import styles from '../styles/ConfirmSignUp.module.css';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerificationCodePage = () => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { username, name } = location.state || {}; // Safely access state

  const handleVerify = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Confirm the verification code with AWS Cognito
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username,
        confirmationCode,
      });

      if (isSignUpComplete) {
        console.log('Verification successful');
        // Send the additional field to your backend
        const response = await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/add-user', {
          id: username,
          name, // The additional field you want to store
        });
        console.log("Successful sign-up:", response);
        navigate('/home');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrorMessage(error.message || 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setResendMessage('');
    setErrorMessage('');
    try {
      await resendSignUpCode(username); // Corrected function
      setResendMessage('Verification code resent successfully!');
    } catch (error) {
      console.error('Error resending verification code:', error);
      setErrorMessage(error.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
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
        {resendMessage && <p className={styles.success}>{resendMessage}</p>}
        <button
          onClick={handleVerify}
          className={styles.button}
          disabled={loading || !confirmationCode.trim()}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        <button
          onClick={handleResendCode}
          className={styles.secondaryButton}
          disabled={resendLoading}
        >
          {resendLoading ? 'Resending...' : 'Resend Code'}
        </button>
      </div>
    </div>
  );
};

export default VerificationCodePage;
