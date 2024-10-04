const Services = require("../Utility/Services");

/**
 * @module Handler
 */

/**
 * Represents the Room handler
 * @class
 *
 */
class RoomHandler {
    /**
     * The user persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #room_persistence;

    /**
     * Create a new UserInfoHandler object
     * @constructor
     */
    constructor() {
        this.#room_persistence = Services.get_user_persistence();
    }

    get_user_persistence() {
        return this.#room_persistence;
    }
}
