import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import VirtualRoomPage from './pages/VirtualRoomPage';
import AddRoommatePage from './pages/AddRoommatePage';
import NotificationsPage from './pages/NotificationsPage';

// Amplify UI components
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Import your mock API
import { addUser, getUserById } from './mockApi';

function App() {
  // Function to handle adding the user to the mock database
  const handleUserSignIn = (user) => {
    const email = user?.signInDetails?.loginId; // Extract user email from the Amplify user object

    if (email && !getUserById(email)) {
      console.log(`User with email ${email} not found in mock database. Adding user...`);
      addUser(email);  // Add user to the mock database
    }
  };

  // Component to handle login and redirection to /home
  const LoginRedirect = () => {
    const navigate = useNavigate();

    return (
      <div className="centered-auth">
        <Authenticator>
          {({ signOut, user }) => {
            console.log("User object from Authenticator:", user);
            handleUserSignIn(user);
            
            // Redirect to /home after login
            if (user) {
              navigate('/home');
            }

            return null; // Return null since the redirect will handle the navigation
          }}
        </Authenticator>
      </div>
    );
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route - Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login Route */}
          <Route path="/login" element={<LoginRedirect />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);  // Ensure that the user is added to the mock database when they access the home page
                  return <HomePage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/create-room"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <CreateRoomPage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/join-room"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <JoinRoomPage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/virtual-room"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <VirtualRoomPage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/add-roommate-page"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <AddRoommatePage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/notifications"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <NotificationsPage user={user} />;
                }}
              </Authenticator>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
