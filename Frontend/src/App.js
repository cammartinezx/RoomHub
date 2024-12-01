import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CreateRoomPage from './pages/CreateRoomPage';
import JoinRoomPage from './pages/JoinRoomPage';
import VirtualRoomPage from './pages/VirtualRoomPage';
import AddRoommatePage from './pages/AddRoommatePage';
import NotificationsPage from './pages/NotificationsPage';
import ManageTasksPage from './pages/ManageTasksPage';

// Amplify UI components
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from 'aws-amplify';

import axios from 'axios'
import UserProfile from './pages/UserProfile';
import ScrollToTop from './ScrollToTop';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ReviewRoommatePage from './pages/ReviewRoommatePage';
import FindRoommatePage from './pages/FindRoommatePage';
import WelcomeFindRoommate from './pages/WelcomeFindRoommate';
import NoRoommatePage from './pages/NoRoommatePage';
import SelectRoommatePage from './pages/SelectRoommatePage';
import ReviewSuccessPage from './pages/ReviewSuccessPage';
import IncompleteProfile from './pages/IncompleteProfile';
import SharedExpensesPage from './pages/SharedExpensesPage';
import CustomLogin from './pages/CustomLogin';
import CustomSignUp from './pages/CustomSignUp';
import VerificationCodePage from './pages/ConfirmSignUp';

function App() {
  // Function to handle adding the user to the mock database
  
  const handleUserSignIn = async (user) => {
    const email = user?.signInDetails?.loginId; // Extract user email from the Amplify user object

     // not really sure what this is doing right here- why would we try to add a new user on every request?
      // prolly if we had a check user exist path or something like that 
    // if (email) {
    //   try{
    //     // Send a POST request to add the user to the database
    //     const response = await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/add-user',{
    //       id: email,
    //       name: name,
    //     });

    //        console.log('User added successfully:', response.data);
    //   } catch (error) {
    //       console.error('Error while adding user:', error);
    //     }
    //   }
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
      <ScrollToTop/>
      <div className="App">
        <Routes>
          {/* Public Route - Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login Route */}
          {/* <Route path="/login" element={<LoginRedirect />} /> */}
          <Route path="/login" element={<CustomLogin/>}/>
          <Route path="/sign-up" element={<CustomSignUp/>}/>
          <Route path="/verify" element={<VerificationCodePage />}/>

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user); 
                  return <HomePage user={user} signOut ={signOut} />;
                }}
              </Authenticator>
            }
          />
            <Route
            path="/user-profile"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <UserProfile user={user} signOut={signOut} />;
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
          <Route
            path="/announcements"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <AnnouncementsPage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/tasks"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <ManageTasksPage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/review-roommate"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <ReviewRoommatePage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/find-roommate"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <FindRoommatePage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/welcome-find-roommate"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <WelcomeFindRoommate user={user} />;
                }}
              </Authenticator>
            }
          />
               <Route
            path="/no-roommate"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <NoRoommatePage user={user} />;
                }}
              </Authenticator>
            }
          />
               <Route
            path="/select-roommate"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <SelectRoommatePage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/review-success"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <ReviewSuccessPage user={user} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/incomplete-profile"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <IncompleteProfile user={user} signOut ={signOut} />;
                }}
              </Authenticator>
            }
          />
          <Route
            path="/shared-expenses"
            element={
              <Authenticator>
                {({ signOut, user }) => {
                  handleUserSignIn(user);
                  return <SharedExpensesPage user={user} />;
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
