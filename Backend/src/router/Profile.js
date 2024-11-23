/** Routes
 * @namespace Profile
 * @description Routes related to Profiles
 */
const express = require("express");
const router = express.Router();
const ProfileHandler = require("../Handler/ProfileHandler");
const profile_handler = new ProfileHandler(new ProfileHandler());

/**
 * @memberof Profile
 * @name Create a user profile
 * @path {POST} /:id/create-profile
 * @params {String} :id is the ID of the user creating the profile.
 * @code {200} Profile created successfully
 * @code {422} Validation error in request data
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {Object} message Response message indicating success or failure
 */
router.post("/:id/create-profile", (req, res) => {
    profile_handler.create_profile(req, res);
});

/**
 * @memberof Profile
 * @name Update a user profile
 * @path {PATCH} /:id/update-profile
 * @params {String} :id is the ID of the user updating the profile.
 * @code {200} Profile updated successfully
 * @code {422} Validation error in request data
 * @code {404} User or profile not found
 * @code {500} Backend error from the database
 * @response {Object} message Response message indicating success or failure
 */
router.patch("/:id/update-profile", (req, res) => {
    profile_handler.update_profile(req, res);
});

/**
 * @memberof Profile
 * @name Update profile tags
 * @path {PATCH} /:id/update-tags
 * @params {String} :id is the ID of the user updating tags.
 * @body {Array} tags List of tags to update
 * @code {200} Tags updated successfully
 * @code {422} Validation error in request data
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {Object} message Response message indicating success or failure
 */
router.patch("/:id/update-tags", (req, res) => {
    profile_handler.update_tags(req, res);
});

/**
 * @memberof Profile
 * @name Get a user profile
 * @path {GET} /:id/get-profile
 * @params {String} :id is the ID of the user whose profile is being retrieved.
 * @code {200} Profile retrieved successfully
 * @code {422} Validation error in request data
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {Object} profile The user profile object
 */
router.get("/:id/get-profile", (req, res) => {
    profile_handler.get_profile(req, res);
});

/**
 * @memberof Profile
 * @name Check match for a user
 * @path {POST} /:id/check-match
 * @params {String} :id is the ID of the user checking for a match.
 * @body {String} id ID of the user being liked.
 * @code {200} Match or like action completed successfully
 * @code {422} Validation error in request data
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {Object} message Response message indicating the match or like status
 */
router.post("/:id/check-match", (req, res) => {
    profile_handler.check_match(req, res);
});

module.exports = router;
