const Services = require("../Utility/Services");
const { v4: uuidv4 } = require("uuid");

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
     * The room persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #room_persistence;

    /**
     * Create a new UserInfoHandler object
     * @constructor
     */
    constructor() {
        this.#room_persistence = Services.get_room_persistence();
    }

    get_user_persistence() {
        return this.#room_persistence;
    }

    #is_valid_room_name(room_name) {
        console.log("Validating name");
        if (typeof room_name === "string" && room_name.length > 0) {
            return true;
        }
        return false;
    }

    #is_valid_user(user_id) {
        console.log("validating id");

        // call the services to get the user persistence. and ask it to get that user. if it returns something then good if not then bad.
        let user_persistence = Services.get_user_persistence();
        let user = user_persistence.get_user(user_id);
        console.log(user);
        if (user != null) {
            return true;
        }
        return false;
    }

    create_room(request, response) {
        try {
            let room_name = request.body.rm;
            let user_id = request.body.id;
            if (this.#is_valid_room_name(room_name) && this.#is_valid_user(user_id)) {
                // generate room id
                room_id = uuidv4();
                let new_room_status = this.#room_persistence.generate_new_room(room_id, room_name, user_id);
                if (new_room_status === "SUCCESS") {
                    // add the generated room_id to the persons room id
                    let user_persistence = Services.get_user_persistence();
                    user_persistence.update_user_room(room_id);
                    response.status(200).json({ message: "Successfully Created the new room" });
                } else {
                    // throw an error saying try to recreate the room
                    response.status(500).json({ message: "Retry creating the room" });
                }
                console.log("working");
            }
        } catch (error) {
            console.log(error.message);
            response.status(200).json({ msg: "Bad" });
        }
    }
}

module.exports = RoomHandler;
