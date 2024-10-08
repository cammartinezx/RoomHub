const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

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

let working_client = new DynamoDBClient(local_test_client);
let doc_client = DynamoDBDocumentClient.from(working_client);
let table_name = "room";

async function populate_db() {
    try {
        // add the new user
        const put_command_user = new PutCommand({
            TableName: "User",
            Item: {
                user_id: "test@gmail.com",
                notifications: new Set(["123", "456"]),
                room_id: "rm_11",
            },
        });

        const put_command_user2 = new PutCommand({
            TableName: "User",
            Item: {
                user_id: "test2@gmail.com",
            },
        });
        await doc_client.send(put_command_user);
        await doc_client.send(put_command_user2);
    } catch (error) {
        throw new Error("Something went wrong " + error.message);
    }
}

async function teardown_db() {}
module.exports = {
    populate_db,
};
