import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getNotificationsByUserId } from './mockApi';

import styles from './styles/Header.module.css';
const Header = ({ email, hasRoom }) => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();

  // Fetch notifications to check if there are unread ones
  useEffect(() => {
    const notifications = getNotificationsByUserId(email);
    const hasUnread = notifications.some(notification => notification.status === 'unread');
    setHasUnreadNotifications(hasUnread);
  }, [email]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo2.png" alt="RoomHub Logo" />
      </div>
      <div className={styles.icons}>
        <div className={styles.notificationWrapper}>
          <FontAwesomeIcon 
            icon={faBell} 
            className={styles.icon} 
            onClick={() => navigate('/notifications', { state: { email, hasRoom } })}
          />
          {hasUnreadNotifications && <span className={styles.redDot}></span>}
        </div>
        <FontAwesomeIcon 
          icon={faUser}
          className={styles.icon}
          onClick={() => navigate('/user-profile', { state: { email, hasRoom } })}
        />
      </div>
    </header>
  );
};

export default Header;
