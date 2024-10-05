/** Routes
 * @module User
 */
const express = require("express");
const router = express.Router();
const UserInfoHandler = require("../Handler/UserInfoHandler");

const user_info_handler = new UserInfoHandler();

/**
 *
 * @name Add a new user
 * @route {POST} user/add-user
 * @bodyparam {String} id The new users e-mail to be added to the database
 *
 */
router.post("/add-user", (req, res) => {
    user_info_handler.create_user(req, res);
});

router.get("/:id/get-room", (req, res) => {
    console.log(req.params.id);
    user_info_handler.get_user_room(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ Message: "Welcome to the User paths" });
});

module.exports = router;
