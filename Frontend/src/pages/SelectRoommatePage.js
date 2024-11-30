import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/SelectRoommatePage.module.css';

const SelectRoommatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roommates = location.state?.roommates || []; // Emails
  const roommateUsernames = location.state?.roommateUsernames || []; // Usernames
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;
  const [selectedRoommateEmail, setSelectedRoommateEmail] = useState('');

  const handleSubmit = async () => {
    if (!selectedRoommateEmail) {
      alert('Please select a roommate.');
      return;
    }

    try {
      const response = await axios.get(
        `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${selectedRoommateEmail}/find-roommate-page`
      );

      if (response.status === 200) {
        const selectedRoommateUsername =
        roommateUsernames[roommates.indexOf(selectedRoommateEmail)]; // Get the username for the selected email
        navigate('/review-roommate', {
          state: { hasRoom, selectedRoommate: selectedRoommateEmail, selectedRoommateUsername: selectedRoommateUsername, email },
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('This roommate does not have a Find My Roommate profile.');
      } else {
        console.error('Error checking roommate profile status:', error);
        alert('Error checking roommate profile status. Please try again.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2>Select a Roommate to Review</h2>
      <select
        value={selectedRoommateEmail}
        onChange={(e) => setSelectedRoommateEmail(roommates[e.target.selectedIndex - 1])} // Map selection to the corresponding email
        className={styles.dropdown}
      >
        <option value="" disabled>
          Select a Roommate
        </option>
        {roommateUsernames.map((username, index) => (
          <option key={index} value={username}>
            {username}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit
      </button>
      <button className={styles.backButton} onClick={() => navigate('/virtual-room', { state: { email, hasRoom } })}>
        Back to Virtual Room
      </button>
    </div>
  );
};

export default SelectRoommatePage;