import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/NotificationsPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck} from '@fortawesome/free-solid-svg-icons';

const NotificationsPage = () => {
    const location = useLocation();
    const email = location.state?.email;
    const hasRoom = location.state?.hasRoom;
    const roomName = location.state?.roomName;
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch the user's notifications when the component loads
    useEffect(() => {
        if (email) {
            const fetchNotifications = async () => {
                try {
                    console.log('trying to fetch notifications')
                    const response = await axios.get(
                      `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-notification`
                    );

                    setNotifications(response.data.All_Notifications);
                } catch (error) {
                    setError('Error fetching notifications');
                }
            };
            fetchNotifications();
        }
    }, [email]);

    // Function to accept a room invite
    const handleAccept = async (notification) => {
        const from =notification.from;
        const id = notification.notification_id
        try {
            const response = await axios.post(
                'https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/room/add-roommate',
                {
                    existing_roommate: email,
                    new_roommate: from,
                    room_nm: roomName,
                    notification_id: id,
                }
            );

            if (response.status === 200) {
                // If the request is successful, mark the notification as accepted
                const updatedNotifications = notifications.map((n) =>
                    n.notification_id === id ? { ...n, status: 'accepted' } : n
                );              
                setNotifications(updatedNotifications);
                alert('User successfully added to your room!');
            } else {
                setError('Error: ' + response.data.message);
            }
        } catch (error) {
            console.log(error)
            if (error.response) {
                switch (error.response.status) {
                    case 404:
                        setError('Error: Room not found or user not found.');
                        break;
                    default:
                        setError('An unexpected error occurred.');
                }
            } else if (error.request) {
                setError('Error: No response from the server.');
            } else {
                setError('Error: Failed to send the request.');
            }
        }
    };

    // Function to delete a notification
    const handleDelete = async (notification) => {
        const id = notification.notification_id;
        const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(
                    `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/notification/${id}`
                );
                if (response.status === 200) {
                    setNotifications(notifications.filter((n) => n.notification_id !== id));
                    alert('Notification successfully deleted.');
                } else {
                    setError('Error: Could not delete the notification.');
                }
            } catch (error) {
                setError('Error deleting notification.');
            }
        }
    };

     // Function to navigate to the matched user's profile
     const handleViewProfile = (matchedUser) => {
        navigate('/user-profile', { state: { email, matchedUser, hasRoom } });
    };


    return (
        <div className={styles.container}>
          <div className={styles.notificationsContainer}>
            <h1>Notifications</h1>
      
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.notification_id}
                    className={
                      notification.type === 'match'
                        ? styles.matchNotificationCard
                        : styles.notificationCard
                    }
                  >
                    <div className={styles.notificationContent}>
                      <div className={styles.notificationDetails}>
                        <p className={styles.notificationType}>
                          {notification.type === 'join-request'
                            ? 'Join Request'
                            : notification.type === 'match'
                            ? '✨ Match'
                            : 'General Notification'}
                        </p>
                        <p className={styles.notificationMessage}>{notification.msg}</p>
                      </div>
                    </div>
                    <div className={styles.notificationActions}>
                      {notification.type === 'join-request' && notification.status !== 'accepted' && (
                        <button onClick={() => handleAccept(notification)} className={styles.acceptButton}>
                          <FontAwesomeIcon icon={faCheck} /> Accept
                        </button>
                      )}
                      {notification.type === 'match' && (
                        <button
                          onClick={() => handleViewProfile(notification.from)}
                          className={styles.viewProfileButton}
                        >
                          View Profile
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification)}
                        className={styles.deleteButton}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noNotifications}>No notifications available.</p>
            )}
      
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>
      );
      
};

export default NotificationsPage;
