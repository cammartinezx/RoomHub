import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/HomePage.module.css'; 
import Header from '../Header';
import { checkUserProfile } from '../services/profileService';

const HomePage = ({ user, signOut }) => {
  const [hasRoom, setHasRoom] = useState(false); // State to track if user has a room
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const email = user?.signInDetails?.loginId;
  const navigate = useNavigate();


  useEffect(() => {
    if (email) {
      axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-room`)
        .then((response) => {
          if (response.status === 200 && response.data.room_name!=='NA') {
            setHasRoom(true);
            setRoomName(response.data.room_name);
          } else {
            setHasRoom(false);
          }
        })
        .catch((error) => {
          console.error("Error checking room status:", error);
          setHasRoom(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [email]);

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




  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Header email={email} hasRoom={hasRoom} roomName={roomName} />
        {hasRoom ? (
          <>
          <div className={styles.cardGrid}>
            <div className={styles.card} onClick={() => navigate('/virtual-room', { state: { hasRoom, email } })}>
              <img src="bed.png" alt="Room" className={styles.cardImage}/>
              <h2>Go to Your Room</h2>
              <p>Access your virtual room</p>
              <button>Continue →</button>
            </div>
            <div className={styles.card} onClick={handleFindRoommate}>
              <img src="find_roommate.png" alt="Find Roommate" className={styles.cardImage}/>
              <h2>Find Roommate</h2>
              <p>Looking for the perfect roommate? Let us help you match with someone who fits your vibe.</p>
              <button>Continue →</button>
            </div>
          </div>
          </>
        ) : (
          <>
          <div className={styles.cardGrid}>
            <div className={styles.card} onClick={() => navigate('/create-room', { state: { email, hasRoom } })}>
              <img src="bed.png" alt="Create Room" className={styles.cardImage}/>
              <h2>Create Room</h2>
              <p>Start your journey by creating a new space just for you and your roommates. Personalize your room and make it your own.</p>
              <button>Continue →</button>
            </div>
            <div className={styles.card} onClick={() => navigate('/join-room', { state: { email, hasRoom } })}>
              <img src="find_room.png" alt="Join Room" className={styles.cardImage}/>
              <h2>Join Room</h2>
              <p>Already have a space? Easily join an existing room created by your roommates and stay connected.</p>
              <button>Continue →</button>
            </div>
            <div className={styles.card} onClick={handleFindRoommate}>
              <img src="find_roommate.png" alt="Find Roommate" className={styles.cardImage}/>
              <h2>Find Roommate</h2>
              <p>Looking for the perfect roommate? Let us help you match with someone who fits your vibe.</p>
              <button>Continue →</button>
            </div>
          </div>
          </>
        )}
        <button className={styles.logout} onClick={() => {
          signOut(); // This will log the user out of Cognito
          navigate('/'); // Then redirect to the landing page
        }}>Log Out</button>
    </div>
  );
};

export default HomePage;
