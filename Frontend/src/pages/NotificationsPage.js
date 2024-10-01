import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNotificationsByUserId, addMemberToRoom, markNotificationAsRead } from '../mockApi';  // Import relevant functions

const NotificationsPage = () => {
    const location = useLocation();
    const email = location.state?.email;  // Get the email of the logged-in user
    const hasRoom = location.state?.hasRoom;
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    // Fetch the user's notifications when the component loads
    useEffect(() => {
        if (email) {
            const userNotifications = getNotificationsByUserId(email);
            setNotifications(userNotifications);
        }
    }, [email]);

    // Function to accept a room invite
    const handleAcceptInvite = (notification) => {
        const roomId = notification.roomId;  

        // Add the user to the room's member list
        addMemberToRoom(roomId, email);

        // Mark the notification as read or accepted
        markNotificationAsRead(notification.id);

        // Refresh the notifications list
        const updatedNotifications = notifications.map((n) => 
            n.id === notification.id ? { ...n, status: 'accepted' } : n
        );
        setNotifications(updatedNotifications);
        alert('You have successfully joined the room!');
    };

    return (
        <div>
            <h1>Notifications for {email}</h1>

            {notifications.length > 0 ? (
                <ul>
                    {notifications.map((notification) => (
                        <li key={notification.id}>
                            {notification.msg} - {notification.status}
                            {notification.type === 'invite' && notification.status !== 'accepted' && (
                                <button onClick={() => handleAcceptInvite(notification)}>
                                    Accept
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No notifications available.</p>
            )}

            <button onClick={() => navigate('/home', { state: { email, hasRoom } })}>Back to Home</button>
        </div>
    );
};

export default NotificationsPage;
