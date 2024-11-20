import axios from 'axios';

export const sendNotification = async (email, message) => {
    try {
        const response = await axios.post('https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/notification/send-announcement', {
            from: email,
            message: message,
            type: 'announcement',
        });
        if (response.status === 200) {
            console.log('Notification sent successfully.');
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};
