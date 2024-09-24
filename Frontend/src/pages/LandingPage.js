<<<<<<< HEAD
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';


const LandingPage = () =>{
    const navigate = useNavigate();

    return (
        <div>
          <h1>Welcome To RoomHub</h1>
          <button onClick={() => navigate('/login')}>Log In To Get Started</button>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
    );
}

=======
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';


const LandingPage = () =>{
    const navigate = useNavigate();

    return (
        <div>
          <h1>Welcome To RoomHub</h1>
          <button onClick={() => navigate('/login')}>Log In To Get Started</button>
          <p>
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
    );
}

>>>>>>> 1f09ebd1cef8a0aac90daf31f606826e755f479f
export default LandingPage;