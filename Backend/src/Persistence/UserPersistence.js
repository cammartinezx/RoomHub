const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

/**
 * @module Persistence
 */

/**
 * Represents the user persistence layer that is linked to the user table in the database.
 * @class
 */
class UserPersistence {
    // document client to dynamo db and table name to reference the table.
    /**
     * The connection with the dynamodb client
     * @type {DynamoDBClient}
     * @private
     */
    #doc_client;
    /**
     * The name of the user table in the backend
     * @type {string}
     * @private
     */
    #table_name;

    /**
     * Create a new UserPersistence object
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

        // working_client = new DynamoDBClient(local_test_client);
        this.#doc_client = DynamoDBDocumentClient.from(working_client);
        this.#table_name = "users";
    }

    get_doc_client() {
        return this.#doc_client;
    }

    get_table_name() {
        return this.#table_name;
    }

    /**
     * Uses dynamodb Putcommand to add the new user to the database
     * @param {String} user_name "New user's name to be added to the database"
     * @returns {JSON} "Returns a json object with 2 keys; status and message. "
     */
    async save_new_user(user_name) {
        try {
            // add the new user
            const put_command = new PutCommand({
                TableName: "User",
                Item: {
                    user_id: user_name,
                },
                ConditionExpression: "attribute_not_exists(user_id)",
            });

            await this.#doc_client.send(put_command);
            return { status: 200, message: "User Successfully created" };
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 200, message: "This user name already exist" };
            } else {
                throw error;
            }
        }
    }

    async get_user(user_id) {
        console.log("getting user");
        // NB: right now user pk is the user_email, for second iter probably change to using a uuid as pk and user_email as GSI.
        const get_command = new GetCommand({
            TableName: "User",
            Key: {
                user_id: user_id,
            },
        });
        const response = await this.#doc_client.send(get_command);

        let user = response.Item;

        if (user === undefined) {
            return null;
        } else {
            return response.Item;
        }
    }

    /**
     * Updates the users room_id field with the new room id
     * @param {String} room_id "The unique identifier for the room"
     * @param {String} user_id "The id for the user who now belongs to this room"
     */
    async update_user_room(room_id, user_id) {
        const update_command = new UpdateCommand({
            TableName: "User",
            Key: {
                user_id: user_id,
            },
            UpdateExpression: "set room_id = :room_id",
            ExpressionAttributeValues: {
                ":room_id": room_id,
            },
            ReturnValues: "NONE",
        });

        await this.#doc_client.send(update_command);
    }
}

module.exports = UserPersistence;
