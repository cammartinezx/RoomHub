// /** Routes
//  * @module User
//  */

/**
 * @namespace User
 * @description Routes related to users
 */
const express = require("express");
const router = express.Router();
const UserInfoHandler = require("../Handler/UserInfoHandler");

const user_info_handler = new UserInfoHandler();

/**
 * @memberof User
 * @name Add a new user
 * @path {POST} user/add-user
 * @body {String} id The new users e-mail to be added to the database
 * @code {200} This user name already exist
 * @code {200} User Successfully created
 * @code {400} Error Creating User- User id is invalid
 * @code {500} Backend error from the database
 * @response {String} message See description of the different status codes
 */
router.post("/add-user", (req, res) => {
    user_info_handler.create_user(req, res);
});

/**
 * @memberof User
 * @name Get a users room name
 * @path {GET} user/:id/get-room
 * @params {String} :id is the id of the user whose room we are trying to get.
 * @code {200} NA
 * @code {200} A valid room name
 * @code {400} This username is invalid
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {String} room_name See description of the different status codes
 */
router.get("/:id/get-room", (req, res) => {
    user_info_handler.get_user_room(req, res);
});

/**
 * @memberof User
 * @name Get an user notification
 * @path {GET} user/:id/get-notification
 * @params {String} :id is the id of the user who we are trying to get.
 * @code {200} A valid notification
 * @code {400} Invalid username
 * @code {500} Backend error from the database
 * @response {JSON} All_Notifications list of Notification See description of the different status codes
 * @example Note jon-request notifications from is an id, but for announcement from is a name Response: {
    "All_Notifications": [
        {
            "notification_id": "111-333"
            "from": "test@gmail.com"
            "msg": "hung@gmail.com requests to join your room",
            "type": "join-request"
        },
        {
            "notification_id": "111-444"
            "from": "test2@gmail.com"
            "msg": "dan@gmail.com invites luke@gmail.com to join their room",
            "type": "invite"
        }
    ]
}
 */
router.get("/:id/get-notification", (req, res) => {
    user_info_handler.get_user_notification(req, res);
});

/**
 * @memberof User
 * @name Get a notify message when user leave the room successfully
 * @path {GET} user/:id/leave-room
 * @params {String} :id is the id of the user whose room we are trying to get.
 * @code {200} A valid message
 * @code {400} This username is invalid
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {String} message See description of the different status codes
 * @example
    If there is only one user in the room
        Response: { "message": "The room is being deleted and user leave the room successfully" }
If there is more than one user in the room
        Response: { "message": "User leave the room successfully" }
 */
router.get("/:id/leave-room", (req, res) => {
    user_info_handler.leave_user_room(req, res);
});

/**
 * @memberof User
 * @name Get a warning message when user want to leave the room
 * @path {GET} user/:id/leave-warning
 * @params {String} :id is the id of the user whose room we are trying to get.
 * @code {200} A valid message
 * @code {400} This username is invalid
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {String} message See description of the different status codes
 * @example
    If there is only one user in the room
        Response: { "message": "Warning: If you leave, the room will be deleted!" }
If there is more than one user in the room
        Response: { "message": "Warning: Are you sure want to leave this room!" }
 */
router.get("/:id/leave-warning", (req, res) => {
    user_info_handler.get_user_warning(req, res);
});

/**
 * @memberof User
 * @name Get a message notify if you have roommate or not
 * @path {GET} user/:id/get-roommate
 * @params {String} :id is the id of the user whose room we are trying to get.
 * @code {200} A valid message
 * @code {400} This username is invalid
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {String} message See description of the different status codes
 * @example
    If there is only one user in the room
        Response: { "message": "You have no roommate" }
If there is more than one user in the room
        Response: { "message": "You have at least one roommate" }
 */
router.get("/:id/get-roommate", (req, res) => {
    user_info_handler.get_roommate(req, res);
});

/**
 * @memberof User
 * @name Get a user's roommates
 * @path {GET} user/:id/get-user-roommates
 * @params {String} :id is the id of the user whose roommates we are trying to get.
 * @code {200} roommates list
 * @code {403} User not found
 * @code {500} Backend error from the database
 * @response {JSON} roommates A list of roommates associated with the user
 * @example Response: {
    "all_roommates": [
        [
            "dan@gmail.com",
            "Danny"
        ],
        [
            "daohl@myumanitoba.ca",
            "luke"
        ],
        [
            "hungludao@gmail.com",
            "luker"
        ]
    ]
} */
router.get("/:id/get-user-roommates", (req, res) => {
    user_info_handler.get_user_roommates(req, res);
});

