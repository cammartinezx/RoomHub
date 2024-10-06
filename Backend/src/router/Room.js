/** Routes
 * @module Room
 */
const express = require("express");
const router = express.Router();
const RoomHandler = require("../Handler/RoomHandler");

const room_handler = new RoomHandler();

/**
 *
 * @name Add a new user
 * @route {POST} room/create-room
 * @bodyparam {String} rm The name of the new room to be created
 * @bodyparam {String} id The new users e-mail to be added to the database
 */
router.post("/create-room", (req, res) => {
    room_handler.create_room(req, res);
});

router.post("/add-roommate", (req, res) => {
    room_handler.add_roommate(req, res);
});

module.exports = router;
