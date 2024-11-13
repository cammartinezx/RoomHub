// WelcomeFindRoommate.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/WelcomeFindRoommate.module.css';

const WelcomeFindRoommate = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (step === 1 && firstName && lastName) {
      setStep(2);
    } else if (step === 2 && age) {
      // Mock backend submission
      console.log('Submitting profile data:', { firstName, lastName, age });
      
      // TODO: Integrate with backend
      // axios.post('/api/user/profile', { firstName, lastName, age })
      //   .then(response => navigate('/find-roommate'))
      //   .catch(error => console.error('Error submitting profile data', error));

      navigate('/find-roommate'); // Navigate to Find Roommate cards
    }
  };

  return (
    <div className={styles.container}>
      {step === 1 ? (
        <div className={styles.formStep}>
          <h2>Welcome to Find My Roommate</h2>
          <p>Let's start by getting to know you.</p>
          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              required
            />
          </label>
          <button onClick={handleNextStep} className={styles.nextButton}>
            Next
          </button>
        </div>
      ) : (
        <div className={styles.formStep}>
          <h2>Almost Done!</h2>
          <p>Just one more thing, please enter your age.</p>
          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              required
            />
          </label>
          <button onClick={handleNextStep} className={styles.nextButton}>
            Finish
          </button>
        </div>
      )}
    </div>
  );
};

export default WelcomeFindRoommate;
