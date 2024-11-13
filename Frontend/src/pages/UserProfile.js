import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/UserProfile.module.css'; // We'll create this new CSS file for full-page styling

const UserProfile = ({ user, signOut }) => {
  const location = useLocation();
  const email = user?.signInDetails?.loginId;
  const navigate = useNavigate();
  const hasRoom = location.state?.hasRoom;

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('');
  const [hasPets, setHasPets] = useState(false);
  const [smokes, setSmokes] = useState(false);

  // Placeholder for user tags
  const tags = [
    gender ? gender : 'Not specified',
    hasPets ? 'Has pets' : 'No pets',
    smokes ? 'Smoker' : 'Non-smoker'
  ];

  // Load user profile data (placeholder, fetch from backend in real use)
  useEffect(() => {
    // Example: Fetch user data here
    // setDescription("User's current description");
    // setGender("Male");
    // setHasPets(true);
    // setSmokes(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(false);

    // Update user profile in backend (uncomment and add endpoint)
    // try {
    //   const response = await axios.put(`https://your-api-endpoint.com/user/${email}/profile`, {
    //     description,
    //     gender,
    //     hasPets,
    //     smokes,
    //   });
    //   if (response.status === 200) {
    //     alert('Profile updated successfully');
    //   }
    // } catch (error) {
    //   console.error('Error updating profile:', error);
    // }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo2.png" alt="RoomHub Logo" onClick={() => navigate('/home', { state: { hasRoom, email } })} />
        </div>
      </header>

      <div className={styles.profileContent}>
        <h1>User Profile for {email}</h1>

        {!isEditing ? (
          // Display Mode
          <div className={styles.profileDetails}>
            <p className={styles.description}>{description || 'No description provided.'}</p>

            <div className={styles.tags}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            <button className={styles.editButton} onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className={styles.editForm}>
            <label>
              Description:
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about yourself"
                rows="4"
              />
            </label>

            <label>
              Gender:
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </label>


            <label>
              Do you have Pets?
              <select value={hasPets} onChange={(e) => setHasPets(e.target.value === 'true')}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>

            <label>
              Do you smoke?
              <select value={smokes} onChange={(e) => setSmokes(e.target.value === 'true')}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>


            <button type="submit" className={styles.updateButton}>
              Save Changes
            </button>
            <button type="button" className={styles.cancelButton} onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        )}

        <button className={styles.backButton} onClick={() => navigate('/home', { state: { email, hasRoom } })}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
