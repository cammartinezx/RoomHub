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
    async create_Expense(request, response) {
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
            try {
                await validateUserExist(this.#user_persistence, payer);
                room_id = await this.#user_persistence.get_room_id(payer);
                await validateContributorsAreRoommates(
                    this.#user_persistence,
                    this.#room_persistence,
                    contributors,
                    payer,
                    room_id,
                );
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }

            const transaction_id = uuidv4();
            // create expense.
            await this.#transaction_persistence.generate_new_transaction(
                transaction_id,
                transaction_nm,
                transaction_price,
                room_id,
                date,
            );

            // update balance table with all expense relationships.
            const amount_split = transaction_price / (contributors.length + 1);
            const creditor = payer;
            for (let i = 0; i < contributors.length; i++) {
                const debtor = contributors[i];
                if (creditor.toLowerCase().localeCompare(debtor.toLowerCase()) != 0) {
                    await this.#transaction_persistence.updateBalance(debtor, creditor, amount_split);
                }
            }
            response.status(200).json({ message: "Expense created successfully" });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    generate_settle_up_summary(creditor, debtor) {
        return `${debtor} made a payement to ${creditor}`;
    }

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

            try {
                await validateOutstandingBalance(this.#transaction_persistence, creditor, debtor, amount);
            } catch (error) {
                response.status(409).json({ message: error.message });
                return;
            }

            const transaction_id = uuidv4();
            const transaction_nm = this.generate_settle_up_summary(creditor, debtor);
            // create expense.
            await this.#transaction_persistence.generate_new_transaction(
                transaction_id,
                transaction_nm,
                amount,
                debtor_room_id,
                date,
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

            // get amount you own
            let debt_list = await this.#transaction_persistence.get_amounts_by_role(user_id, "debtor");
            const total_debt = this.sum_array(debt_list);

            // get amount you are owned
            let borrow_list = await this.#transaction_persistence.get_amounts_by_role(user_id, "creditor");
            const total_borrow = this.sum_array(borrow_list);

            return response.status(200).json({
                Own: total_debt,
                Are_owned: total_borrow,
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

            return response.status(200).json({ All_Transactions: details });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
}

module.exports = TransactionHandler;
