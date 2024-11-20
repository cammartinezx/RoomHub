import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/InfoPage.module.css';

const ReviewSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className={styles.container}>
      <h2>Review Submitted Successfully!</h2>
      <button onClick={() => navigate('/home', { state: { email } })}>Home</button>
      <button onClick={() => navigate('/virtual-room', { state: { email } })}>Virtual Room</button>
      <button onClick={() => navigate('/find-roommate', { state: { email } })}>Find Roommate</button>
    </div>
  );
};

export default ReviewSuccessPage;
