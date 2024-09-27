const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

class UserPersistence {
    // document client to dynamo db and table name to reference the table.
    #doc_client;
    #table_name;

    constructor() {
        const client = new DynamoDBClient({});
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
        const command = new GetCommand({
            TableName: "User",
            Key: {
                user_id: user_name,
            },
        });

        const response = await this.#doc_client.send(command);
        console.log(response);
        // return response;
    }
}

module.exports = { UserPersistence };
