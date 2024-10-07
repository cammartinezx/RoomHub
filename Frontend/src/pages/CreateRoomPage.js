import React,{useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createRoom } from '../mockApi';
import styles from '../styles/CreateRoomPage.module.css';

const CreateRoomPage = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const hasRoom = location.state?.hasRoom; // Check if the user has a room
    const email = location.state?.email;
    const[name, setName] = useState('');

    // Function to handle input change
    const handleNameChange = (event) => {
        setName(event.target.value);
      };

    const handleSubmit = () =>{
        // add room to users database
        createRoom(email,name);
        alert('Your room has been created')
        navigate('/virtual-room', { state: { email, hasRoom: true } }) // user now has a room
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Create Room</h1>
                <form>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Room Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                            required
                        />
                    </div>
                    <button type="button" onClick={handleSubmit}>Create Room</button>
                </form>
                <button className={styles.backButton} onClick={() => navigate('/home', { state: { email, hasRoom: true } })}>Back to Home</button>
            </div>
        </div>
    );
};

export default CreateRoomPage;
