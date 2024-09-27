import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import VirtualRoomPage from './pages/VirtualRoomPage';
import SignUpPage from './pages/SignUpPage';
import AddRoommatePage from './pages/AddRoommatePage';
import NotificationsPage from './pages/NotificationsPage';



function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
        <Route path="/join-room" element={<JoinRoomPage />} />
        <Route path="/virtual-room" element={<VirtualRoomPage />} />
        <Route path="/add-roommate-page" element={<AddRoommatePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;

