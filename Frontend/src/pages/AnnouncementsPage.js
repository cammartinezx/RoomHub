import React,{useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'
import styles from '../styles/AnnouncementsPage.module.css';
import Header from '../Header';

const AnnouncementsPage = () => {
    const [customMessage, setCustomMessage] = useState('');
    const [selectedPreset, setSelectedPreset] = useState('');
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const hasRoom = location.state?.hasRoom;
    const email = location.state?.email;  // The current user's email

    
    const presetMessages = [
        'Lost keys',
        'Party tonight',
        'Wi-Fi down',
        'Water leak',
        'Maintenance required'
    ];

    const handlePresetClick = (preset) => {
        // Toggle the selected preset
        if (selectedPreset === preset) {
            setSelectedPreset('');  // Unselect the preset if it's clicked again
        } else {
            setSelectedPreset(preset);
            setCustomMessage('');  // Clear custom message when a preset is selected
        }
    };
    const handleSendAnnouncement = async () => {
        const messageToSend = selectedPreset || customMessage;

        if (!messageToSend) {
            setFeedback('Please select a preset or enter a custom message.');
            return;
        }

        try {
            const response = await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/notification/send-announcement', {
                from: email,
                message: messageToSend,
                type: 'announcement'
            });
            if (response.status === 200) {
                alert('Announcement sent successfully!');
                setFeedback('Announcement sent successfully!');
            } else {
                setFeedback('Failed to send the announcement.');
            }
        } catch (error) {
            console.error('Error sending announcement:', error);
            setFeedback('Error sending announcement. Try again later.');
        }
    };

    return (
        <div className={styles.container}>
            <Header email={email} hasRoom={hasRoom} />
            <h1>Send Announcements</h1>
            <div className={styles.presetContainer}>
                {presetMessages.map((preset, index) => (
                    <button
                        key={index}
                        onClick={() => handlePresetClick(preset)}
                        className={selectedPreset === preset ? styles.selected : styles.presetBtn}
                    >
                        {preset}
                    </button>
                ))}
            </div>

            <div className={styles.customMessage}>
                <input
                    type="text"
                    placeholder="Create custom announcement..."
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    disabled={!!selectedPreset}  // Disable if preset is selected
                />
            </div>

            <button onClick={handleSendAnnouncement} className={styles.sendBtn}>Send</button>
            <button className={styles.backButton} onClick={() => navigate('/virtual-room', { state: { email, hasRoom } })}>
                Back to Virtual Room
            </button>
            {feedback && <p>{feedback}</p>}
        </div>
    );
};

export default AnnouncementsPage;
