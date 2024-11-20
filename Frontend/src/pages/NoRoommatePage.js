import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/InfoPage.module.css';

const NoRoommatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className={styles.container}>
      <h2>You have no roommates to review.</h2>
      <button
        className={styles.findRoommateButton}
        onClick={() => navigate('/find-roommate', { state: { email } })}
      >
        Find Roommate
      </button>
    </div>
  );
};

export default NoRoommatePage;
