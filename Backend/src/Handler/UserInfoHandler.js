const Services = require("../Utility/Services");

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
     * Create a new UserInfoHandler object
     * @constructor
     */
    constructor() {
        this.#user_persistence = Services.get_user_persistence();
    }

    get_user_persistence() {
        return this.#user_persistence;
    }

    /**
     *Check if the passed in user_id is valid
     * @param {String} user_id "A string representing the user_id to be validated"
     * @returns {Boolean} "Returns true if valid id, returns false if invalid"
     */
    #is_valid_id(user_id) {
        if (user_id === "") {
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
            const user_id = request.body.id;
            if (!this.#is_valid_id(user_id)) {
                // give a certain type of response
                return response.status(400).json({ message: "Error Creating User- User id is invalid" });
            }
            let result = await this.#user_persistence.save_new_user(user_id);
            return response.status(result.status).json({ message: result.message });
        } catch (error) {
            return response.status(500).json({ message: error.message });
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
                let notification = await this.#user_persistence.get_notification(user_id);
                // convert set into array
                let notif_list = [...notification];
                let result = [];
                for (let item of notif_list) {
                    // update the status of notification from unread to read
                    await Services.get_notification_persistence().update_notification_status(item);
                    let notif_item = await Services.get_notification_persistence().get_msg_type(item);
                    result.push(notif_item);
                }
                response.status(200).json({ All_Notifications: result });
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }
    }
}

module.exports = UserInfoHandler;
