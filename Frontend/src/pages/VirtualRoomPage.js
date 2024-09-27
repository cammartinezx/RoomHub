import React, {useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRoomByUser, getRoomName } from '../mockApi';

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
        <div>
        <h1>Your Virtual Room</h1>
        <h1>Room Name: {roomName}</h1>
        {/* This is where room details will go */}
        <p>Virtual Room stuff here</p>
        <button onClick={() => navigate('/add-roommate-page', { state: { hasRoom, email }})}>Add Roomate</button>
        {/* Navigating to home with hasRoom state true to simulate the backend knowing that the user now has a room */}
        
        {/* Button to show/hide list of roommates */}
        <button onClick={toggleRoommates}>
                {showRoommates ? 'Hide Roommates' : 'Show Roommates'}
            </button>

            {/* Conditionally render the list of roommates */}
            {showRoommates && (
                <div>
                    <h2>Roommates:</h2>
                    <ul>
                        {room.members.map((member, index) => (
                            <li key={index}>{member}</li>
                        ))}
                    </ul>
                </div>
            )}

            
        <button onClick={() => navigate('/home',{ state: { hasRoom, email } })}>Back to Home</button>
        <button onClick={() => navigate('/')}>Log Out</button>
        </div>
    );
};

export default VirtualRoomPage;

