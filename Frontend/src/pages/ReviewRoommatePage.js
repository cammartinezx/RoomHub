import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/ReviewRoommatePage.module.css';
import axios from 'axios';

const ReviewRoommatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const roommate = location.state?.selectedRoommate;
  const [review, setReview] = useState({
    cleanliness: 0,
    noise_levels: 0,
    respect: 0,
    communication: 0,
    paying_rent: 0,
    chores: 0,
    overall: 0,
  });

  const handleInputChange = (field, value) => {
    setReview((prevReview) => ({ ...prevReview, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/send-review`,
        {
          reviewed: roommate,
          ...review,
        }
      );

      navigate('/review-success', { state: { email } });
    } catch (error) {
      alert('Error submitting review.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Review Roommate</h2>
      {Object.keys(review).map((key) => (
        <div key={key} className={styles.ratingGroup}>
          <label>{key.replace('_', ' ')}:</label>
          <input
            type="number"
            min="1"
            max="5"
            value={review[key]}
            onChange={(e) => handleInputChange(key, parseInt(e.target.value, 10))}
          />
        </div>
      ))}
      <button onClick={handleSubmit} className={styles.submitButton}>
        Submit Review
      </button>
    </div>
  );
};

export default ReviewRoommatePage;
