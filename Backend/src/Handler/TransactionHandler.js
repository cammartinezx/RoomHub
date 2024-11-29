const Services = require("../Utility/Services");
const { v4: uuidv4 } = require("uuid");
const {
    validateString,
    validatePositiveInteger,
    validateDate,
    validateContributorsAreRoommates,
    validateUserExist,
    validateUsersAreRoommates,
    validateOutstandingBalance,
    validateNonEmptyList,
} = require("../Utility/validator");

/**
 * @module Handler
 */

/**
 * Represents the notification handler
 * @class
 */
class TransactionHandler {
    /**
     * The room persistence object used by the room handler.
     * @type {string}
     * @private
     */
    #room_persistence;
    /**
     * The notification object used by the handler
     * @type {String}
     * @private
     */
    #notification_persistence;
    /**
     * The user persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #user_persistence;
    /**
     * The transaction object used by the handler
     * @type {String}
     * @private
     */
    #transaction_persistence;

    /**
     * Create a new NotificationHandler object
     * @constructor
     */
    constructor() {
        this.#user_persistence = Services.get_user_persistence();
        this.#room_persistence = Services.get_room_persistence();
        this.#notification_persistence = Services.get_notification_persistence();
        this.#transaction_persistence = Services.get_transaction_persistence();
    }

    get_transaction_persistence() {
        return this.#transaction_persistence;
    }

    get_room_persistence() {
        return this.#room_persistence;
    }

    get_notification_persistence() {
        return this.#notification_persistence;
    }

    get_user_persistence() {
        return this.#user_persistence;
    }
    // async #balanceRecordExist(debtor, creditor) {
    //     const result = await this.#transaction_persistence.getBalanceRecord(debtor, creditor);
    //     if (result != null) return true;
    //     else return false;
    // }

