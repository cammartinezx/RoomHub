import React,{useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createRoom } from '../mockApi';

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
    <div>
        <h1>Create Room</h1>
        <form>
        <label htmlFor="email">Room Name:</label>
          <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
          />
        <button type="submit" onClick={handleSubmit}>Create Room</button>
        </form>
        <button onClick={() => navigate('/home',{ state: { email, hasRoom: true } })}>Back to Home</button>
    </div>
    );
};

export default CreateRoomPage;
