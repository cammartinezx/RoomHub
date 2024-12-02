const Services = require("../Utility/Services");
const { v4: uuidv4 } = require("uuid");
const { validateString, validateUserExist } = require("../Utility/validator");

/**
 * @module Handler
 */

/**
 * Represents the user information handler
 * @class
 *
 */
class UserInfoHandler {
    /**
     * The user persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #user_persistence;
    /**
     * The room persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #room_persistence;

    /**
     * The notificaion persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #notification_persistence;

    /**
     * The notificaion persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #profile_persistence;

    /**
     * The notificaion persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #review_persistence;

    /**
     * Create a new UserInfoHandler object
     * @constructor
     */
    constructor() {
        this.#user_persistence = Services.get_user_persistence();
        this.#room_persistence = Services.get_room_persistence();
        this.#notification_persistence = Services.get_notification_persistence();
        this.#profile_persistence = Services.get_profile_persistence();
        this.#review_persistence = Services.get_review_persistence();
    }

    get_user_persistence() {
        return this.#user_persistence;
    }

    get_room_persistence() {
        return this.#room_persistence;
    }

    get_notification_persistence() {
        return this.#notification_persistence;
    }

    get_profile_persistence() {
        return this.#profile_persistence;
    }
    get_review_persistence() {
        return this.#review_persistence;
    }
    /**
     *Check if the passed in user_id is valid
     * @param {String} user_id "A string representing the user_id to be validated"
     * @returns {Boolean} "Returns true if valid id, returns false if invalid"
     */
    #is_valid_id(user_id) {
        if (user_id.length === 0) {
            return false;
        }
        return true;
    }

    /**
     * Add a new user to the persistence Layer
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     * @returns {Express.response} "A response object which contains the response to the request."
     */
    async create_user(request, response) {
        try {
            const user_id = request.body.id.trim().toLowerCase();
            const name = request.body.name.trim().toLowerCase();
            if (!this.#is_valid_id(user_id)) {
                // give a certain type of response
                return response.status(400).json({ message: "Error Creating User- User id is invalid" });
            }
            if (!this.#is_valid_id(name)) {
                return response.status(400).json({ message: "Error Creating User- User name is invalid" });
            }
            let result = await this.#user_persistence.save_new_user(user_id, name);
            return response.status(result.status).json({ message: result.message });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    /**
     * Get a users room
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     * @returns {Express.response} "A response object which contains the response to the request."
     */
    async get_user_room(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            // validate user_id
            if (!this.#is_valid_id(user_id)) {
                response.status(400).json({ room_name: "This username is invalid" });
            } else {
                // if valid user id
                let user = await this.#user_persistence.get_user(user_id);
                if (user === null) {
                    response.status(404).json({ room_name: "User not found" });
                } else {
                    let room_id = user.room_id;
                    // The user doesn't have a room yet(no sql fields don't exist if they've never been created)
                    if (room_id === undefined) {
                        response.status(200).json({ room_name: "NA" });
                    } else {
                        const room_name = await this.#room_persistence.get_room_name(room_id);
                        response.status(200).json({ room_name: room_name });
                    }
                }
            }
        } catch (error) {
            response.status(500).json({ room_name: error.message });
        }
    }

    /**
     * Get a list of notification from specific existing user in the database
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     */
    async get_user_notification(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            // validate user_id
            if (!this.#is_valid_id(user_id)) {
                response.status(400).json({ message: "This username is invalid" });
            } else {
                // if valid user id
                let user = await this.#user_persistence.get_user(user_id);
                if (user === null) {
                    response.status(404).json({ message: "User not found" });
                } else {
                    let notification = await this.#user_persistence.get_notification(user_id);
                    // convert set into array
                    let notif_list = [...notification];
                    let result = [];
                    for (let item of notif_list) {
                        // update the status of notification from unread to read
                        await this.#notification_persistence.update_notification_status(item);
                        let notif_item = await this.#notification_persistence.get_msg_type(item);
                        result.push(notif_item);
                    }
                    response.status(200).json({ All_Notifications: result });
                }
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    /**
     * Get a message notify user left the room
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     * @returns {Express.response} "A response object which contains the response to the request."
     */
    async leave_user_room(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            // validate user_id
            if (!this.#is_valid_id(user_id)) {
                response.status(400).json({ message: "This username is invalid" });
            } else {
                // if valid user id
                let user = await this.#user_persistence.get_user(user_id);
                if (user === null) {
                    response.status(404).json({ message: "User not found" });
                } else {
                    // get the room id from the given user
                    let room_id = await this.#user_persistence.get_room_id(user_id);
                    // get the total number of users in the room
                    let users = await this.#room_persistence.get_room_users(room_id);
                    let total_users = [...users].length;
                    // the room only have 1 user
                    if (total_users === 1) {
                        // delete room
                        await this.#room_persistence.delete_room(room_id);
                        // remove room_id from the specific user
                        await this.#user_persistence.remove_room_id(room_id, user_id);
                        response.status(200).json({
                            message: "The room is being deleted and user leave the room successfully",
                        });
                        // more than 1 user in the room
                    } else {
                        // remove user_id from the specific room
                        await this.#room_persistence.remove_user_id(user_id, room_id);
                        // remove room_id from the specific user
                        await this.#user_persistence.remove_room_id(room_id, user_id);
                        response.status(200).json({ message: "User leave the room successfully" });
                    }
                }
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    /**
     * Get a warning message if user want to leave the room
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     * @returns {Express.response} "A response message which contains the response to the request."
     */
    async get_user_warning(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            // validate user_id
            if (!this.#is_valid_id(user_id)) {
                response.status(400).json({ message: "This username is invalid" });
            } else {
                // if valid user id
                let user = await this.#user_persistence.get_user(user_id);
                if (user === null) {
                    response.status(404).json({ message: "User not found" });
                } else {
                    // get the room id from the given user
                    let room_id = await this.#user_persistence.get_room_id(user_id);
                    // get the total number of users in the room
                    let users = await this.#room_persistence.get_room_users(room_id);
                    let total_users = [...users].length;
                    // the room only have 1 user
                    if (total_users === 1) {
                        response.status(200).json({ message: "Warning: If you leave, the room will be deleted!" });
                        // more than 1 user in the room
                    } else {
                        response.status(200).json({ message: "Warning: Are you sure want to leave this room!" });
                    }
                }
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    /**
     * Get a message notify if you have roommate or not
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     * @returns {Express.response} "A response message which contains the response to the request."
     */
    async get_roommate(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            // validate user_id
            if (!this.#is_valid_id(user_id)) {
                response.status(400).json({ message: "This username is invalid" });
            } else {
                // if valid user id
                let user = await this.#user_persistence.get_user(user_id);
                if (user === null) {
                    response.status(404).json({ message: "User not found" });
                } else {
                    // get the room id from the given user
                    let room_id = await this.#user_persistence.get_room_id(user_id);
                    // get the total number of users in the room
                    let users = await this.#room_persistence.get_room_users(room_id);
                    let total_users = users.length;
                    // the room only have 1 user
                    if (total_users === 1) {
                        response.status(200).json({ message: "You have no roommate" });
                        // more than 1 user in the room
                    } else {
                        response.status(200).json({ message: "You have at least one roommate" });
                    }
                }
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }
    /**
     * Get the list of roommates for the specified user.
     * @async
     * @param {Express.request} request - "Request received by the router"
     * @param {Express.response} response - "Response to be sent back to the service that sent the original request"
     * @returns {Express.response} - "A response message which contains the list of roommates or an error message."
     */
    async get_user_roommates(request, response) {
        try {
            const user_id = request.params.id.trim().toLowerCase();

            // Retrieve the user to ensure they exist
            const user = await this.#user_persistence.get_user(user_id);
            if (user === null) {
                return response.status(403).json({ message: "User not found" });
            }

            // Get the room ID associated with the user
            const room_id = await this.#user_persistence.get_room_id(user_id);

            // Get the list of users in the room
            let roommates;
            roommates = await this.#room_persistence.get_room_users(room_id);
            roommates = Array.from(roommates);

            // Get each roommates names as well.
            let all_roommates = [];
            for (let i = 0; i < roommates.length; i++) {
                // this gets the users roommate name.
                const user_obj = await this.#user_persistence.get_user(roommates[i]);
                const roommate_name = user_obj.name;
                all_roommates.push([roommates[i], roommate_name]);
            }

            // console.log(roommates);

            return response.status(200).json({ all_roommates: all_roommates });
            // // Filter out the current user from the list
            // const roommates = users.filter((id) => id !== user_id);
            // if (roommates.length === 0) {
            //     return response.status(200).json({ message: "You have no roommates" });
            // } else {
            //     return response.status(200).json({ roommates });
            // }
        } catch (error) {
            console.error("Error fetching roommates:", error);
            return response.status(500).json({ message: error.message });
        }
    }
    async get_roommates_helper(user_id) {
        let room_id = await this.#user_persistence.get_room_id(user_id);
        // get the total number of users in the room
        let users = await this.#room_persistence.get_room_users(room_id);
        return users;
    }

    async areRoommates(user_id1, user_id2) {
        let users = await this.get_roommates_helper(user_id1);
        // Check if user_id2 is in the users list and return true or false
        console.log(users);
        return users.has(user_id2);
    }

    /**
     * Validate a user id
     * @async
     * @param {String} user_id "The user_id to be validated"
     * @returns {Boolean} "True if valid user_id and false otherwise"
     */
    async is_valid_user(user_id) {
        // call the services to get the user persistence. and ask it to get that user. if it returns something then good if not then bad.
        let user = await this.#user_persistence.get_user(user_id);
        if (user != null) {
            return true;
        }
        return false;
    }

    /**
     * Delete a notification base on user_id and notification_id
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     * @returns {Express.response} "A response message which contains the response to the request."
     */
    async delete_notification(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            let notif_id = request.params.notif_id.trim().toLowerCase();
            // validate user_id
            if (!this.#is_valid_id(user_id)) {
                return response.status(400).json({ message: "This username is invalid" });
            }
            if (!this.#is_valid_id(notif_id)) {
                return response.status(400).json({ message: "This notification id is invalid" });
            } else {
                // if valid user id and notification id
                let user = await this.#user_persistence.get_user(user_id);
                if (user === null) {
                    response.status(404).json({ message: "User not found" });
                } else {
                    let notifications = await this.#user_persistence.get_notification(user_id);
                    // convert set into array
                    let notif_list = [...notifications];
                    // check whether the notification is existed
                    if (notif_list.includes(notif_id)) {
                        // delete notification from notification table
                        await this.#notification_persistence.delete_notification(notif_id);
                        // delete notification from user table
                        await this.#user_persistence.update_notification_set(notif_id, user_id);
                        response.status(200).json({ message: "Notification deleted successfully" });
                    } else {
                        response.status(404).json({ message: "Notification not found" });
                    }
                }
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }

    /**
     * Get the review page of a roommate (id2).
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     */
    async get_review_page(request, response) {
        try {
            const id2 = request.params.roommate_id.trim().toLowerCase();
            // Check if id2 exists in the Profile table
            const profile = await this.#profile_persistence.get_profile(id2);
            if (profile) {
                return response.status(200).json({ message: "User public profile exists" });
            } else {
                return response.status(400).json({ message: "User public profile does not exist" });
            }
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    /**
     * Send a review for a user.
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     */
    async send_review(request, response) {
        try {
            const {
                reviewed_by,
                reviewed,
                overall,
                cleanliness,
                noise_levels,
                respect,
                communication,
                paying_rent,
                chores,
            } = request.body;

            // Check if reviewed_by has already reviewed the user
            const existingReviews = await this.#review_persistence.get_reviews_for_user(reviewed);
            const existingReview = existingReviews.find((review) => review.reviewed_by === reviewed_by);

            if (existingReview) {
                const review_id = existingReview.review_id; // Extract the review_id
                // Overwrite the existing review
                await this.#review_persistence.update_review(
                    review_id, // Pass the review_id for the update
                    reviewed_by,
                    reviewed,
                    overall,
                    cleanliness,
                    noise_levels,
                    respect,
                    communication,
                    paying_rent,
                    chores,
                );
            } else {
                const review_id = uuidv4();
                // Add a new review
                await this.#review_persistence.add_review(
                    review_id,
                    reviewed_by,
                    reviewed,
                    overall,
                    cleanliness,
                    noise_levels,
                    respect,
                    communication,
                    paying_rent,
                    chores,
                );
            }

            // Calculate averages
            const allReviews = await this.#review_persistence.get_reviews_for_user(reviewed);

            const reviewCount = allReviews.length;
            const averages = {
                overall: 0,
                cleanliness: 0,
                noise_levels: 0,
                respect: 0,
                communication: 0,
                paying_rent: 0,
                chores: 0,
            };

            for (const review of allReviews) {
                averages.overall += review.overall;
                averages.cleanliness += review.cleanliness;
                averages.noise_levels += review.noise_levels;
                averages.respect += review.respect;
                averages.communication += review.communication;
                averages.paying_rent += review.paying_rent;
                averages.chores += review.chores;
            }

            // Calculate final averages
            Object.keys(averages).forEach((key) => {
                averages[key] = (averages[key] / reviewCount).toFixed(2);
            });

            // Update the averages in the Profile table
            await this.#profile_persistence.update_profile_averages(reviewed, averages);

            return response.status(200).json({ message: "Review successfully submitted", averages });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    /**
     * Check if the user has a profile and return a 200 or 400 status
     * @async
     * @param {Express.request} request - Request received by the router
     * @param {Express.response} response - Response to be sent back to the service that sent the original request
     * @returns {Express.response} - A response object with status 200 or 400
     */
    async find_roommate_page(request, response) {
        try {
            const user_id = request.params.id?.trim().toLowerCase();

            if (!user_id) {
                return response.status(400).json({ message: "Invalid user ID" });
            }

            // Fetch the user's profile from the Profiles table
            const user_profile = await this.#profile_persistence.get_profile(user_id);

            if (!user_profile) {
                // User does not have a profile
                return response.status(400).json({ message: "User does not have a profile" });
            }

            // User has a profile, return a 200 status
            return response.status(200).json({ message: "User has a profile" });
        } catch (error) {
            console.error("Error in find_roommate_page:", error);
            return response.status(500).json({ message: error.message });
        }
    }

    /**
     * Get new matches for the user based on location
     * @async
     * @param {Express.request} request - Request received by the router
     * @param {Express.response} response - Response to be sent back to the service that sent the original request
     * @returns {Express.response} - A response object containing profiles or an error message
     */
    async get_new_matches(request, response) {
        try {
            const user_id = request.params.id.trim().toLowerCase();

            // Fetch the user's profile from the Profiles table
            const user_profile = await this.#profile_persistence.get_profile(user_id);

            if (!user_profile) {
                // User does not have a profile
                return response.status(400).json({ message: "User does not have a profile" });
            }

            const user_location = user_profile.location;

            if (!user_location) {
                // User's profile is missing location
                return response.status(400).json({ message: "User's profile is incomplete: missing location" });
            }

            let likes = user_profile.likes || [];
            if (user_profile.likes && typeof user_profile.likes === "object") {
                likes = Array.from(user_profile.likes); // Convert DynamoDB Set to an array
            }

            let matches = user_profile.matches || [];
            if (user_profile.matches && typeof user_profile.matches === "object") {
                matches = Array.from(user_profile.matches); // Convert DynamoDB Set to an array
            }

            // Fetch all profiles with the same location
            const profiles_in_location = await this.#profile_persistence.get_profiles_by_location(user_location);

            profiles_in_location.forEach((profile) => {
                if (profile.tags && typeof profile.tags === "object") {
                    profile.tags = Array.from(profile.tags); // Convert DynamoDB Set to an array
                }
            });

            // Filter out the user's profile, matches, and potential matches
            const filtered_profiles = profiles_in_location.filter((profile) => {
                return (
                    profile.user_id !== user_id &&
                    !likes.includes(profile.user_id) &&
                    !matches.includes(profile.user_id)
                );
            });

            return response.status(200).json({ profiles: filtered_profiles });
        } catch (error) {
            console.error("Error in get_new_matches:", error);
            return response.status(500).json({ message: error.message });
        }
    }

    /**
     * Get a list of unread notifications
     * @async
     * @param {Express.request} request - Request received by the router
     * @param {Express.response} response - Response to be sent back to the service that sent the original request
     * @returns {Express.response} - A response object with status 200, 422, 404 and 500
     */
    async get_unread_notifs(request, response) {
        try {
            const user_id = request.params.id.trim().toLowerCase();

            // sync errors
            try {
                validateString(user_id, "User ID");
            } catch (error) {
                return response.status(422).json({ message: error.message });
            }

            // async errors check
            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }

            let notification = await this.#user_persistence.get_notification(user_id);
            let result = [];
            for (let item of notification) {
                let notif_detail = await this.#notification_persistence.get_unread_details(item);
                result.push(notif_detail);
            }
            const filterResults = result.filter((item) => item !== "ok");
            return response.status(200).json({ Unread_Notification: filterResults });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserInfoHandler;
