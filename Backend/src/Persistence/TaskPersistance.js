const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

/**
 * @module Persistence
 */

/**
 * Represents the task persistence layer that is linked to the task table in the database.
 * @class
 */
class TaskPersistence {
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
     * Create a new taskPersistence object
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
        this.#table_name = "task";
    }

    get_doc_client() {
        return this.#doc_client;
    }

    get_table_name() {
        return this.#table_name;
    }

    /**
     *
     * @param {String} task_id "The unique identifier for the room"
     * @returns {String} task_description "description of the task"
     */
    async get_task_description(task_id) {
        const get_command = new GetCommand({
            TableName: "Task",
            Key: {
                task_id: task_id,
            },
        });
        const response = await this.#doc_client.send(get_command);

        let task_description = response.task_description;
        if (task_description === undefined) throw new Error("Task doesn't have a description--Service Unavailable");
        return task_description;
    }

    /**
     *
     * @param {String} unique_id "The unique identifier for the room"
     * @param {String} task_name "The room name as defined by user or function caller"
     * @param {String} user_id "Id of user belonging to the room."
     * @returns {String} "SUCCESS OR FAILURE - if the db write succeeded or failed."
     */
    async generate_new_task(unique_id, task_description, user_id, due_date, complete) {
        try {
            // add the new user
            const put_command = new PutCommand({
                TableName: "Task",
                Item: {
                    task_id: unique_id,
                    task_description: task_description,
                    asignee: user_id,
                    due_date: due_date,
                    complete: false,
                },
                ConditionExpression: "attribute_not_exists(task_id)",
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

module.exports = TaskPersistence;
