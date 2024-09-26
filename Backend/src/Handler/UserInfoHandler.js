const Services = require("../Utility/Services");

class UserInfoHandler {
    #user_persistence;

    constructor() {
        this.#user_persistence = Services.getUserPersistence();
    }

    get_user_persistence() {
        return this.#user_persistence;
    }
}

module.exports = UserInfoHandler;
