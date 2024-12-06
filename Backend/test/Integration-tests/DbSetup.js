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
        // adding users
        const put_command_user = new PutCommand({
            TableName: "User",
            Item: {
                user_id: "test@gmail.com",
                notification: ["123", "456", "delete_req"],
                room_id: "rm_11",
            },
        });

        const put_command_user2 = new PutCommand({
            TableName: "User",
            Item: {
                user_id: "test2@gmail.com",
            },
        });
        const put_command_user3 = new PutCommand({
            TableName: "User",
            Item: {
                user_id: "test11@gmail.com",
            },
        });
        await doc_client.send(put_command_user);
        await doc_client.send(put_command_user2);
        await doc_client.send(put_command_user3);

        //adding rooms
        const put_command_room = new PutCommand({
            TableName: "Room",
            Item: {
                room_id: "rm_11",
                name: "test_room1",
                users: new Set(["test@gmail.com"]),
                tasks: ["task1", "task2", "task4"],
            },
        });

        const put_command_room2 = new PutCommand({
            TableName: "Room",
            Item: {
                room_id: "rm_bad",
            },
        });

        const put_command_room3 = new PutCommand({
            TableName: "Room",
            Item: {
                room_id: "rm_3",
                name: "test_room1",
                users: new Set(["test@gmail.com"]),
                tasks: null,
            },
        });

        await doc_client.send(put_command_room);
        await doc_client.send(put_command_room2);
        await doc_client.send(put_command_room3);

        // adding notifications
        const put_command_notification = new PutCommand({
            TableName: "Notification",
            Item: {
                id: "123",
                from: "test@gmail.com",
                to: "test2@gmail.com",
                message: "abc invite bcd",
                room_id: "rm_11",
                status: "unread",
                type: "invite",
            },
        });
        const put_command_notification2 = new PutCommand({
            TableName: "Notification",
            Item: {
                id: "456",
                from: "test11@gmail.com",
                to: "test@gmail.com",
                message: "",
                room_id: "rm_bad",
                status: "read",
                type: "invite",
            },
        });

        const put_command_notification3 = new PutCommand({
            TableName: "Notification",
            Item: {
                id: "delete_req",
            },
        });
        await doc_client.send(put_command_notification);
        await doc_client.send(put_command_notification2);
        await doc_client.send(put_command_notification3);

        const put_command_task = new PutCommand({
            TableName: "Task",
            Item: {
                task_id: "task1",
                task_description: "test_task1",
                due_date: "2024-11-19",
                asignee: "test@gmail.com",
                complete: false,
            },
        });

        const put_command_task2 = new PutCommand({
            TableName: "Task",
            Item: {
                task_id: "task2",
                task_description: "test_task2",
                due_date: "2024-11-19",
                asignee: "test@gmail.com",
                complete: true,
            },
        });
        const put_command_task3 = new PutCommand({
            TableName: "Task",
            Item: {
                task_id: "task3",
                task_description: "test_task3",
                due_date: "2024-11-19",
                asignee: "test@gmail.com",
                complete: false,
            },
        });
        const put_command_task4 = new PutCommand({
            TableName: "Task",
            Item: {
                task_id: "task4",
                task_description: "test_task4",
                due_date: "2024-11-19",
                asignee: "test@gmail.com",
                complete: false,
            },
        });

        await doc_client.send(put_command_task);
        await doc_client.send(put_command_task2);
        await doc_client.send(put_command_task3);
        await doc_client.send(put_command_task4);

        const put_command_transaction = new PutCommand({
            TableName: "Transaction",
            Item: {
                transaction_id: "transaction1",
                transaction_name: "grocery",
                transaction_amount: 50,
                room_id: "rm_11",
                transaction_date: "2024-10-10",
                creator: "test@gmail.com",
                paid_by_creator: 25,
                owed_to_creator: 25,
                type: "expense",
            },
        });

        const put_command_transaction2 = new PutCommand({
            TableName: "Transaction",
            Item: {
                transaction_id: "transaction2",
                transaction_name: "wifi bill",
                transaction_amount: 90,
                room_id: "rm_11",
                transaction_date: "2024-01-14",
                creator: "test2@gmail.com",
                paid_by_creator: 30,
                owed_to_creator: 60,
                type: "expense",
            },
        });

        const put_command_transaction3 = new PutCommand({
            TableName: "Transaction",
            Item: {
                transaction_id: "transaction3",
                transaction_name: "test2 paid test1 CAD 10",
                transaction_amount: 10,
                room_id: "rm_11",
                transaction_date: "2024-02-14",
                creator: "test2",
                paid_by_creator: "",
                owed_to_creator: "",
                type: "settle-up",
            },
        });

        await doc_client.send(put_command_transaction);
        await doc_client.send(put_command_transaction2);
        await doc_client.send(put_command_transaction3);

        const initialReview = {
            review_id: "review456",
            reviewed_by: "user123",
            reviewed: "user456",
            overall: 3,
            cleanliness: 3,
            noise_levels: 2,
            respect: 3,
            communication: 3,
            paying_rent: 3,
            chores: 3,
        };
        const put_command_review = new PutCommand({
            TableName: "Review",
            Item: initialReview,
        });
        await doc_client.send(put_command_review);

        const reviews = [
            {
                review_id: "reviewsmall2",
                reviewed_by: "user123",
                reviewed: "user456",
                overall: 5,
                cleanliness: 4,
                noise_levels: 3,
                respect: 4,
                communication: 5,
                paying_rent: 4,
                chores: 3,
            },
            {
                review_id: "reviewsmall",
                reviewed_by: "user789",
                reviewed: "user456",
                overall: 4,
                cleanliness: 3,
                noise_levels: 5,
                respect: 4,
                communication: 4,
                paying_rent: 5,
                chores: 4,
            },
        ];

        const put_command_review2 = new PutCommand({
            TableName: "Review",
            Item: reviews[0],
        });
        await doc_client.send(put_command_review2);

        const put_command_review3 = new PutCommand({
            TableName: "Review",
            Item: reviews[1],
        });
        await doc_client.send(put_command_review3);

        // Add the reviews to the table
        // for (const review of reviews) {
        //     await doc_client.send(new PutCommand({ TableName: "Review", Item: review }));
        // }

        const reviews2 = Array.from({ length: 100 }, (_, i) => ({
            review_id: `review${i}`,
            reviewed_by: `user${i}`,
            reviewed: "user_large_test",
            overall: 5,
            cleanliness: 4,
            noise_levels: 3,
            respect: 4,
            communication: 5,
            paying_rent: 4,
            chores: 3,
        }));

        // Add the reviews to the table
        for (const review of reviews2) {
            await doc_client.send(new PutCommand({ TableName: "Review", Item: review }));
        }
    } catch (error) {
        throw new Error("Something went wrong " + error.message);
    }
}

async function populate_balance() {
    try {
        // adding balance
        const put_balance = new PutCommand({
            TableName: "Balance",
            Item: {
                debtor: "testUser1",
                creditor: "testUser2",
                amount: 15,
            },
        });

        const put_balance2 = new PutCommand({
            TableName: "Balance",
            Item: {
                debtor: "testUser2",
                creditor: "testUser1",
                amount: 25,
            },
        });

        await doc_client.send(put_balance);
        await doc_client.send(put_balance2);
    } catch (e) {
        throw new Error("Something went wrong " + error.message);
    }
}

// async function teardown_db() {}
module.exports = {
    populate_db,
    populate_balance,
};
