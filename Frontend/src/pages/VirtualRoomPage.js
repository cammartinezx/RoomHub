import React, {useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/HomePage.module.css';
import taskStyle from '../styles/ManageTasksPage.module.css'
import roomStyles from '../styles/VirtualRoomPage.module.css';
import Header from '../Header';
import axios from 'axios';
import { sendNotification } from '../services/notificationService';


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
    const [pendingTasks, setPendingTasks] = useState([]);
    // const [showRoommates, setShowRoommates] = useState(false);  // State to toggle showing roommates
    
    // const toggleRoommates = () => {
    //     setShowRoommates(!showRoommates);
    // };

    useEffect(() => {
      const checkRoomStatus = async () => {
        try {
          const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-room`);
          if (response.status === 200 && response.data.room_name && response.data.room_name !== 'NA') {
            setRoomName(response.data.room_name);
            setLoading(false);
          }
          else {
            // Redirect to home if the room is not found or the user is no longer in the room
            navigate('/home', { state: { email, hasRoom: false } });
          }
        } catch (error) {
          console.error("Error fetching room data", error);
        }
      };
  
      if (email) {
        checkRoomStatus();
        fetchPendingTasks();
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

      const fetchPendingTasks = async () => {
        try {
            const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/room/get-pending-tasks`, {
                params: { frm: email }
            });
            setPendingTasks(response.data.pending_tasks || []);
        } catch (error) {
            console.error("Error fetching pending tasks:", error);
        }
    };

    const toggleCompletion = async (taskId, completed, task) => {
        try {
            await axios.patch('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/task/mark-completed', { id: taskId, frm: email });
            sendNotification(email, `The task "${task.task_description}" has been marked as completed.`);
            fetchPendingTasks(); // Refresh the list after updating
        } catch (error) {
            console.error("Error marking task as completed:", error);
        }
    };

    const checkRoommates = async () => {
      try {
        const response = await axios.get(
          `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-user-roommates`
        );
    
        if (response.status === 200 && response.data.roommates?.length > 1) {
          const filteredRoommates = response.data.roommates.filter(
            (roommate) => roommate !== email
          );
          navigate('/select-roommate', { state: { hasRoom, roommates: filteredRoommates, email } });
        } else {
          navigate('/no-roommate', { state: { hasRoom, email } });
        }
      } catch (error) {
        console.error('Error fetching roommates:', error);
        navigate('/no-roommate', { state: { email } });
      }
    };
    

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div className={styles.container}>
        <Header email={email} hasRoom={hasRoom}/>
        <h2 className={styles.title}>{roomName}</h2>

        <div className={styles.reviewRoommateContainer}>
          <button className={styles.reviewRoommateButton} onClick= {checkRoommates}>
              Review Roommate
          </button>
        </div>

        <div className={roomStyles.mainContent}>
          {/* Left Side - Tasks */}
          <div className={taskStyle.taskList}>
            <h3>Pending Tasks</h3>
            {pendingTasks.length > 0 ? (
                <ul>
                    {pendingTasks.map((task) => (
                        <li key={task.task_id} className={taskStyle.taskItem}>
                            <div className={taskStyle.taskDetails}>
                                <span className={taskStyle.taskName}>{task.task_description}</span>
                                <span className={taskStyle.taskAssignee}>Assigned to: {task.asignee}</span>
                                <span className={taskStyle.taskDate}>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                            </div>
                            <div className={taskStyle.taskActions}>
                                <input
                                    type="checkbox"
                                    onChange={() => toggleCompletion(task.task_id, task.complete, task)}
                                    className={taskStyle.checkbox}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pending tasks right now.</p>
            )}
        </div>

          {/* Right Side - Shared Expenses */}
          <div className={roomStyles.expensesSection}>
            <h3>Shared Expenses</h3>
            <p>No expenses recorded yet.</p>
          </div>
        </div>


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
         
        <button className={styles.action} onClick={() => navigate('/home', { state: { hasRoom, email } })}>Back to Home</button>
      </div>
      );
};

export default VirtualRoomPage;

