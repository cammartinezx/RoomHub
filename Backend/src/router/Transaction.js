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

/**
 * @memberof Transaction
 * @name Get an user amount summary
 * @path {GET} transaction/get-summary?id=userid
 * @query {String} id User requesting to get the summary
 * @code {200} Successfully retrieved amount summary
 * @code {422} Invalid User
 * @code {404} User not found
 * @code {500} Error message from backend
 * @response {JSON} summary amount own and areOwn amount
 * @example Response:
 * {
 * "Own": 5.333333333333332,
 * "Are_owned": 24.666666666666664
 * }
 */
router.get("/get-summary", (req, res) => {
    transaction_handler.get_summary(req, res);
});

/**
 * @memberof Transaction
 * @name Get all transaction details in the room of specific user
 * @path {GET} transaction/get-transaction?id=userid
 * @query {String} id User requesting to get the summary
 * @code {200} Successfully retrieved all transaction details
 * @code {422} Invalid User
 * @code {404} User not found
 * @code {500} Error message from backend
 * @response {JSON} transaction details
 * @example Response: 
 * {
    "All_Transactions": [
        {
            "transaction_amount": 10,
            "transaction_name": "Toilet Cleaner",
            "creator": "daohl@myumanitoba.ca",
            "paid_by_creator": 3.33,
            "transaction_date": "2024-11-14",
            "owed_to_creator": 6.67,
            "type": "expense",
            "summary": "You paid CAD 3.33 and lent CAD 6.67 for Toilet Cleaner"
        },
        {
            "transaction_date": "2024-11-12",
            "transaction_amount": 2,
            "transaction_name": "dan@gmail.com paid daohl@myumanitoba.ca CAD2",
            "creator": "dan@gmail.com",
            "type": "settle-up"
        },
        {
            "transaction_date": "2024-11-12",
            "transaction_amount": 0.33,
            "transaction_name": "dan@gmail.com paid daohl@myumanitoba.ca CAD 0.33",
            "creator": "dan@gmail.com",
            "type": "settle-up"
        }
    ]
}
 */
router.get("/get-transaction", (req, res) => {
    transaction_handler.get_transaction(req, res);
});

router.post("/settle-up", (req, res) => {
    transaction_handler.settle_debt(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Transaction paths" });
});

module.exports = router;
