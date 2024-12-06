const { KeyType } = require("@aws-sdk/client-dynamodb");

module.exports = {
    tables: [
        {
            TableName: `User`,
            KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" }],
            AttributeDefinitions: [{ AttributeName: "user_id", AttributeType: "S" }],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
        {
            TableName: `Room`,
            KeySchema: [{ AttributeName: "room_id", KeyType: "HASH" }],
            AttributeDefinitions: [{ AttributeName: "room_id", AttributeType: "S" }],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
        {
            TableName: `Notification`,
            KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
            AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
        {
            TableName: `Task`,
            KeySchema: [{ AttributeName: "task_id", KeyType: "HASH" }],
            AttributeDefinitions: [{ AttributeName: "task_id", AttributeType: "S" }],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
        {
            TableName: `Transaction`,
            KeySchema: [
                { AttributeName: "room_id", KeyType: "HASH" },
                { AttributeName: "transaction_id", KeyType: "RANGE" },
            ],
            AttributeDefinitions: [
                { AttributeName: "room_id", AttributeType: "S" },
                { AttributeName: "transaction_id", AttributeType: "S" },
            ],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
        {
            TableName: `Balance`,
            KeySchema: [
                { AttributeName: "debtor", KeyType: "HASH" },
                { AttributeName: "creditor", KeyType: "RANGE" },
            ],
            AttributeDefinitions: [
                { AttributeName: "debtor", AttributeType: "S" },
                { AttributeName: "creditor", AttributeType: "S" },
            ],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
        {
            TableName: `Review`,
            KeySchema: [{ AttributeName: "review_id", KeyType: "HASH" }],
            AttributeDefinitions: [{ AttributeName: "review_id", AttributeType: "S" }],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
        {
            TableName: `Profiles`,
            KeySchema: [{ AttributeName: "user_id", KeyType: "HASH" }],
            AttributeDefinitions: [{ AttributeName: "user_id", AttributeType: "S" }],
            ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
        },
    ],
};