    /**
     * Add a new expense to the persistence Layer
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     */
    async create_expense(request, response) {
        try {
            const transaction_nm = request.body.name.trim();
            const transaction_price = request.body.price;
            const payer = request.body.payer.trim();
            const contributors = request.body.contributors;
            const date = request.body.date.trim();
            // sync errors
            try {
                validateString(transaction_nm, "Transaction Name");
                validateString(payer, "Payer Name");
                validatePositiveInteger(transaction_price, "Price");
                validateDate(date);
                validateNonEmptyList(contributors, "Contributors");
            } catch (error) {
                response.status(422).json({ message: error.message });
                return;
            }

            // async errors check.
            let room_id;
            const creditor = payer;
            try {
                await validateUserExist(this.#user_persistence, payer);
                room_id = await this.#user_persistence.get_room_id(payer);
                await validateContributorsAreRoommates(this.#room_persistence, contributors, payer, room_id);
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }

            const transaction_id = uuidv4();
            // amount split per person
            const amount_split = transaction_price / (contributors.length + 1);
            const owed_to_creator = Math.round((transaction_price - amount_split) * 100) / 100;
            // create expense.
            await this.#transaction_persistence.generate_new_transaction(
                transaction_id,
                transaction_nm,
                transaction_price,
                room_id,
                date,
                payer,
                Math.round(amount_split * 100) / 100,
                owed_to_creator,
                "expense",
            );

            // update balance table with all expense relationships.
            for (let i = 0; i < contributors.length; i++) {
                const debtor = contributors[i];
                if (creditor.toLowerCase().localeCompare(debtor.toLowerCase()) != 0) {
                    // get the debtors name as well.
                    let debtorObj = await user_persistence.get_user(userId);
                    await this.#transaction_persistence.updateBalance(
                        debtor,
                        creditor,
                        Math.round(amount_split * 100) / 100,
                    );
                }
            }
            response.status(200).json({ message: "Expense created successfully" });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    generate_settle_up_summary(creditor, debtor, amount) {
        return `${debtor} paid ${creditor} $${amount.toFixed(2)}`;
    }

    /**
     * Settle up a users debt.
     * @async
     * @param {Express.request} request "Request received by the router"
     * @param {Express.response} response "Response to be sent back to the service that sent the original request"
     */
    async settle_debt(request, response) {
        try {
            const debtor = request.body.debtor.trim();
            const creditor = request.body.creditor.trim();
            const amount = request.body.amount;
            const date = request.body.date.trim();

            // sync errors
            try {
                validateString(debtor, "Debtors Name");
                validateString(creditor, "Creditors Name");
                validatePositiveInteger(amount, "Settle Up amount");
                validateDate(date);
            } catch (error) {
                response.status(422).json({ message: error.message });
                return;
            }

            let debtor_room_id;
            try {
                // async errors check.
                await validateUserExist(this.#user_persistence, debtor);
                await validateUserExist(this.#user_persistence, creditor);
                debtor_room_id = await this.#user_persistence.get_room_id(debtor);
                await validateUsersAreRoommates(this.#room_persistence, creditor, debtor_room_id);
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }

            // async error check
            try {
                await validateOutstandingBalance(this.#transaction_persistence, creditor, debtor, amount);
            } catch (error) {
                response.status(409).json({ message: error.message });
                return;
            }

            const transaction_id = uuidv4();
            const creditorObj = await this.#user_persistence.get_user(creditor);
            const debtorObj = await this.#user_persistence.get_user(debtor);
            const transaction_nm = this.generate_settle_up_summary(creditorObj.name, debtorObj.name, amount);
            // create expense.
            await this.#transaction_persistence.generate_new_transaction(
                transaction_id,
                transaction_nm,
                amount,
                debtor_room_id,
                date,
                debtor,
                "",
                "",
                "settle-up",
            );

            // update balance table with expense relationship
            await this.#transaction_persistence.updateBalance(debtor, creditor, -amount);
            response.status(200).json({ message: "Transaction created successfully" });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    /**
     * Get an amount of own and are owned of specific user.
     * @param {Express.request} request "Request received by the router."
     * @param {Express.response} response "Response to be sent back to the service that sent the original request."
     * @returns {Express.response} "A response object which contains the response to the request."
     */
    async get_summary(request, response) {
        try {
            const { id } = request.query;
            const user_id = id.trim().toLowerCase();

            // sync errors
            try {
                validateString(user_id, "User ID");
            } catch (error) {
                return response.status(422).json({ message: error.message });
            }

            // async errors check
            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }

            // get amount you owe
            let debt_list = await this.#transaction_persistence.get_amounts_by_role(user_id, "debtor");
            const total_debt = this.sum_array(debt_list);

            // get amount you are owed
            let borrow_list = await this.#transaction_persistence.get_amounts_by_role(user_id, "creditor");
            const total_borrow = this.sum_array(borrow_list);

            const relationships = [];
            // const relationships_debt = await this.#transaction_persistence.get_relationships_by_role(user_id, "debtor");
            const relationships_debt = [];
            let all_debts = await this.#transaction_persistence.get_relationships_by_role(user_id, "debtor");
            all_debts.Items.forEach(async (item) => {
                const creditor = await this.#user_persistence.get_user(item.creditor);
                relationships_debt.push(`You owe ${creditor.name} $${item.amount}`);
            });

            // const relationships_borrow = await this.#transaction_persistence.get_relationships_by_role(
            //     user_id,
            //     "creditor",
            // );
            const relationships_borrow = [];
            let all_credits = await this.#transaction_persistence.get_relationships_by_role(user_id, "creditor");
            all_credits.Items.forEach(async (item) => {
                const debtor = await this.#user_persistence.get_user(item.debtor);
                relationships_borrow.push(`${debtor.name} owes you $${item.amount}`);
            });

            relationships.push(...relationships_debt, ...relationships_borrow);

            return response.status(200).json({
                owed: total_debt,
                owns: total_borrow,
                relationships: relationships,
            });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    /**
     * Return a sum of all elements in array.
     * @param {Array} list "Array of all values."
     * @returns {Double} "Sum of all values."
     */
    sum_array(list) {
        return list.reduce((sum, num) => sum + num, 0);
    }

    /**
     * Get all of transactions in room of specific user.
     * @param {Express.request} request "Request received by the router."
     * @param {Express.response} response "Response to be sent back to the service that sent the original request."
     * @returns {Express.response} "A response object which contains the response to the request."
     */
    async get_transaction(request, response) {
        try {
            const { id } = request.query;
            const user_id = id.trim().toLowerCase();

            // sync errors
            try {
                validateString(user_id, "User ID");
            } catch (error) {
                return response.status(422).json({ message: error.message });
            }

            // async errors check
            let room_id;
            try {
                await validateUserExist(this.#user_persistence, user_id);
                room_id = await this.#user_persistence.get_room_id(user_id);
            } catch (error) {
                return response.status(404).json({ message: error.message });
            }

            let details = await this.#transaction_persistence.get_transaction_details(room_id);
            // Add summary for transactions of type "expense"
            details = details.map((transaction) => {
                if (transaction.type === "expense") {
                    const creator = transaction.creator;
                    if (creator === user_id) {
                        transaction.summary = `You paid CAD ${transaction.paid_by_creator.toFixed(2)} and lent CAD ${transaction.owed_to_creator.toFixed(2)}`;
                    } else {
                        transaction.summary = `${transaction.creator} paid CAD ${transaction.paid_by_creator.toFixed(2)} and lent CAD ${transaction.owed_to_creator.toFixed(2)}`;
                    }
                }
                return transaction;
            });
            return response.status(200).json({ All_Transactions: details });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
}

module.exports = TransactionHandler;
