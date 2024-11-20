import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/SelectRoommatePage.module.css';

const SelectRoommatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roommates = location.state?.roommates || [];
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;
  const [selectedRoommate, setSelectedRoommate] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.get(
        `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${selectedRoommate}/find-roommate-page`
      );

      if (response.status === 200) {
        navigate('/review-roommate', { state: { hasRoom, selectedRoommate, email } });
      } else {
        alert('This roommate does not have a Find My Roommate profile.');
      }
    } catch (error) {
      alert('Error checking roommate profile status.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Select a Roommate to Review</h2>
      <select
        value={selectedRoommate}
        onChange={(e) => setSelectedRoommate(e.target.value)}
        className={styles.dropdown}
      >
        <option value="" disabled>
          Select a Roommate
        </option>
        {roommates.map((roommate) => (
          <option key={roommate} value={roommate}>
            {roommate}
          </option>
        ))}
      </select>
      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit
      </button>
    </div>
  );
};

export default SelectRoommatePage;
