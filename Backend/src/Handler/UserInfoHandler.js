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
     * @param {String} user_id
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
     * @param {Express.request} request
     * @param {Express.response} response
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
}

module.exports = UserInfoHandler;
