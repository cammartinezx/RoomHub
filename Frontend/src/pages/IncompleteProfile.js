import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/IncompleteProfile.module.css';

const IncompleteProfile = ({signOut}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const hasRoom = location.state?.hasRoom;


  const handleLogout = () => {
    // Perform any logout logic here, e.g., clearing session storage
    navigate('/login');
  };

  return (
    <div className={styles.incompleteProfileContainer}>
      <header className={styles.incompleteProfileHeader}>
        <div className={styles.incompleteProfileLogo}>
          <img src="/logo2.png" alt="RoomHub Logo" onClick={() => navigate('/home', { state: { hasRoom, email } })} />
        </div>
      </header>
      <div className={styles.incompleteProfileContent}>
        <h1 className={styles.incompleteProfileTitle}>Profile Incomplete</h1>
        <p className={styles.incompleteProfileDescription}>
          Your user profile is currently incomplete. You can complete it by creating a Find Roommate profile.
        </p>
        <button
          onClick={() => navigate('/welcome-find-roommate', { state: { email, hasRoom} })}
          className={`${styles.incompleteProfileButton} ${styles.incompleteProfileCreateButton}`}
        >
            Create Find Roommate Profile
        </button>
        <button
          className={`${styles.incompleteProfileButton} ${styles.incompleteProfileLogoutButton}`}
          onClick={() => {
            signOut(); // This will log the user out of Cognito
            navigate('/'); // Then redirect to the landing page
          }}>
            Log Out
        </button>
      </div>
    </div>
  );
};

export default IncompleteProfile;
