const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    PutCommand,
    DeleteCommand,
    QueryCommand,
    ScanCommand,
} = require("@aws-sdk/lib-dynamodb");
const Services = require("../Utility/Services");
require("dotenv").config();

/**
 * @module Persistence
 */

/**
 * Represents the notification persistence layer that is linked to the notification table in the database
 * @class
 */

class TransactionPersistence {
    // document client to dynamo db and table name to reference the table.
    /**
     * The connection with the dynamodb client
     * @type {DynamoDBClient}
     * @private
     */
    #doc_client;
    /**
     * The name of the notification table in the backend
     */
    #table_name;

    /**
     * Create a new NotificationPersistence object
     * @constructor
     */
    constructor() {
        // check if test is running
        const isTest = process.env.JEST_WORKER_ID;

        const remote_client = {
            region: process.env.REGION,
            credentials: {
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
        };

        const local_test_client = {
            region: "local-env",
            endpoint: "http://localhost:8000",
            sslEnabled: false,
            convertEmptyValues: true,
            credentials: {
                accessKeyId: "fakeMyKeyId", // Dummy key
                secretAccessKey: "fakeSecretAccessKey", // Dummy secret
            },
        };

        let working_client;
        if (isTest) {
            working_client = new DynamoDBClient(local_test_client);
        } else {
            working_client = new DynamoDBClient(remote_client);
        }

        this.#doc_client = DynamoDBDocumentClient.from(working_client);
        this.#table_name = "Transaction";
    }

    get_doc_client() {
        return this.#doc_client;
    }

    get_table_name() {
        return this.#table_name;
    }

    /**
     * Uses dynamodb PutCommand to create a new transactio
     * @param {String} trans_id "Transaction Id of the new transaction"
     * @param {String} name "Name of the transaction"
     * @param {int} amount "The cost of the transaction"
     * @param {String} room_id "Room id of user involved in the transaction"
     * @param {String} date "Date the transaction was created"
     * @param {String} creator "User id that created the transaction"
     * @param {int} paid_by_creator "The amount paid by the creator"
     * @param {int} paid_by_creator "The amount paid by the creator"
     * @param {String} type "The type of transaction"
     * @returns {String} "Returns SUCCESS or FAILED based on each values to be added to transaction table"
     */
    async generate_new_transaction(
        trans_id,
        name,
        amount,
        room_id,
        date,
        creator,
        paid_by_creator,
        owed_to_creator,
        type,
    ) {
        try {
            let put_command;
            if (type === "expense") {
                // add the expense transaction
                put_command = new PutCommand({
                    TableName: "Transaction",
                    Item: {
                        transaction_id: trans_id,
                        transaction_name: name,
                        transaction_amount: amount,
                        room_id: room_id,
                        transaction_date: date,
                        creator: creator,
                        paid_by_creator: paid_by_creator,
                        owed_to_creator: owed_to_creator,
                        type: type,
                    },
                    ConditionExpression: "attribute_not_exists(transaction_id) AND attribute_not_exists(room_id)",
                });
            } else {
                // add the settle up transaction
                put_command = new PutCommand({
                    TableName: "Transaction",
                    Item: {
                        transaction_id: trans_id,
                        transaction_name: name,
                        transaction_amount: amount,
                        room_id: room_id,
                        transaction_date: date,
                        creator: creator,
                        type: type,
                    },
                    ConditionExpression: "attribute_not_exists(transaction_id) AND attribute_not_exists(room_id)",
                });
            }

            await this.#doc_client.send(put_command);
            return "SUCCESS";
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return "FAILED";
            } else {
                throw error;
            }
        }
    }

    /**
     * Use dyanmodb getcommand to retrieve the record with debtor and creditor
     * @param {String} debtor "Id of the user owing"
     * @param {String} creditor "Id of the user owed"
     * @returns {Object} balance "Object representing debtor, creditor and amount owed"
     */
    async getBalanceRecord(debtor, creditor) {
        const get_command = new GetCommand({
            TableName: "Balance",
            Key: {
                debtor: debtor,
                creditor: creditor,
            },
        });

        const result = await this.#doc_client.send(get_command);
        let balance;
        if (result.Item != undefined) {
            balance = result.Item;
        } else {
            balance = null;
        }
        return balance;
    }

    // read as user1 owes user2 amount dollars.
    // this does a conditional insert if the item doesn't exist
    /**
     * Use dyanmodb updatecommand to update the debtors debt with new amount.
     * @param {String} debtor "Id of the user owing"
     * @param {String} creditor "Id of the user owed"
     * @param {int} new_amount "The amount to be paid"
     */
    async updateBalance(debtor, creditor, new_amount) {
        const update_command = new UpdateCommand({
            TableName: "Balance",
            Key: {
                debtor: debtor,
                creditor: creditor,
            },
            UpdateExpression: "SET amount = if_not_exists(amount, :start) + :newAmount",
            ExpressionAttributeValues: {
                ":newAmount": new_amount,
                ":start": 0, // Initial value if amount does not exist
            },
        });

        await this.#doc_client.send(update_command);
    }

    /**
     * Uses dynamoDB QueryCommand and ScanCommand to get a list of amount from debtor or creditor
     * @param {String} user_id "New user's name to be added to the database"
     * @param {String} role "role can be either debtor or creditor"
     * @returns {Array} "An array of all debt or credit amount relate to user"
     */
    async get_amounts_by_role(user_id, role) {
        if (role !== "debtor" && role !== "creditor") {
            throw new Error("Role must be either debtor or creditor");
        }

        let result;
        if (role === "debtor") {
            // Query based on debtor (primary key)
            const queryCommand = new QueryCommand({
                TableName: "Balance",
                KeyConditionExpression: "debtor = :user",
                ExpressionAttributeValues: {
                    ":user": user_id,
                },
            });

            result = await this.#doc_client.send(queryCommand);
        } else if (role === "creditor") {
            // scan based on creditor (not indexed)
            const scanCommand = new ScanCommand({
                TableName: "Balance",
                FilterExpression: "creditor = :user",
                ExpressionAttributeValues: {
                    ":user": user_id,
                },
            });

            result = await this.#doc_client.send(scanCommand);
        }

        // return amounts or an empty array if no results
        const items = result.Items || [];
        return items.map((item) => item.amount);
    }

    /**
     * Use dynamoDB QueryCommand to get all the transaction from specific room
     * @param {String} room_id "Room is to be added to the database"
     * @returns {Array} "Return a list of all transactions in room"
     */
    async get_transaction_details(room_id) {
        const queryCommand = new QueryCommand({
            TableName: "Transaction",
            KeyConditionExpression: "room_id = :room_id",
            ExpressionAttributeValues: {
                ":room_id": room_id,
            },
            ProjectionExpression:
                "#type, creator, transaction_name, transaction_date, transaction_amount, owed_to_creator, paid_by_creator",
            ExpressionAttributeNames: {
                "#type": "type",
            },
        });

        const result = await this.#doc_client.send(queryCommand);

        return result.Items || [];
    }
}

module.exports = TransactionPersistence;
