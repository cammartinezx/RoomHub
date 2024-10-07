import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/HomePage.module.css'; 

const UserProfile = ({ user }) => {
  const location = useLocation();
  const email = user?.signInDetails?.loginId;
  const navigate = useNavigate();
  const hasRoom = location.state?.hasRoom;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="RoomHub Logo" />
        </div>
      </header>

        <h1 className={styles.title}>User Profile for {email}</h1>
        <button className={styles.logout} onClick={() => navigate('/')}>Log Out</button>
        <button className={styles.logout} onClick={() => navigate('/home', { state: { email, hasRoom } })}>Back to Home</button>
    </div>
  );
};

export default UserProfile;
