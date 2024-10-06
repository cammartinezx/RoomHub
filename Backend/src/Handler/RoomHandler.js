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
     * The room persistence object used by the room handler.
     * @type {string}
     * @private
     */
    #room_persistence;

    /**
     * Create a new RoomHandler object
     * @constructor
     */
    constructor() {
        this.#room_persistence = Services.get_room_persistence();
    }

    get_user_persistence() {
        return this.#room_persistence;
    }

    /**
     * Validate a room name
     * @param {String} room_name "The room name to be validated"
     * @returns {Boolean} "True if valid room name and false otherwise"
     */
    #is_valid_room_name(room_name) {
        if (typeof room_name === "string" && room_name.length > 0) {
            return true;
        }
        return false;
    }

    /**
     * Validate a user id
     * @async
     * @param {String} user_id "The user_id to be validated"
     * @returns {Boolean} "True if valid user_id and false otherwise"
     */
    async #is_valid_user(user_id) {
        // call the services to get the user persistence. and ask it to get that user. if it returns something then good if not then bad.
        let user_persistence = Services.get_user_persistence();
        let user = await user_persistence.get_user(user_id);
        if (user != null) {
            return true;
        }
        return false;
    }

    /**
     * Creates a new room in the persistence layer and updates user
     * @async
     * @param {Express.request} request "Reequest received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     * @returns {Express.response} "A response object which contains the response to the request."
     */
    async create_room(request, response) {
        try {
            let room_name = request.body.rm.trim().toLowerCase();
            let user_id = request.body.id.trim().toLowerCase();
            const is_valid_room = this.#is_valid_room_name(room_name);
            const is_valid_user = await this.#is_valid_user(user_id);
            if (is_valid_room && is_valid_user) {
                // generate room id
                const room_id = uuidv4();
                let new_room_status = await this.#room_persistence.generate_new_room(room_id, room_name, user_id);
                if (new_room_status === "SUCCESS") {
                    // add the generated room_id to the persons room id
                    let user_persistence = Services.get_user_persistence();
                    await user_persistence.update_user_room(room_id, user_id);
                    response.status(200).json({ message: "Successfully Created the new room" });
                } else {
                    // throw an error saying try to recreate the room
                    response.status(500).json({ message: "Retry creating the room" });
                }
            } else {
                if (!is_valid_room && is_valid_user) {
                    response.status(400).json({ message: "Bad Request-Invalid Room Name" });
                } else if (is_valid_room && !is_valid_user) {
                    response.status(400).json({ message: "Bad Request-Invalid User" });
                } else {
                    response.status(400).json({ message: "Bad Request-Invalid User and room name" });
                }
            }
        } catch (error) {
            response.status(500).json({ msg: error.message });
        }
    }

    #is_valid_roomname(persist_room_name, room_name) {
        if (persist_room_name === room_name) {
            return true;
        } else {
            return false;
        }
    }

    async add_roommate(request, response) {
        try {
            const existing_roommate_id = request.body.existing_roommate.trim();
            const new_roommate_id = request.body.new_roommate.trim();
            const room_name = request.body.room_nm.trim();

            // validate existing roomates room matches with the room_name
            const user_persistence = Services.get_user_persistence;
            const old_roommate = user_persistence.get_user(existing_roommate_id);
            const new_roommate = user_persistence.get_user(new_roommate_id);

            if (old_roommate != null && new_roommate != null) {
                const room_id = user.room_id;
                const db_room_name = this.#room_persistence.get_room(room_id);
                if (this.#is_valid_roomname(old_roommate, room_name)) {
                    // update the rooms list of users.
                    // update the new_roommates room.
                    user_persistence.update_user_room(new_roommate_id, room_id);
                    this.#room_persistence.add_new_roommate(room_id, new_roommate_id);
                } else {
                    // basically denying access to that room resource
                    response.status(404).json({ message: "Not found" });
                }
            } else {
                if (new_roommate === null && old_roommate === null) {
                    response.status(404).json({ message: "Users not found" });
                } else if (new_roommate === null && old_roommate !== null) {
                    response.status(404).json({ message: "New roommate not found" });
                } else {
                    response.status(404).json({ message: "User in room not found" });
                }
            }
        } catch (error) {
            response.status(500).json({ message: error.message });
        }

        // validate existence of the new roommate
    }
}

module.exports = RoomHandler;
