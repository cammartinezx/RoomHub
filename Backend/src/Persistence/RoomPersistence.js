const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

/**
 * @module Persistence
 */

/**
 * Represents the room persistence layer that is linked to the room table in the database.
 * @class
 */
class RoomPersistence {
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
     * Create a new RoomPersistence object
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
        this.#table_name = "room";
    }

    get_doc_client() {
        return this.#doc_client;
    }

    get_table_name() {
        return this.#table_name;
    }

    async get_room_name(room_id) {
        const get_command = new GetCommand({
            TableName: "Room",
            Key: {
                room_id: room_id,
            },
        });
        const response = await this.#doc_client.send(get_command);

        let room_name = response.Item.name;
        return room_name;
    }

    async generate_new_room(unique_id, room_name, user_id) {
        try {
            // add the new user
            const put_command = new PutCommand({
                TableName: "Room",
                Item: {
                    room_id: unique_id,
                    name: room_name,
                    users: new Set([user_id]),
                },
                ConditionExpression: "attribute_not_exists(user_id)",
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
}

module.exports = RoomPersistence;
