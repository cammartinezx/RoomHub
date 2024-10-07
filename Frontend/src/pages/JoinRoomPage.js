import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserById, addNotification } from '../mockApi';
import styles from '../styles/JoinRoomPage.module.css'; 

const JoinRoomPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;  // The current user's email
    const [ownerEmail, setOwnerEmail] = useState('');  // To capture the room owner's email
    const [error, setError] = useState('');

    // Function to handle input change
    const handleEmailChange = (event) => {
        setOwnerEmail(event.target.value);
    };

    // Function to handle the join request submission
    const handleSubmit = (event) => {
        event.preventDefault();  

        const roomMember = getUserById(ownerEmail);  // Check if the room member exists

        if (!roomMember) {
            // If the room member doesn't exist, show an error
            setError('This room member does not exist.');
            return;
        }

        if (!roomMember.roomId) {
            // If the room member doesn't belong to any room, show an error
            setError('This room member is not part of any room.');
            return;
        }

        // If everything is fine, send a notification to the room member
        addNotification(ownerEmail, `Join room request from ${email}`, email, 'request');
        alert(`Your request has been sent to ${ownerEmail}`);

        // Reset the input field and error
        setOwnerEmail('');
        setError('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h1>Join Room</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="ownerEmail">Room Member's Email:</label>
                    <input 
                        type="email" 
                        name="ownerEmail" 
                        value={ownerEmail}
                        onChange={handleEmailChange}
                        required 
                    />
                    <button type="submit">Request to Join</button>
                </form>

                {/* Display error message if any */}
                {error && <p className={styles.error}>{error}</p>}

                <button className={styles.backButton} onClick={() => navigate('/home', { state: { email } })}>Back to Home</button>
            </div>
        </div>
    );
};

export default JoinRoomPage;
