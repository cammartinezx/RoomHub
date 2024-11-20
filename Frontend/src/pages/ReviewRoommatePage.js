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
    overall: '',
    cleanliness: '',
    noise_levels: '',
    respect: '',
    communication: '',
    paying_rent: '',
    chores: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    if (value >= 1 && value <= 5) {
      setReview((prevReview) => ({ ...prevReview, [field]: value }));
      setError(''); // Clear error if input is valid
    } else {
      setError('Ratings must be between 1 and 5.');
    }
  };

  const handleSubmit = async () => {
    // Check if all fields are filled
    const isValidReview = Object.values(review).every((val) => val >= 1 && val <= 5);

    if (!isValidReview) {
      setError('All ratings must be filled in and between 1 and 5.');
      return;
    }

    try {
      await axios.post(
        `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/send-review`,
        {
          reviewed_by: email,
          reviewed: roommate,
          overall: review.overall,
          cleanliness: review.cleanliness,
          noise_levels: review.noise_levels,
          respect: review.respect,
          communication: review.communication,
          paying_rent: review.paying_rent,
          chores: review.chores,
        }
      );

      // Navigate to success page after submission
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
  
      {/* Render review inputs */}
      {Object.entries(review).map(([key, value]) => (
        <div key={key} className={styles.reviewRoommateRatingGroup}>
          <label className={styles.reviewRoommateLabel}>
            {key.replace('_', ' ').toUpperCase()}:
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={value}
            onChange={(e) => handleInputChange(key, parseInt(e.target.value, 10))}
            className={styles.reviewRoommateInput}
            required
          />
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
