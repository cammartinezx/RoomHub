// userpersistence object-- to get access to all the methods
const UserPersistence = require("../Persistence/UserPersistence");

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
