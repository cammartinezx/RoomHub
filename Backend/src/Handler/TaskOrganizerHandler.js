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
     * The user persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #room_persistence;

    userHandler;
    /**
     * Create a new RoomHandler object
     * @constructor
     */
    constructor() {
        this.#user_persistence = Services.get_user_persistence();
        this.#task_persistence = Services.get_task_persistence();
        this.#room_persistence = Services.get_room_persistence();
        this.userHandler = new UserInfoHandler();
    }

    get_task_persistence() {
        return this.#task_persistence;
    }

    get_user_persistence() {
        return this.#user_persistence;
    }
    /** V A L I D A T O R S  */
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

    /* T A S K       A C T I O N S */

    async create_task(request, response) {
        try {
            const { tn, frm, to, date } = request.body;

            // Sanitize inputs
            const task_name = tn.trim();
            const user_from = frm.trim().toLowerCase();
            const user_to = to.trim().toLowerCase();
            const due_date = date.trim();
            const room_id = this.#user_persistence.get_room_id(user_id);

            // Validate inputs
            const is_valid_task = this.#is_valid_task_name(task_name);
            const is_valid_from = await this.userHandler.is_valid_user(user_from);
            const is_valid_to = await this.userHandler.is_valid_user(user_to);
            const is_valid_date = await this.#is_valid_date(due_date);

            // Check if task can be created
            if (!is_valid_from || !is_valid_to) {
                return response.status(400).json({ message: "Invalid users involved" });
            }

            if (!this.userHandler.areRoommates(user_from, user_to)) {
                return response.status(400).json({ message: "Users are not roommates" });
            }
            if (!is_valid_task || !is_valid_date) {
                return response.status(400).json({ message: "Invalid task name or due date" });
            }

            // Generate task
            const task_id = uuidv4();
            const new_task_status = await this.#task_persistence.generate_new_task(
                task_id,
                task_name,
                user_to,
                due_date,
            );
            this.#room_persistence.add_task_to_room(room_id, task_id);
            return response.status(200).json({ message: "Task created successfully" });
        } catch (error) {
            console.error("Error creating task:", error);
            return response.status(500).json({ message: "An error occurred while creating the task" });
        }
    }

    async delete_task(request, response) {
        try {
            const { id, frm } = request.body;
            const task_id = id.trim().toLowerCase();
            // Sanitize inputs
            const user_id = frm.trim().toLowerCase();
            //get room id from the user
            const room_id = this.#user_persistence.get_room_id(user_id);
            task_list = this.#task_persistence.get_room_tasks(room_id);

            // Check if the user is valid
            const is_valid_from = await this.userHandler.is_valid_user(user_from);
            if (!is_valid_from) {
                return response.status(400).json({ message: "Invalid user" });
            }

            // Fetch the existing task by task_id to ensure it exists
            const existing_task = await this.#task_persistence.get_task_by_id(task_id);
            if (!existing_task) {
                return response.status(404).json({ message: "Task not found" });
            }

            // Check if the user is the assignee or has permission to delete the task
            if (!task_list.includes(task_id)) {
                return response.status(403).json({ message: "User is not authorized to delete this task" });
            }
            this.#room_persistence.delete_task_from_room(room_id, task_id);
            await this.#task_persistence.delete_task(task_id);
        } catch (error) {
            console.error("Error deleting task:", error);
            return response.status(500).json({ message: "An error occurred while deleting the task" });
        }
    }

    async edit_task(request, response) {
        try {
            const { id, tn, frm, to, date } = request.body;
            // Sanitize inputs
            const task_id = id.trim().toLowerCase();
            const task_name = tn.trim();
            const user_from = frm.trim().toLowerCase();
            const user_to = to.trim().toLowerCase();
            const due_date = date.trim();

            // Validate inputs
            if (!task_id) {
                return response.status(400).json({ message: "Task ID is required" });
            }

            const is_valid_task = this.#is_valid_task_name(task_name);
            const is_valid_from = await this.userHandler.is_valid_user(user_from);
            const is_valid_to = await this.userHandler.is_valid_user(user_to);
            const is_valid_date = await this.#is_valid_date(due_date);

            if (!is_valid_from || !is_valid_to) {
                return response.status(400).json({ message: "Invalid users involved" });
            }

            if (!this.userHandler.areRoommates(user_from, user_to)) {
                return response.status(400).json({ message: "Users are not roommates" });
            }

            if (!is_valid_task || !is_valid_date) {
                return response.status(400).json({ message: "Invalid task name or due date" });
            }

            // Fetch the existing task by task_id
            const existing_task = await this.#task_persistence.get_task_by_id(task_id);
            if (!existing_task) {
                return response.status(404).json({ message: "Task not found" });
            }

            // Update task with new values
            const update_status = await this.#task_persistence.update_task(task_id, task_name, user_to, due_date);
        } catch (error) {
            console.error("Error updating task:", error);
            return response.status(500).json({ message: "An error occurred while updating the task" });
        }
    }
    /**
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async mark_completed(req, res) {
        try {
            const { id, frm } = request.body;
            // Sanitize inputs
            const task_id = id.trim().toLowerCase();
            const user_id = frm.trim().toLowerCase();
            //get room id from the user
            const room_id = this.#user_persistence.get_room_id(user_id);
            task_list = this.#task_persistence.get_room_tasks(room_id);

            // Check if the user is valid
            const is_valid_user = await this.userHandler.is_valid_user(user_from);
            if (!is_valid_from) {
                return response.status(400).json({ message: "Invalid user" });
            }

            // Check if the user is the assignee or has permission to delete the task
            if (!task_list.includes(task_id)) {
                return response.status(403).json({ message: "User is not authorized to delete this task" });
            }

            // Fetch the existing task by task_id
            const existing_task = await this.#task_persistence.get_task_by_id(task_id);
            if (!existing_task) {
                return response.status(404).json({ message: "Task not found" });
            }
            // Update task with new values
            const update_status = await this.#task_persistence.mark_completed(task_id);
        } catch (error) {
            console.error("Error updating task:", error);
            return response.status(500).json({ message: "An error occurred while updating the task" });
        }
    }
}

module.exports = TaskOrganizerHandler;
