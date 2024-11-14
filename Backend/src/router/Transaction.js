/**
 * @namespace Transaction
 * @description Routes related to transactions
 */
const express = require("express");
const router = express.Router();
const TransactionHandler = require("../Handler/TransactionHandler");

const transaction_handler = new TransactionHandler();

/**
 * @memberof Transaction
 * @name Create an expense
 * @path {POST} transaction/create-expense
 * @body {String} name The transaction name
 * @body {int} price The cost of the expense
 * @body {String} payer The user that created the transaction
 * @body {list} contributors The list of people that contributed to the transaction
 * @body {String} date Date representing the date the transaction was created. (yyyy-mm-dd)
 * @code {200} Expense created successfully
 * @code {404} One or more contributors no longer belongs to this room
 * @code {404} User does not exist
 * @code {422} Invalid Transaction Name
 * @code {422} Invalid Payer Name
 * @code {422} Invalid Price- Price must be a positive number
 * @code {422} Invalid Date
 * @code {422} Invalid Contributors - Contributors must be a non empty list
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
  "owed": 55.67,
  "owns": 4.33,
  "relationships": [
    "You owe hungludao@gmail.com CAD 45.67",
    "You owe josephdoan15@outlook.com CAD 10",
    "dan@gmail.com owes you CAD 1",
    "hungludao@gmail.com owes you CAD 3.33"
  ]
}
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

/**
 * @memberof Transaction
 * @name Settle up debt
 * @path {POST} transaction/settle-up
 * @body {String} debtor The user paying off debt
 * @body {int} amount The amount paid by debtor to creditor
 * @body {String} creditor The user owed money
 * @body {String} date Date representing the date the transaction was created. (yyyy-mm-dd)
 * @code {200} Transaction created successfully
 * @code {404} Users are not roommates
 * @code {404} User does not exist
 * @code {409} Settle up amount must be less than or equal to outstanding balance
 * @code {409} No outstanding balance to be settled
 * @code {422} Invalid Debtors Name
 * @code {422} Invalid Creditors Name
 * @code {422} Invalid Settle Up amount- Settle Up amount must be a positive number
 * @code {422} Invalid Date
 * @code {500} Backend error from the database
 * @response {String} message See description of the different status codes
 */

router.post("/settle-up", (req, res) => {
    transaction_handler.settle_debt(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Transaction paths" });
});

module.exports = router;
