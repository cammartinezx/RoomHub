/**
 * All services to access the different persistence objects
 * @module Services
 */

// userpersistence object-- to get access to all the methods
const UserPersistence = require("../Persistence/UserPersistence");

/**
 * Services to make sure only one instance of different persistence exist.
 * @class
 */
class Services {
    // only one instance of the all persistence is created
    static #user_persistence = null;

    static get_user_persistence() {
        if (this.#user_persistence === null) {
            this.#user_persistence = new UserPersistence();
        }

        return this.#user_persistence;
    }
}

module.exports = Services;
