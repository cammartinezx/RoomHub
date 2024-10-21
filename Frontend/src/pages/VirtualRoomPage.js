import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoomByUser, getRoomName } from '../mockApi';
import styles from '../styles/HomePage.module.css';
import roomStyles from '../styles/VirtualRoomPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header';
import axios from 'axios';

const VirtualRoomPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const hasRoom = location.state?.hasRoom;
    const email = location.state?.email;
    const [roomName, setRoomName] = useState('')
    const [loading, setLoading] = useState(true);
    const [showLeavePopup, setShowLeavePopup] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [error, setError] = useState('');

    // const [showRoommates, setShowRoommates] = useState(false);  // State to toggle showing roommates
    
    // const toggleRoommates = () => {
    //     setShowRoommates(!showRoommates);
    // };

    useEffect(() => {
      const checkRoomStatus = async () => {
        try {
          const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-room`);
          if (response.status === 200 && response.data.room_name) {
            setRoomName(response.data.room_name);
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching room data", error);
        }
      };
  
      if (email) {
        checkRoomStatus();
        
      }
    }, [email]);

    // Function to fetch the leave warning
    const fetchLeaveWarning = async () => {
      try {
        const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/leave-warning`);
        if (response.status === 200) {
          setWarningMessage(response.data.message);
          setShowLeavePopup(true);  // Show the popup with the warning message
        }
      } catch (error) {
        setError('Error fetching the warning message.');
      }
    };

    // Function to leave the room
    const handleLeaveRoom = async () => {
      try {
        const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/leave-room`);
        if (response.status === 200) {
          alert('You have successfully left the room.');
          navigate('/home', { state: { hasRoom: false, email } }); // Redirect to home
        }
      } catch (error) {
        setError('Error leaving the room.');
      }
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className={styles.container}>
        <Header email={email} hasRoom={hasRoom} />
        <h2 className={styles.title}>{roomName}</h2>
        <div className={styles.cardGrid}>

          <div className={styles.card} onClick={() => navigate('/announcements', { state: { hasRoom, email } })}>
            <img src="announce.png" alt="Room" className={styles.cardImage}/>
            <h2>Send Announcement</h2>
            <p>Send announcemets to all roomates</p>
            <button onClick={() => navigate('/announcements', { state: { hasRoom, email }})}>Send Announcement</button>
          </div>

          <div className={styles.card} onClick={() => navigate('/tasks', { state: { hasRoom, email } })}>
            <img src="task.png" alt="Room" className={styles.cardImage}/>
            <h2>Manage Tasks</h2>
            <p>View and create tasks for your room</p>
            <button onClick={() => navigate('/tasks', { state: { hasRoom, email }})}>Go to Tasks</button>
          </div>


          <div className={styles.card} onClick={fetchLeaveWarning}>
            <img src="leave.png" alt="Room" className={styles.cardImage}/>
            <h2>Leave Room</h2>
            <p>Leave the current room</p>
            <button onClick={fetchLeaveWarning}>Leave Room</button>
          </div>

          <div className={styles.card} onClick={() => navigate('/add-roommate-page', { state: { hasRoom, email } })}>
            <img src="find_roommate.png" alt="Room" className={styles.cardImage}/>
            <h2>Add new roomate</h2>
            <p>Add someone to your room</p>
            <button onClick={() => navigate('/add-roommate-page', { state: { hasRoom, email }})}>Add Roommate</button>
          </div>

        </div>

          {/* Leave Room Popup Confirmation */}
        {showLeavePopup && (
          <div className={roomStyles.popup}>
            <p>{warningMessage}</p>
            <button className={roomStyles.confirmButton} onClick={handleLeaveRoom}>Yes, Leave Room</button>
            <button className={roomStyles.cancelButton} onClick={() => setShowLeavePopup(false)}>Cancel</button>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}

        {/* <button onClick={toggleRoommates} className={styles.action}>
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
        )} */}
         
        <button className={styles.action} onClick={() => navigate('/home', { state: { hasRoom, email } })}>Back to Home</button>
      </div>
      );
};

export default VirtualRoomPage;

