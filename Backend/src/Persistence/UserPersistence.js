const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

class UserPersistence {
    // document client to dynamo db and table name to reference the table.
    #doc_client;
    #table_name;

    constructor() {
        const client = new DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.#doc_client = DynamoDBDocumentClient.from(client);
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
            const get_command = new GetCommand({
                TableName: "User",
                Key: {
                    user_id: user_name,
                },
            });
            const get_command_result = await this.#doc_client.send(get_command);
            console.log(get_command_result);
            if ("Item" in get_command_result && get_command_result.Item.user_id === user_name) {
                // then the user exist
                return { status: 409, message: "This user name already exist" };
            } else {
                // add the new user
                const put_command = new PutCommand({
                    TableName: "User",
                    Item: {
                        user_id: user_name,
                    },
                });

                const put_command_response = await this.#doc_client.send(put_command);
                console.log(put_command_response);
                return { status: 200, message: "User Successfully created" };
            }
        } catch (error) {
            console.log(error);
            throw error;
        }

        // return response;
    }
}

module.exports = UserPersistence;
