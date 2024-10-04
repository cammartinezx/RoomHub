/** Routes
 * @module Room
 */
const express = require("express");
const router = express.Router();

/**
 *
 * @name Add a new user
 * @route {POST} user/add-user
 * @bodyparam {String} id The new users e-mail to be added to the database
 *
 */
router.post("/create-room", (req, res) => {
    console.log("yamete");
});

module.exports = router;
