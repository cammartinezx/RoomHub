/** Routes
 * @module Room
 */
const express = require("express");
const router = express.Router();
const RoomHandler = require("../Handler/RoomHandler");

const room_handler = new RoomHandler();

/**
 *
 * @name Add a new room
 * @path {POST} room/create-room
 * @query {String} rm The name of the new room to be created
 * @query {String} id The new users e-mail to be added to the database
 * @code {200} Expected response sent
 * @code {400} Logical error related to the user_id or the room name passed
 * @code {500} Backend error from the database
 * @response {String} message Successfully Created the new room (200)
 * @response {String} message Bad Request-Invalid Room Name (400)
 * @response {String} message Bad Request-Invalid User (400)
 * @response {String} message Error message from backend (500)
 */
router.post("/create-room", (req, res) => {
    room_handler.create_room(req, res);
});

router.post("/add-roommate", (req, res) => {
    room_handler.add_roommate(req, res);
});

module.exports = router;
