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
 * @name Add a new roommate to a room
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

/**
 * @memberof Room
 * @name Get All Completed Tasks
 * @path {GET} /get-completed-tasks
 * @query {String} frm User requesting to get the list
 * @code {200} Successfully retrieved completed tasks
 * @code {404} Invalid User
 * @code {404} Room not found
 * @code {404} No completed tasks found
 * @code {500} Error message from backend
 * @response {JSON} tasks List of completed tasks
 * @example Response: {
 *     "complete_tasks": [
 *         {
 *             "complete": true,
 *             "due_date": "2024-11-11",
 *             "task_id": "2e047472",
 *             "asignee": "user1@gmail.com",
 *             "task_description": "washing dishes"
 *         },
 *         {
 *             "complete": true,
 *             "due_date": "2024-11-11",
 *             "task_id": "55e10ce7",
 *             "asignee": "user2@gmail.com",
 *             "task_description": "throw trash"
 *         },
 *     ]
 * }
 */
router.get("/get-completed-tasks", (req, res) => {
    room_handler.get_completed_tasks(req, res);
});
/**
 * @memberof Room
 * @name Get All Pending Tasks
 * @path {GET} /get-pending-tasks
 * @query {String} frm User requesting to get the list
 * @code {200} Successfully retrieved pending tasks
 * @code {404} Invalid User
 * @code {404} Room not found
 * @code {404} No pending tasks found
 * @code {500} Error message from backend
 * @response {JSON} tasks List of pending tasks
 * @example Response: {
 *     "pending_tasks": [
 *         {
 *             "complete": true,
 *             "due_date": "2024-11-11",
 *             "task_id": "2e047472",
 *             "asignee": "user1@gmail.com",
 *             "task_description": "washing dishes"
 *         },
 *         {
 *             "complete": true,
 *             "due_date": "2024-11-11",
 *             "task_id": "55e10ce7",
 *             "asignee": "user2@gmail.com",
 *             "task_description": "throw trash"
 *         },
 *     ]
 * }
 */
router.get("/get-pending-tasks", (req, res) => {
    room_handler.get_pending_tasks(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Room paths" });
});

module.exports = router;
