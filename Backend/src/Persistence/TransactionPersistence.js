const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    UpdateCommand,
    PutCommand,
    DeleteCommand,
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
     * Uses dynamodb PutCommand to add the new notification to the database
     * @param {String} notif_id "New notification ID to be added to the database"
     * @param {String} msg "New message to be added to the database"
     * @param {String} status "New status to be added to the database"
     * @param {String} from "Notification Sender ID to be added to the database"
     * @param {String} to "Notification Receiver ID to be added to the database"
     * @param {String} type "New type to be added to the database"
     * @param {String} room_id "Room id from Sender to be added to the database"
     * @returns {String} "Returns SUCCESS or FAILED based on each values to be added to notification table"
     */
    async generate_new_transaction(trans_id, name, amount, room_id, date) {
        try {
            // add the new notification
            const put_command = new PutCommand({
                TableName: "Transaction",
                Item: {
                    transaction_id: trans_id,
                    transaction_name: name,
                    transaction_amount: amount,
                    room_id: room_id,
                    transaction_date: date,
                },
                ConditionExpression: "attribute_not_exists(transaction_id) AND attribute_not_exists(room_id)",
            });

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
}

module.exports = TransactionPersistence;
