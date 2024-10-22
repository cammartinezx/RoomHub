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
class TaskOrganizerHandler {
    /**
     * The task persistence object used by the room handler.
     * @type {string}
     * @private
     */
    #task_persistence;
    /**
     * The user persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #user_persistence;
    /**
     * Create a new RoomHandler object
     * @constructor
     */
    constructor() {
        this.#user_persistence = Services.get_user_persistence();
        this.#task_persistence = Services.get_task_persistence();
    }

    get_task_persistence() {
        return this.#task_persistence;
    }

    get_user_persistence() {
        return this.#user_persistence;
    }
    /**
     * Validate a task name
     * @param {String} room_name "The room name to be validated"
     * @returns {Boolean} valid_name "True if valid room name and false otherwise"
     */
    #is_valid_task_name(task_name) {
        let valid_name = false;
        if (typeof task_name === "string" && task_name.length > 0) {
            valid_name = true;
        }
        return valid_name;
    }
    async #is_valid_user(user_id) {
        // call the services to get the user persistence. and ask it to get that user. if it returns something then good if not then bad.
        let user_persistence = this.#user_persistence;
        let user = await user_persistence.get_user(user_id);
        if (user != null) {
            return true;
        }
        return false;
    }

    #is_valid_date(dateString) {
        // Regular expression to validate the format (yyyy-MM-dd)
        const dateRegExp = /^\d{4}-\d{2}-\d{2}$/;
        // Check if the date string matches the yyyy-MM-dd format
        if (!dateRegExp.test(dateString)) {
            return false;
        }
        // Parse the date string to a JavaScript Date object
        const inputDate = new Date(dateString);

        // Check if the parsed date is valid
        if (isNaN(inputDate.getTime())) {
            return false;
        }

        // Get today's date in yyyy-MM-dd format (ignore time part)
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 to only compare dates

        // Compare the input date with today's date
        return inputDate >= today;
    }

    async create_task(request, response) {
        try {
            let task_name = request.body.tn.trim().toLowerCase();
            let user_from = request.body.frm.trim().toLowerCase();
            let user_to = request.body.to.trim().toLowerCase();
            let due_date = request.body.date.trim();
            const is_valid_task = this.#is_valid_task_name(task_name);
            const is_valid_from = await this.#is_valid_user(user_from);
            const is_valid_to = await this.#is_valid_user(user_to);
            const is_valid_date = await this.#is_valid_date(due_date);
            if(is_valid_from&&is_valid_to){

            }
        } catch (error) {}
    }
}

module.exports = TaskOrganizerHandler;
