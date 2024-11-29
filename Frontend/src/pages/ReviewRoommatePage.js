import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/ReviewRoommatePage.module.css';
import axios from 'axios';

const ReviewRoommatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;
  const roommate = location.state?.selectedRoommate;

  const [review, setReview] = useState({
    overall: 3,
    cleanliness: 3,
    noise_levels: 3,
    respect: 3,
    communication: 3,
    paying_rent: 3,
    chores: 3,
  });

  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setReview((prevReview) => ({ ...prevReview, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/send-review`,
        {
          reviewed_by: email,
          reviewed: roommate,
          ...review,
        }
      );
      navigate('/review-success', { state: { hasRoom, email } });
    } catch (error) {
      setError('Error submitting review. Please try again later.');
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className={styles.reviewRoommateContainer}>
      <h2 className={styles.reviewRoommateHeader}>Review Roommate</h2>
      {roommate && (
        <p className={styles.reviewRoommateParagraph}>
          You're reviewing: <strong>{roommate}</strong>
        </p>
      )}

      {/* Render review sliders */}
      {Object.entries(review).map(([key, value]) => (
        <div key={key} className={styles.reviewRoommateRatingGroup}>
          <label className={styles.reviewRoommateLabel}>
            {key.replace('_', ' ').toUpperCase()}:
          </label>
          <div className={styles.sliderContainer}>
            <input
              type="range"
              min="1"
              max="5"
              value={value}
              step="1"
              onChange={(e) => handleInputChange(key, parseInt(e.target.value, 10))}
              className={styles.reviewRoommateSlider}
            />
            <div className={styles.sliderLabels}>
              <span>1</span>
              <span>5</span>
            </div>
          </div>
        </div>
      ))}

      {/* Display error message if any */}
      {error && <p className={styles.reviewRoommateError}>{error}</p>}

      <button onClick={handleSubmit} className={styles.reviewRoommateSubmitButton}>
        Submit Review
      </button>
    </div>
  );
};

export default ReviewRoommatePage;
