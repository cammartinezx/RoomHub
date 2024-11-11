import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ReviewRoommatePage.module.css';

const ReviewRoommatePage = ({ email }) => {
    const [roommates, setRoommates] = useState([]);
    const [selectedRoommate, setSelectedRoommate] = useState('');
    const [cleanliness, setCleanliness] = useState(0);
    const [loudness, setLoudness] = useState(0);
    const [taskCompletion, setTaskCompletion] = useState(0);
    const [overall, setOverall] = useState(0);
    const [additionalFeedback, setAdditionalFeedback] = useState("");

    // Fetch the list of roommates on component mount
    useEffect(() => {
        const fetchRoommates = async () => {
            try {
                const response = await axios.get(`https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/get-user-roommates`);
                console.log(response.data.users)
                if (response.status === 200 && response.data.roommates) {
                    console.log(response.data)
                    setRoommates(response.data.roommates); // Set roommates in the state
                }
            } catch (error) {
                console.error("Error fetching roommates:", error.message);
            }
        };
        fetchRoommates();
    }, [email]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedRoommate) {
            alert('Please select a roommate to rate.');
            return;
        }
        
        const reviewData = {
            roommate: selectedRoommate,
            cleanliness,
            loudness,
            taskCompletion,
            overall,
            additionalFeedback
        };

        console.log('Submitted review:', reviewData);
        // Here you would make a POST request to your API to submit the review data
    };

    return (
        <div className={styles.container}>
            <h2>Rate Your Roommate</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Roommate Selection Dropdown */}
                <div className={styles.selectContainer}>
                    <label htmlFor="roommate">Select Roommate</label>
                    <select 
                        id="roommate"
                        value={selectedRoommate}
                        onChange={(e) => setSelectedRoommate(e.target.value)}
                    >
                        <option value="">-- Choose a Roommate --</option>
                        {roommates.map((roommate) => (
                            <option key={roommate} value={roommate}>{roommate}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.sliderContainer}>
                    <label>Cleanliness</label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        value={cleanliness}
                        onChange={(e) => setCleanliness(e.target.value)}
                    />
                    <span>{cleanliness}</span>
                </div>

                <div className={styles.sliderContainer}>
                    <label>Loudness</label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        value={loudness}
                        onChange={(e) => setLoudness(e.target.value)}
                    />
                    <span>{loudness}</span>
                </div>

                <div className={styles.sliderContainer}>
                    <label>Task Completion</label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        value={taskCompletion}
                        onChange={(e) => setTaskCompletion(e.target.value)}
                    />
                    <span>{taskCompletion}</span>
                </div>

                <div className={styles.sliderContainer}>
                    <label>Overall</label>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        value={overall}
                        onChange={(e) => setOverall(e.target.value)}
                    />
                    <span>{overall}</span>
                </div>

                <div className={styles.textareaContainer}>
                    <label>Additional Feedback</label>
                    <textarea
                        value={additionalFeedback}
                        onChange={(e) => setAdditionalFeedback(e.target.value)}
                        placeholder="How would you describe living with this roommate?"
                    ></textarea>
                </div>

                <button type="submit" className={styles.submitButton}>Submit Review</button>
            </form>
        </div>
    );
};

export default ReviewRoommatePage;
