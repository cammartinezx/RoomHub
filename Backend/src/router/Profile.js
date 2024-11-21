/** Routes
 * @namespace Task
 * @description Routes related to tasks
 */
const express = require("express");
const router = express.Router();
const ProfileHandler = require("../Handler/ProfileHandler");
const profile_handler = new ProfileHandler(new ProfileHandler());

router.post("/:id/create-profile", (req, res) => {
    profile_handler.create_profile(req, res);
});

router.patch("/:id/update-profile", (req, res) => {
    profile_handler.update_profile(req, res);
});

router.patch("/:id/update-tags", (req, res) => {
    profile_handler.update_tags(req, res);
});

router.get("/:id/get-profile", (req, res) => {
    profile_handler.get_profile(req, res);
});

router.post("/:id/check-match", (req, res) => {
    profile_handler.check_match(req, res);
});

module.exports = router;
