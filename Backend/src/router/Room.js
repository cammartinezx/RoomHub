/** Routes
 * @namespace Room
 * @description Routes related to rooms
 */
const express = require("express");
const router = express.Router();
const RoomHandler = require("../Handler/RoomHandler");

const room_handler = new RoomHandler();

/**
 * @memberof Room
 * @name Add a new room
 * @path {POST} room/create-room
 * @query {String} rm The name of the new room to be created
 * @query {String} id The new users e-mail to be added to the database
 * @code {200} Successfully Created the new room
 * @code {400} Bad Request-Invalid Room Name
 * @code {400} Bad Request-Invalid User
 * @code {500} Error message from backend
 * @response {String} message See description of the different status codes
 */
router.post("/create-room", (req, res) => {
    room_handler.create_room(req, res);
});

/**
 * @memberof Room
 * @name Add a new room-mate to a room
 * @path {POST} room/add-roommate
 * @query {String} existing_roommate The name of the already existing roommate
 * @query {String} new_roommate The name of the roommate to be added newly to the room
 * @query {String} room_nm The name of the new room the new roommate is getting added to
 * @query {String} notification_id The notification id linked to the room join request.
 * @code {200} New Roommate successfully added
 * @code {404} Room not found
 * @code {404} Room not found. Create or Join a room
 * @code {404} User not found
 * @code {404} New roommate not found
 * @code {404} Old roommate not found
 * @code {500} Error message from backend
 * @response {String} message See description of the different status codes
 */
router.post("/add-roommate", (req, res) => {
    room_handler.add_roommate(req, res);
});

//GET ALL COMPLETED TASKS

/**
 * @memberof Task
 * @name Get All Completed Tasks
 * @path {GET} /:id/get-completed-tasks
 * @param {String} id The user ID to retrieve completed tasks for
 * @code {200} Successfully retrieved completed tasks
 * @code {404} User or tasks not found
 * @code {500} Error message from backend
 * @response {Object[]} tasks List of completed tasks
 */
router.get("/:id/get-completed-tasks", (req, res) => {
    room_handler.get_completed_tasks(req, res);
});

//GET ALL PENDING TASKS

/**
 * @memberof Task
 * @name Get All Pending Tasks
 * @path {GET} /:id/get-pending-tasks
 * @param {String} id The user ID to retrieve pending tasks for
 * @code {200} Successfully retrieved pending tasks
 * @code {404} User or tasks not found
 * @code {500} Error message from backend
 * @response {Object[]} tasks List of pending tasks
 */
router.get("/:id/get-pending-tasks", (req, res) => {
    room_handler.get_pending_tasks(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Room paths" });
});

module.exports = router;
