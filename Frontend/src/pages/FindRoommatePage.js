import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/FindRoommatePage.module.css';
import Header from '../Header';

const mockUsers = [
  { 
    name: 'Alice', 
    description: 'Enjoys cooking and hiking', 
    rating: 4.5, 
    cleanScore: 4, 
    loudScore: 3, 
    tasksScore: 5, 
    tags: ['No pets', 'Non-smoker', 'Female'], 
    age: 26 
  },
  { 
    name: 'Bob', 
    description: 'Loves gaming and technology', 
    rating: 3.8, 
    cleanScore: 3, 
    loudScore: 4, 
    tasksScore: 3, 
    tags: ['Has pets', 'Smoker', 'Male'], 
    age: 29 
  },
  { 
    name: 'Charlie', 
    description: 'Music enthusiast and night owl', 
    rating: 4.2, 
    cleanScore: 5, 
    loudScore: 2, 
    tasksScore: 4, 
    tags: ['No pets', 'Non-smoker', 'Male'], 
    age: 25 
  },
];

const FindRoommatePage = () => {
  const [index, setIndex] = useState(0);
  const [noMoreUsers, setNoMoreUsers] = useState(false);
  const location = useLocation();
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;

  const handleLike = () => {
    if (index < mockUsers.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoMoreUsers(true);
    }
  };

  const handleDislike = () => {
    if (index < mockUsers.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoMoreUsers(true);
    }
  };

  const currentUser = mockUsers[index];

  return (
    <div className={styles.container}>
      <Header email={email} hasRoom={hasRoom} />
      <h1>Find a Roommate</h1>
      {noMoreUsers ? (
        <div className={styles.endMessage}>
          <p>No more roommates available based on your current preferences.</p>
          <button onClick={() => window.location.reload()}>Reload Page with New Preferences</button>
        </div>
      ) : (
        <div className={styles.card}>
          <h2>{currentUser.name}, {currentUser.age}</h2>
          <p>{currentUser.description}</p>
          <div className={styles.tags}>
            {currentUser.tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.rating}> 
           
            Rating: {currentUser.rating.toFixed(1)}
            <div className={styles.ratingTooltip}>
              <p>Clean: {currentUser.cleanScore}</p>
              <p>Loud: {currentUser.loudScore}</p>
              <p>Does Tasks: {currentUser.tasksScore}</p>
            </div>
          </div>
          <div className={styles.buttons}>
            <button onClick={handleDislike}>❌ Dislike</button>
            <button onClick={handleLike}>✅ Like</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindRoommatePage;
