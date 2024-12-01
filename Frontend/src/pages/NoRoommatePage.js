import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/InfoPage.module.css';
import { checkUserProfile } from '../services/profileService';

const NoRoommatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;

  const handleFindRoommate = async () => {
    try {
        const isProfileComplete = await checkUserProfile(email);

        if (isProfileComplete) {
            // If the profile is complete, navigate to the find roommate page
            navigate('/find-roommate', { state: { hasRoom, email } });
        } else {
            // If the profile is incomplete, navigate to the welcome-find-roommate page
            navigate('/welcome-find-roommate', { state: { hasRoom, email } });
        }
    } catch (error) {
        console.error("Error in handleFindRoommate:", error);
        alert("An error occurred. Please try again.");
    }
};

  return (
    <div className={styles.container}>
      <h2>You have no roommates to review.</h2>
      <button
        className={styles.findRoommateButton}
        onClick={handleFindRoommate}
      >
        Find Roommate
      </button>
    </div>
  );
};

export default NoRoommatePage;
