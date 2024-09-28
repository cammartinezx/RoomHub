const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

class UserPersistence {
    // document client to dynamo db and table name to reference the table.
    #doc_client;
    #table_name;

    constructor() {
        // check if test is running
        const isTest = process.env.JEST_WORKER_ID;

        const remote_client = {
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
        this.#table_name = "users";
    }

    get_doc_client() {
        return this.#doc_client;
    }

    get_table_name() {
        return this.#table_name;
    }

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
                return { status: 409, message: "This user name already exist" };
            } else {
                throw error;
            }
        }
    }
}

module.exports = UserPersistence;
