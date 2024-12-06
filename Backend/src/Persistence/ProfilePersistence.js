const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
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

    async create_profile(user_id, location, name, gender, dob, bio, contact, contact_type) {
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
                    contact: contact,
                    contact_type: contact_type,
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

    async update_profile(username, location, name, gender, dob, bio, contact, contact_type) {
        const update_command = new UpdateCommand({
            TableName: this.#table_name,
            Key: {
                user_id: username, // Partition key for the table
            },
            UpdateExpression: `
                set #location = :location, 
                    #name = :name, 
                    gender = :gender, 
                    dob = :dob, 
                    bio = :bio, 
                    contact = :contact, 
                    contact_type = :contact_type
            `,
            ExpressionAttributeNames: {
                "#location": "location", // Alias for the reserved keyword "location"
                "#name": "name",
            },
            ExpressionAttributeValues: {
                ":location": location,
                ":name": name,
                ":gender": gender,
                ":dob": dob,
                ":bio": bio,
                ":contact": contact,
                ":contact_type": contact_type,
            },
            ConditionExpression: "attribute_exists(user_id)", // Ensure the user exists
        });

        try {
            const result = await this.#doc_client.send(update_command);
            return { status: 200, message: "Profile Successfully Updated" };
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 400, message: "This user doesn't exist" };
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

    async update_tags(user_id, tags) {
        try {
            const update_command = new UpdateCommand({
                TableName: this.#table_name,
                Key: { user_id: user_id },
                UpdateExpression: "SET #tags = :newTags",
                ExpressionAttributeNames: {
                    "#tags": "tags", // Map the field name
                },
                ExpressionAttributeValues: {
                    ":newTags": tags, // Create a DynamoDB set from the array
                },
                ConditionExpression: "attribute_exists(user_id)", // Ensure the user exists
            });

            await this.#doc_client.send(update_command);
            return { status: 200, message: "Tags successfully updated" };
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 400, message: "This user doesn't exist" };
            } else {
                console.error("Update tags failed:", error);
                throw error;
            }
        }
    }

    async add_like(user_id, liked_id) {
        const update_command = new UpdateCommand({
            TableName: this.#table_name,
            Key: { user_id: user_id },
            UpdateExpression: "ADD #likes :new_like",
            ExpressionAttributeNames: {
                "#likes": "likes", // The field you're updating
            },
            ExpressionAttributeValues: {
                ":new_like": new Set([liked_id]), // The liked_id to add as a single-element list
            },
        });
        await this.#doc_client.send(update_command);
        return { status: 200, message: "Like successfully added" };
    }

    async add_match(user_id, match_id) {
        try {
            const update_command = new UpdateCommand({
                TableName: this.#table_name,
                Key: { user_id: user_id },
                UpdateExpression: "ADD #matches :new_match",
                ExpressionAttributeNames: {
                    "#matches": "matches", // The field you're updating
                },
                ExpressionAttributeValues: {
                    ":new_match": new Set([match_id]), // The match_id to add as a single-element list
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

    async is_user_liked_by(user_id, liked_id) {
        try {
            const get_command = new GetCommand({
                TableName: this.#table_name,
                Key: { user_id: liked_id }, // Retrieve the liked_id user's data
            });

            const result = await this.#doc_client.send(get_command);
            console.log(result.Item);

            // If the item doesn't exist, throw a user-defined error
            if (!result.Item) {
                const error = new Error("User not found");
                error.name = "ConditionalCheckFailedException"; // Simulate the specific error
                throw error;
            }

            // If the user exists and the 'likes' field contains the user_id
            if (result.Item.likes && result.Item.likes.has(user_id)) {
                return { status: 200, message: "true" };
            } else {
                return { status: 200, message: "false" };
            }
        } catch (error) {
            if (error.name === "ConditionalCheckFailedException") {
                return { status: 400, message: "User not found" };
            } else {
                throw error;
            }
        }
    }

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

    /**
     * Get all profiles from the database with the specified location
     * @param {String} location - The location to filter profiles
     * @returns {Array} - An array of profiles with the same location
     */
    async get_profiles_by_location(location) {
        try {
            const scan_command = new ScanCommand({
                TableName: this.#table_name,
                FilterExpression: "#loc = :location",
                ExpressionAttributeNames: {
                    "#loc": "location",
                },
                ExpressionAttributeValues: {
                    ":location": location,
                },
            });

            const response = await this.#doc_client.send(scan_command);
            return response.Items || [];
        } catch (error) {
            console.error("Error in get_profiles_by_location:", error);
            throw error;
        }
    }
}

module.exports = ProfilePersistence;
