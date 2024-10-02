import React, {useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { users } from '../mockDatabase';
import { getUserById } from '../mockApi';
import styles from '../styles/HomePage.module.css'; // Import the CSS module

const HomePage = ({ user }) => {
  console.log("HomePage received user:", user);
  const location = useLocation();
  const email = user?.signInDetails?.loginId; 
  console.log("User email is:", email);
  const hasRoom = !!getUserById(email).roomId;  // always check if user has room on this page
  const navigate = useNavigate()

  const handleFindRoomate = () =>{
    // currently unavailable
    alert('Feature currently unavailable')
  }

  useEffect(() => {
    console.log("HomePage received user:", user);
    if (!email) {
      console.error("Email not found in user object:", user);
    } else {
      console.log("Logged in user's email:", email);
    }
  }, [email, user]);

  if (!email) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Home Page for {email}</h1>
      {hasRoom ? (
        <>
          <button onClick={() => navigate('/virtual-room', { state: { hasRoom, email } })}>Go to Your Room</button>
          <button onClick={() => navigate('/notifications', { state: { email, hasRoom } })}>Notifications</button>
          <button onClick={handleFindRoomate}>Find Roommate Feature</button>
          <button onClick={() => navigate('/')}>Log Out</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate('/create-room', { state: { email, hasRoom } })}>Create Room</button>
          <button onClick={() => navigate('/join-room', { state: { email, hasRoom } })}>Join Room</button>
          <button onClick={() => navigate('/notifications', { state: { email, hasRoom } })}>Notifications</button>
          <button onClick={handleFindRoomate}>Find Roommate Feature</button>
          <button onClick={() => navigate('/')}>Log Out</button>
        </>
      )}
    </div>
  );
};

export default HomePage;
