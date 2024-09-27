import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserById, addNotification, getRoomByUser } from '../mockApi';  

const AddRoommatePage = () => {
    const [roommateEmail, setRoommateEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const hasRoom = location.state?.hasRoom;

    // Function to handle input change
    const handleEmailChange = (event) => {
        setRoommateEmail(event.target.value);  
    };

    // Function to handle the request to add a roommate
    const handleSendRequest = () => {
        const roommate = getUserById(roommateEmail);  // Check if the user exists

        if (!roommate) {
            // If the user doesn't exist, show an error
            setError('This user does not exist.');
            return;
        }

        if (roommate.roomId) {
            // If the user already has a room, show an error
            setError('This user is already part of another room.');
            return;
        }

        // If everything is fine, send a request (create a notification)
        addNotification(roommateEmail, 'You have a new room request from ' + email, email, 'invite',getUserById(email).roomId);
        alert('Request sent to ' + roommateEmail);

        setError('');  // Clear any previous errors
        setRoommateEmail('');  // Clear the input field
    };

    return (
        <div>
            <h1>Add New Roommate</h1>

            {/* Input field for roommate's email */}
            <label htmlFor="roommateEmail">Roommate's Email:</label>
            <input
                type="email"
                id="roommateEmail"
                name="roommateEmail"
                value={roommateEmail}
                onChange={handleEmailChange}
                required
            />
            
            <button onClick={handleSendRequest}>Send Request</button>

            {/* Display error message if any */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={() => navigate('/virtual-room', { state: { hasRoom, email } })}>Back to Room</button>
        </div>
    );
};

export default AddRoommatePage;
