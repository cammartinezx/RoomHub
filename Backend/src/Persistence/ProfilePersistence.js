const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
require("dotenv").config();

/**
 * @module Persistence
 */

/**
 * Represents the room persistence layer that is linked to the room table in the database.
 * @class
 */
class ProfilePersistence {
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

        // working_client = new DynamoDBClient(local_test_client);

        this.#doc_client = DynamoDBDocumentClient.from(working_client, {
            marshallOptions: { convertEmptyValues: true },
        });
        this.#table_name = "Profiles";
    }

    get_doc_client() {
        return this.#doc_client;
    }

    get_table_name() {
        return this.#table_name;
    }

    async create_profile(user_id, location, name, gender, dob, bio, tags, likes, matches, contact, contact_type) {
        try {
            // add the new user
            const put_command = new PutCommand({
                TableName: this.#table_name,
                Item: {
                    user_id: user_id,
                    location: location,
                    name: name,
                    gender: gender,
                    dob: dob,
                    bio: bio,
                    tags: tags,
                    contact: contact,
                    contact_type: contact_type,
                    likes: [],
                    matches: [],
                },
                ConditionExpression: "attribute_not_exists(user_id)",
            });

            await this.#doc_client.send(put_command);
            return { status: 200, message: "User Successfully created" };
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 200, message: "This user name already exist" };
            } else {
                throw error;
            }
        }
    }

    async update_profile(user_id, location, name, gender, dob, bio, tags, likes, matches, contact, contact_type) {
        try {
            // add the new user
            const update_command = new UpdateCommand({
                TableName: this.#table_name,
                Item: {
                    user_id: user_id,
                    location: location,
                    name: name,
                    gender: gender,
                    DOB: dob,
                    bio: bio,
                    tags: tags,
                    likes: likes,
                    matches: matches,
                    contact: contact,
                    contact_type: contact_type,
                },
                ConditionExpression: "attribute_exists(user_id)",
            });
            await this.#doc_client.send(update_command);
            return { status: 200, message: "Profile Successfully Updated" };
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 200, message: "This user doesn't exist" };
            } else {
                throw error;
            }
        }
    }

    async get_profile(user_id) {
        const get_command = new GetCommand({
            TableName: this.#table_name,
            Key: {
                user_id: user_id,
            },
        });
        const response = await this.#doc_client.send(get_command);
        let profile = response.Item;
        if (profile === undefined) {
            return null;
        } else {
            return response.Item;
        }
    }

    async add_like(user_id, liked_id) {
        try {
            const update_command = new UpdateCommand({
                TableName: this.#table_name,
                Key: { user_id: user_id },
                UpdateExpression: "SET #likes = list_append(#likes, :new_like)",
                ExpressionAttributeNames: {
                    "#likes": "likes", // The field you're updating
                },
                ExpressionAttributeValues: {
                    ":new_like": [liked_id], // The liked_id to add as a single-element list
                },
                ConditionExpression: "attribute_exists(user_id)", // Ensure user exists
            });

            await this.#doc_client.send(update_command);
            return { status: 200, message: "Like successfully added" };
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 400, message: "User not found" };
            } else {
                throw error;
            }
        }
    }

    async add_match(user_id, match_id) {
        try {
            const update_command = new UpdateCommand({
                TableName: this.#table_name,
                Key: { user_id: user_id },
                UpdateExpression: "SET #matches = list_append(#matches, :new_match)",
                ExpressionAttributeNames: {
                    "#matches": "matches", // The field you're updating
                },
                ExpressionAttributeValues: {
                    ":new_match": [match_id], // The match_id to add as a single-element list
                },
                ConditionExpression: "attribute_exists(user_id)", // Ensure user exists
            });

            await this.#doc_client.send(update_command);
            return { status: 200, message: "Match successfully added" };
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 400, message: "User not found" };
            } else {
                throw error;
            }
        }
    }

    async delete_like(user_id, liked_id) {
        try {
            const update_command = new UpdateCommand({
                TableName: this.#table_name,
                Key: { user_id: user_id },
                UpdateExpression: "DELETE #likes :likeToRemove",
                ExpressionAttributeNames: {
                    "#likes": "likes",
                },
                ExpressionAttributeValues: {
                    ":likeToRemove": new Set([liked_id]),
                },
                ConditionExpression: "attribute_exists(user_id)",
            });
            await this.#doc_client.send(update_command);
            return { status: 200, message: "Liked user successfully deleted from list" };
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 400, message: "User not found" };
            } else {
                throw error;
            }
        }
    }

    /**
     * Update averages in the Profile table for a user.
     */
    async update_profile_averages(user_id, averages) {
        const update_command = new UpdateCommand({
            TableName: this.#table_name,
            Key: {
                user_id: user_id,
            },
            UpdateExpression:
                "SET overall = :overall, cleanliness = :cleanliness, noise_levels = :noise_levels, " +
                "respect = :respect, communication = :communication, paying_rent = :paying_rent, chores = :chores",
            ExpressionAttributeValues: {
                ":overall": averages.overall,
                ":cleanliness": averages.cleanliness,
                ":noise_levels": averages.noise_levels,
                ":respect": averages.respect,
                ":communication": averages.communication,
                ":paying_rent": averages.paying_rent,
                ":chores": averages.chores,
            },
        });
        await this.#doc_client.send(update_command);
    }
}

module.exports = ProfilePersistence;
