const Services = require("../Utility/Services");
const { v4: uuidv4 } = require("uuid");
const {
    validateString,
    validateDate,
    validateUserExist,
    validateNonEmptyList,
    validateProfileExist,
} = require("../Utility/validator");

/**
 * @module Handler
 */

/**
 * Represents the Room handler
 * @class
 *
 */
class ProfileHandler {
    /**
     * The user persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #user_persistence;
    /**
     * The room persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #room_persistence;
    /**
     * The notificaion persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #notification_persistence;
    /**
     * The profile persistence object used by the info handler.
     * @type {string}
     * @private
     */
    #profile_persistence;

    /**
     * Create a new UserInfoHandler object
     * @constructor
     */
    constructor() {
        this.#profile_persistence = Services.get_profile_persistence();
        this.#user_persistence = Services.get_user_persistence();
        this.#room_persistence = Services.get_room_persistence();
        this.#notification_persistence = Services.get_notification_persistence();
    }

    get_profile_persistence() {
        return this.#profile_persistence;
    }

    get_user_persistence() {
        return this.#user_persistence;
    }

    get_room_persistence() {
        return this.#room_persistence;
    }

    get_notification_persistence() {
        return this.#notification_persistence;
    }

    async create_profile(request, response) {
        //userId, location, name, gender, dob, bio, tags[], likes[], matches[], contact type, contact, reviews[]
        try {
            let user_id = request.params.id.trim().toLowerCase();
            let location = request.body.location.trim().toLowerCase();
            let name = request.body.name.trim().toLowerCase();
            let ethnicity = request.body.ethnicity.trim().toLowerCase();
            let gender = request.body.gender.trim().toLowerCase();
            let dob = request.body.dob.trim().toLowerCase();
            let bio = request.body.bio.trim().toLowerCase();
            let contact_type = request.body.contact_type.trim().toLowerCase();
            let contact = request.body.contact.trim().toLowerCase();
            // let tags = request.body.tags.trim().toLowerCase();
            // let likes = request.body.likes.trim().toLowerCase();
            // let matches = request.body.matches.trim().toLowerCase();
            //let reviews = request.body.reviews.trim().toLowerCase();

            // sync errors
            try {
                validateString(user_id, "user");
                validateString(name, "name");
                validateString(location, "location");
                validateString(gender, "gender");
                validateString(contact_type, "contact type");
                validateDate(dob);
                validateString(bio, "bio");
                validateString(contact, "contact");
            } catch (error) {
                response.status(422).json({ message: error.message });
                return;
            }

            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }

            let result = await this.#profile_persistence.create_profile(
                user_id,
                location,
                name,
                ethnicity,
                gender,
                dob,
                bio,
                contact,
                contact_type,
            );
            return response.status(200).json({ message: "Profile created successfully" });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    async update_profile(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            let location = request.body.location.trim().toLowerCase();
            let name = request.body.name.trim().toLowerCase();
            let gender = request.body.gender.trim().toLowerCase();
            let ethnicity = request.body.ethnicity.trim().toLowerCase();
            let dob = request.body.dob.trim().toLowerCase();
            let bio = request.body.bio.trim().toLowerCase();
            let contact_type = request.body.contact_type.trim().toLowerCase();
            let contact = request.body.contact.trim().toLowerCase();

            // sync errors
            try {
                validateString(user_id, "user");
                validateString(name, "name");
                validateString(location, "location");
                validateString(gender, "gender");
                validateString(contact_type, "contact type");
                validateDate(dob);
                validateString(bio, "bio");
                validateString(contact, "contact");
            } catch (error) {
                response.status(422).json({ message: error.message });
                return;
            }

            try {
                await validateUserExist(this.#user_persistence, user_id);
                await validateProfileExist(this.#profile_persistence, user_id);
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }

            let result = await this.#profile_persistence.update_profile(
                user_id,
                location,
                name,
                ethnicity,
                gender,
                dob,
                bio,
                contact,
                contact_type,
            );
            return response.status(200).json({ message: "Profile updated successfully." });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    async update_tags(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            let tags = request.body.tags;

            // sync errors
            try {
                validateString(user_id, "user");
                validateNonEmptyList(tags, "tags");
            } catch (error) {
                response.status(422).json({ message: error.message });
                return;
            }

            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }

            const tagSet = new Set(tags);
            let result = await this.#profile_persistence.update_tags(user_id, tagSet);
            return response.status(200).json({ message: "Tags updated successfully." });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    async get_profile(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();

            // sync errors
            try {
                validateString(user_id, "user");
            } catch (error) {
                response.status(422).json({ message: error.message });
                return;
            }
            try {
                await validateUserExist(this.#user_persistence, user_id);
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }
            let profile = await this.#profile_persistence.get_profile(user_id);
            if (profile.tags && typeof profile.tags === "object") {
                profile.tags = Array.from(profile.tags); // Convert DynamoDB Set to an array
            }

            // Convert DynamoDB sets to arrays
            profile.matches = profile.matches ? Array.from(profile.matches) : [];
            profile.potential_matches = profile.potential_matches ? Array.from(profile.potential_matches) : [];

            return response.status(200).json({ profile });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    async check_match(request, response) {
        try {
            let user_id = request.params.id.trim().toLowerCase();
            let liked_id = request.body.id.trim().toLowerCase();

            // sync errors
            try {
                validateString(user_id, "user");
                validateString(liked_id, "user");
            } catch (error) {
                response.status(422).json({ message: error.message });
                return;
            }
            try {
                await validateUserExist(this.#user_persistence, user_id);
                await validateUserExist(this.#user_persistence, liked_id);
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }

            let result = await this.#profile_persistence.is_user_liked_by(user_id, liked_id);
            console.log(result);
            if (result.message === "true") {
                await this.#profile_persistence.add_match(user_id, liked_id);
                await this.#profile_persistence.delete_like(liked_id, user_id);
                await this.#profile_persistence.add_match(liked_id, user_id);
                await this.notify_match_helper(user_id, liked_id);

                return response.status(200).json({ message: "users are a match. Added to each matches list" });
            } else {
                await this.#profile_persistence.add_like(user_id, liked_id);
                return response.status(200).json({ message: "user succesfully added to likes" });
            }
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }

    /**
     *
     * @param {String} user_id
     * @param {String} liked_id
     * Helper method to send notification for matches
     * user should have been validated already
     */

    async notify_match_helper(user_id, user_id2) {
        try {
            const msg = "You have a new match!";
            const notif_id = uuidv4();
            const notif_id2 = uuidv4();
            const status = "unread";
            const type = "match";
            const room_id = "not aplicable";

            await this.#notification_persistence.generate_new_notification(
                notif_id2,
                msg,
                status,
                user_id,
                user_id2,
                type,
                room_id,
            );
            await this.#notification_persistence.generate_new_notification(
                notif_id,
                msg,
                status,
                user_id2,
                user_id,
                type,
                room_id,
            );
            await this.#user_persistence.update_user_notifications(notif_id, user_id);
            await this.#user_persistence.update_user_notifications(notif_id2, user_id2);
        } catch (error) {
            return error.message;
        }
    }
}

module.exports = ProfileHandler;