/**
 * @memberof User
 * @name Delete a notification of specific user
 * @path {Delete} user/:id/notification/:notif_id
 * @params {String} :id is the id of the user we are trying to get.
 * @params {String} :notif_id is the id of the notification from user with user id above
 * @code {200} A valid message
 * @code {400} This username is invalid
 * @code {400} The notification is is invalid
 * @code {404} User not found
 * @code {404} Notification not found
 * @code {500} Backend error from the database
 * @response {String} message See description of the different status codes
 * @example
    If notification exist for user
        Response: { "message": "Notification deleted successfully" }
If notification no longer or never exist for user
        Response: { "message": "Notification not found" }
 */
router.delete("/:id/notification/:notif_id", (req, res) => {
    user_info_handler.delete_notification(req, res);
});

/**
 * @memberof User
 * @name Get Review Page
 * @path {GET} user/:id/review-page/:roommate_id
 * @params {String} :id2 The user ID to check for a profile
 * @code {200} Profile exists
 * @code {400} Profile does not exist
 * @code {500} Error message from backend
 */
router.get("/:id/review-page/:roommate_id", (req, res) => {
    user_info_handler.get_review_page(req, res);
});

/**
 * @memberof User
 * @name Send Review
 * @path {POST} user/send-review
 * @body {String} reviewed_by The ID of the user submitting the review.
 * @body {String} reviewed The ID of the user being reviewed.
 * @body {Number} overall The overall score given to the roommate (1 to 5).
 * @body {Number} cleanliness Rating for cleanliness (1 to 5).
 * @body {Number} noise_levels Rating for respect for noise levels (1 to 5).
 * @body {Number} respect Rating for respect for personal space (1 to 5).
 * @body {Number} communication Rating for communication and conflict resolution (1 to 5).
 * @body {Number} paying_rent Rating for paying rent/utilities on time (1 to 5).
 * @body {Number} chores Rating for participation in chores/tasks (1 to 5).
 * @code {200} Review successfully submitted
 * @code {500} Error message from backend
 */
router.post("/send-review", (req, res) => {
    user_info_handler.send_review(req, res);
});

/**
 * @memberof User
 * @name Find Roommate Page
 * @path {GET} user/:id/find-roommate-page
 * @params {String} :id The user ID to check for a profile
 * @code {200} User has a profile
 * @code {400} User does not have a profile
 * @code {500} Error message from backend
 */
router.get("/:id/find-roommate-page", (req, res) => {
    user_info_handler.find_roommate_page(req, res);
});

/**
 * @memberof User
 * @name Get New Matches
 * @path {GET} user/:id/get-new-matches
 * @params {String} :id The user ID for whom matches are to be fetched
 * @code {200} List of matching profiles
 * @code {400} User does not have a profile
 * @code {400} User profile incomplete - missing location
 * @code {500} Error message from backend
 * @response {JSON} profiles A list of matching profiles based on location
 */
router.get("/:id/get-new-matches", (req, res) => {
    user_info_handler.get_new_matches(req, res);
});

/**
 * @memberof User
 * @name Get an user unread notification
 * @path {GET} user/:id/get-unread-notification
 * @params {String} :id is the id of the user who we are trying to get.
 * @code {200} A valid notification
 * @code {422} Invalid username
 * @code {404} User not found
 * @code {500} Backend error from the database
 * @response {JSON} Unread_Notification list of unread notifications from specific user
 * @example 
 * If there exist unread notification for specific user
    * Response: {
    * "Unread_Notification": [
        {
        "msg": "water leak",
        "type": "announcement",
        "status": "unread"
        },
        {
        "msg": "Lost keys",
        "type": "announcement",
        "status": "unread"
        },
        {
        "msg": "Maintenance required",
        "type": "announcement",
        "status": "unread"
        },
        {
        "msg": "A new expense \"paper\" has been created and split with: dan@gmail.com.",
        "type": "announcement",
        "status": "unread"
        }
    ]
 * }
 * If there is no unread notification for specific user
 * Response: {
* "Unread_Notification": []
 * }
 */
router.get("/:id/get-unread-notification", (req, res) => {
    user_info_handler.get_unread_notifs(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ Message: "Welcome to the User paths" });
});

module.exports = router;
