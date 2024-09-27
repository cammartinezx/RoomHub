const Services = require("../Utility/Services");

class UserInfoHandler {
    #user_persistence;

    constructor() {
        this.#user_persistence = Services.get_user_persistence();
    }

    get_user_persistence() {
        return this.#user_persistence;
    }

    #is_valid_id(user_id) {
        if (user_id === "") {
            return false;
        }
        return true;
    }

    async create_user(request, response) {
        try {
            const user_id = request.body.id;
            console.log("Body of the req", request.body);

            if (!this.#is_valid_id(user_id)) {
                // give a certain type of response
                response.status(400).json({ message: "Error Creating User- User id is invalid" });
            }
            let result = await this.#user_persistence.save_new_user(user_id);
            response.status(result.status).json({ message: result.message });
        } catch (error) {
            response.status(500).json({ message: error });
        }
    }
}

module.exports = UserInfoHandler;
