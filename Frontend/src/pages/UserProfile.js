import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/HomePage.module.css';

import { signOut } from '@aws-amplify/auth';

const UserProfile = ({ user, signOut }) => {
  const location = useLocation();
  const email = user?.signInDetails?.loginId;
  const navigate = useNavigate();
  const hasRoom = location.state?.hasRoom;

  const handleSignout = async () => {
    try {
      await signOut();

      // Redirect to landing page after successful logout
      navigate('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo2.png" alt="RoomHub Logo" onClick={() => navigate('/home', { state: { hasRoom, email } })} />
        </div>
      </header>

      <h1 className={styles.title}>User Profile for {email.split("@")[0]}</h1>
      <button className={styles.logout} onClick={handleSignout}>Log Out</button>
      <button className={styles.logout} onClick={() => navigate(-1, { state: { email, hasRoom } })}>Back to Previous Page</button>
      <button className={styles.logout} onClick={() => navigate('/home', { state: { email, hasRoom } })}>Back to Home</button>

    </div>
  );
};

export default UserProfile;
