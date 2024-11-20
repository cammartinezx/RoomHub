import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/FindRoommatePage.module.css';
import Header from '../Header';
import axios from 'axios';

const FindRoommatePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [noMoreUsers, setNoMoreUsers] = useState(false);
  const location = useLocation();
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-new-matches`
        );
        if (response.status === 200) {
          const fetchedProfiles = response.data.profiles;

          // Shuffle profiles to display them in a random order
          const shuffledProfiles = fetchedProfiles.sort(() => Math.random() - 0.5);
          setProfiles(shuffledProfiles);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        alert('Failed to fetch profiles. Please try again later.');
      }
    };

    fetchProfiles();
  }, [email]);

  const handleLike = () => {
    if (index < profiles.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoMoreUsers(true);
    }
  };

  const handleDislike = () => {
    if (index < profiles.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoMoreUsers(true);
    }
  };

  const currentUser = profiles[index];

  return (
    <div className={styles.container}>
      <Header email={email} hasRoom={hasRoom} />
      <h1>Find a Roommate</h1>
      {noMoreUsers || profiles.length === 0 ? (
        <div className={styles.endMessage}>
          <p>No more roommates available based on your current preferences.</p>
          <button onClick={() => window.location.reload()}>Reload Page with New Preferences</button>
        </div>
      ) : (
        <div className={styles.card}>
          <h2>{currentUser.first_name}, {new Date().getFullYear() - new Date(currentUser.dob).getFullYear()}</h2>
          <p>{currentUser.bio}</p>
          <div className={styles.tags}>
            {currentUser.tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.rating}>
            Rating: {currentUser.overall ? currentUser.overall.toFixed(1) : "N/A"}
            <div className={styles.ratingTooltip}>
              <p>Cleanliness: {currentUser.cleanliness || "N/A"}</p>
              <p>Noise Levels: {currentUser.noise_levels || "N/A"}</p>
              <p>Chores: {currentUser.chores || "N/A"}</p>
              <p>Communication: {currentUser.communication || "N/A"}</p>
              <p>Paying Rent: {currentUser.paying_rent || "N/A"}</p>
              <p>Respect: {currentUser.respect || "N/A"}</p>
            </div>
          </div>
          <div className={styles.buttons}>
            <button className={styles.actionButton} onClick={handleDislike}>❌ Dislike</button>
            <button className={styles.actionButton} onClick={handleLike}>✅ Like</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindRoommatePage;
