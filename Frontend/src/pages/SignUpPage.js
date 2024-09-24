<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const navigate = useNavigate();

    const handleSignUp = () =>{
        navigate('/home', { state: { hasRoom: false } }) // user automaically has no room
    }

    return (
        <div>
        <h1>Sign Up Page</h1>
        <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUpPage;
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const navigate = useNavigate();

    const handleSignUp = () =>{
        navigate('/home', { state: { hasRoom: false } }) // user automaically has no room
    }

    return (
        <div>
        <h1>Sign Up Page</h1>
        <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUpPage;
>>>>>>> 1f09ebd1cef8a0aac90daf31f606826e755f479f
