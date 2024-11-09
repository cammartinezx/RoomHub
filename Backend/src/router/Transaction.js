/**
 * @namespace Transaction
 * @description Routes related to transactions
 */
const express = require("express");
const router = express.Router();
const TransactionHandler = require("../Handler/TransactionHandler");

const transaction_handler = new TransactionHandler();

/**
 * @memberof Notification
 * @name Create some new announcement notifications
 * @path {POST} notification/send-announcement
 * @body {String} from The sender user ID
 * @body {String} message The message of announcement
 * @body {String} type The type of notification: must be announcement
 * @code {200} Notify you are the only person in this room
 * @code {200} Announcement Successfully sent
 * @code {404} Error Sending Announcement - User not found
 * @code {400} Error Sending Announcement - Message is empty
 * @code {500} Backend error from the database
 * @response {String} message See description of the different status codes
 */
router.post("/create-expense", (req, res) => {
    transaction_handler.create_Expense(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Transaction paths" });
});

module.exports = router;
