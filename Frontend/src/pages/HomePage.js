import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserById } from '../mockApi';
import styles from '../styles/HomePage.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header';

const HomePage = ({ user }) => {
  const location = useLocation();
  const email = user?.signInDetails?.loginId;
  const hasRoom = !!getUserById(email).roomId;
  const navigate = useNavigate();

  const handleFindRoommate = () => {
    alert('Feature currently unavailable');
  };

  useEffect(() => {
    if (!email) {
      console.error("Email not found in user object:", user);
    }
  }, [email, user]);

  if (!email) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Header email={email} hasRoom={hasRoom} />
        {/* <h1 className={styles.title}>Home Page for {email}</h1> */}
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
              <p>Looking for the perfect roommate? Let us help you match with someone who fits your lifestyle and preferences.</p>
              <button style={{ backgroundColor: "gray" }}>Continue →</button>
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
              <p>Looking for the perfect roommate? Let us help you match with someone who fits your lifestyle and preferences.</p>
              <button style={{ backgroundColor: "gray" }}>Continue →</button>
            </div>
          </div>
          </>
        )}
        <button className={styles.logout} onClick={() => navigate('/')}>Log Out</button>
    </div>
  );
};

export default HomePage;
