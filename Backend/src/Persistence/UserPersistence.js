const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

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
}

module.exports = { UserPersistence };
