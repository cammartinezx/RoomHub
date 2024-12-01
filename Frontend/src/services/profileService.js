import axios from 'axios';

/**
 * Check if the user's profile exists using the find-roommate-page API endpoint.
 * @param {string} email - The user's email ID.
 * @returns {Promise<boolean>} - Returns `true` if the profile exists, otherwise `false`.
 * @throws {Error} - Throws an error if the API call fails or the server responds with an unexpected error.
 */
export const checkUserProfile = async (email) => {
    try {
        const response = await axios.get(
            `https://7hm4udd9s2.execute-api.ca-central-1.amazonaws.com/dev/user/${email}/find-roommate-page`
        );

        if (response.status === 200) {
            // Profile exists
            return true;
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
            // Profile does not exist
            return false;
        } else {
            console.error("Error checking user profile:", error);
            throw new Error("An error occurred while checking the user's profile.");
        }
    }
};
