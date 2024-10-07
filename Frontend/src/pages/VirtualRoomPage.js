import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoomByUser, getRoomName } from '../mockApi';
import styles from '../styles/HomePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const VirtualRoomPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const hasRoom = location.state?.hasRoom;
    const email = location.state?.email;
    const room = getRoomByUser(email);
    const roomName = getRoomName(room.roomId);

    const [showRoommates, setShowRoommates] = useState(false);  // State to toggle showing roommates
    
    const toggleRoommates = () => {
        setShowRoommates(!showRoommates);
    };

    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="RoomHub Logo" />
          </div>
          <div className={styles.icons}>
            <FontAwesomeIcon 
              icon={faBell} 
              className={styles.icon} 
              onClick={() => navigate('/notifications', { state: { email, hasRoom } })}  
            />
            <FontAwesomeIcon 
              icon={faUser}
              className={styles.icon}
              onClick={() => navigate('/user-profile', { state: { email, hasRoom } })}
            />
          </div>
        </header>
        <h2 className={styles.title}>{roomName}</h2>
        <div className={styles.cardGrid}>
          <div className={styles.card} onClick={() => navigate('/add-roommate-page', { state: { hasRoom, email } })}>
            <img src="find_roommate.png" alt="Room" className={styles.cardImage}/>
            <h2>Add new roomate</h2>
            <p>Add someone to your room</p>
            <button onClick={() => navigate('/add-roommate-page', { state: { hasRoom, email }})}>Add Roommate</button>
          </div>
        </div>

        <button onClick={toggleRoommates} className={styles.action}>
          {showRoommates ? 'Hide Roommates' : 'Show Roommates'}
        </button>

        {showRoommates && (
          <div className={styles.roommatesList}>
             <h2>Roommates:</h2>
            <ul>
              {room.members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          </div>
        )}
         
        <button className={styles.action} onClick={() => navigate('/home', { state: { hasRoom, email } })}>Back to Home</button>
      </div>
      );
};

export default VirtualRoomPage;

