const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

/**
 * @module Persistence
 */

/**
 * Represents the review persistence layer linked to the Reviews table in the database.
 * @class
 */
class ReviewPersistence {
    #doc_client;
    #table_name;

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

        this.#doc_client = DynamoDBDocumentClient.from(working_client, {
            marshallOptions: { convertEmptyValues: true },
        });
        this.#table_name = "Review";
    }

    /**
     * Adds a new review to the Reviews table.
     * @async
     * @param {String} reviewed_by - The ID of the reviewer.
     * @param {String} reviewed - The ID of the person being reviewed.
     * @param {Number} overall - The overall rating.
     * @param {Number} cleanliness - The cleanliness rating.
     * @param {Number} noise_levels - The noise levels rating.
     * @param {Number} respect - The respect rating.
     * @param {Number} communication - The communication rating.
     * @param {Number} paying_rent - The rent payment rating.
     * @param {Number} chores - The chores participation rating.
     */
    async add_review(
        review_id,
        reviewed_by,
        reviewed,
        overall,
        cleanliness,
        noise_levels,
        respect,
        communication,
        paying_rent,
        chores,
    ) {
        const put_command = new PutCommand({
            TableName: this.#table_name,
            Item: {
                review_id: review_id,
                reviewed_by: reviewed_by,
                reviewed: reviewed,
                overall: overall,
                cleanliness: cleanliness,
                noise_levels: noise_levels,
                respect: respect,
                communication: communication,
                paying_rent: paying_rent,
                chores: chores,
            },
        });
        await this.#doc_client.send(put_command);
    }

    /**
     * Updates an existing review in the Reviews table.
     * @async
     * @param {String} reviewed_by - The ID of the reviewer.
     * @param {String} reviewed - The ID of the person being reviewed.
     * @param {Number} overall - The overall rating.
     * @param {Number} cleanliness - The cleanliness rating.
     * @param {Number} noise_levels - The noise levels rating.
     * @param {Number} respect - The respect rating.
     * @param {Number} communication - The communication rating.
     * @param {Number} paying_rent - The rent payment rating.
     * @param {Number} chores - The chores participation rating.
     */
    async update_review(
        review_id,
        reviewed_by,
        reviewed,
        overall,
        cleanliness,
        noise_levels,
        respect,
        communication,
        paying_rent,
        chores,
    ) {
        const update_command = new UpdateCommand({
            TableName: this.#table_name,
            Key: { review_id },
            UpdateExpression:
                "SET overall = :overall, cleanliness = :cleanliness, noise_levels = :noise_levels, " +
                "respect = :respect, communication = :communication, paying_rent = :paying_rent, chores = :chores",
            ExpressionAttributeValues: {
                ":overall": overall,
                ":cleanliness": cleanliness,
                ":noise_levels": noise_levels,
                ":respect": respect,
                ":communication": communication,
                ":paying_rent": paying_rent,
                ":chores": chores,
            },
        });
        await this.#doc_client.send(update_command);
    }

    /**
     * Retrieves all reviews for a specific user.
     * @async
     * @param {String} reviewed - The ID of the person being reviewed.
     * @returns {Array} - List of reviews for the user.
     */
    async get_reviews_for_user(reviewed) {
        const scan_command = new ScanCommand({
            TableName: this.#table_name,
            FilterExpression: "reviewed = :reviewed",
            ExpressionAttributeValues: {
                ":reviewed": reviewed,
            },
        });
        const response = await this.#doc_client.send(scan_command);
        return response.Items || [];
    }
}

module.exports = ReviewPersistence;
