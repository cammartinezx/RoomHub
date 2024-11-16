const Services = require("../Utility/Services");
const { v4: uuidv4 } = require("uuid");
const UserInfoHandler = require("./UserInfoHandler");

/**
 * @module Handler
 */

/**
 * Represents the Room handler
 * @class
 *
 */
class ProfileHandler {
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
     * The profile persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #profile_persistence;

    /**
     * Create a new UserInfoHandler object
     * @constructor
     */
    constructor() {
        this.#profile_persistence = Services.get_profile_persistence();
        this.#user_persistence = Services.get_user_persistence();
        this.#room_persistence = Services.get_room_persistence();
        this.#notification_persistence = Services.get_notification_persistence();
    }

    get_profile_persistence() {
        return this.#profile_persistence;
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


    async create_profile(request, response) {
        try {
            
            const user_id = request.body.id.trim().toLowerCase();
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

    async update_profile(request, response) {
        try {
            /*
            const user_id = request.body.id.trim().toLowerCase();
            if (!this.#is_valid_id(user_id)) {
                // give a certain type of response
                return response.status(400).json({ message: "Error Creating User- User id is invalid" });
            }
            let result = await this.#user_persistence.save_new_user(user_id);
            return response.status(result.status).json({ message: result.message });*/
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    async get_profile(request, response) {
        try {
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
}

module.exports = ProfileHandler;
