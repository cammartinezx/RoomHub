import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/FindRoommatePage.module.css';
import Header from '../Header';

const mockUsers = [
  { name: 'Alice', description: 'Enjoys cooking and hiking', rating: 4.5 },
  { name: 'Bob', description: 'Loves gaming and technology', rating: 3.8 },
  { name: 'Charlie', description: 'Music enthusiast and night owl', rating: 4.2 },
];

const FindRoommatePage = () => {
  const [index, setIndex] = useState(0); // Track current user card
  const [noMoreUsers, setNoMoreUsers] = useState(false); // Track if we've reached the end
  const location = useLocation();
  const hasRoom = location.state?.hasRoom;
  const email = location.state?.email;

  const handleLike = () => {
    // Move to the next user or show "no more users" message
    if (index < mockUsers.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoMoreUsers(true);
    }
  };

  const handleDislike = () => {
    // Move to the next user or show "no more users" message
    if (index < mockUsers.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setNoMoreUsers(true);
    }
  };

  // Get the current user info or show a final message
  const currentUser = mockUsers[index];

  return (
    <div className={styles.container}>
    <Header email={email} hasRoom={hasRoom}/>
      <h1>Find a Roommate</h1>
      {noMoreUsers ? (
        <div className={styles.endMessage}>
          <p>No more roommates available based on your current preferences.</p>
          <button onClick={() => window.location.reload()}>Reload Page with New Preferences</button>
        </div>
      ) : (
        <div className={styles.card}>
          <h2>{currentUser.name}</h2>
          <p>{currentUser.description}</p>
          <p>Rating: {currentUser.rating.toFixed(1)}</p>
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
