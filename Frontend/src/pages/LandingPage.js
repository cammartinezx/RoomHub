import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';


const LandingPage = () =>{
    const navigate = useNavigate();

    return (
        <div>
          <h1>Welcome To RoomHub</h1>
          <button onClick={() => navigate('/login')}>Log In To Get Started</button>
        </div>
    );
}

export default LandingPage;