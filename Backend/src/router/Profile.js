/** Routes
 * @namespace Task
 * @description Routes related to tasks
 */
const express = require("express");
const router = express.Router();
const ProfileHandler = require("../Handler/ProfileHandler");
const profile_handler = new TaskHandler(new ProfileHandler());


router.post("/:id/create-profile", (req, res) => {
    profile_handler.create_profile(req, res);
});

router.patch("/:id/update-profile", (req, res) => {
    profile_handler.update_profile(req, res);
});

router.get("/:id/get-profile", (req, res) => {
    profile_handler.get_profile(req, res);
});

module.exports = router;
