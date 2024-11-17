const Services = require("../Utility/Services");
const {
    validateString,
    validatePositiveInteger,
    validateDate,
    validateContributorsAreRoommates,
    validateUserExist,
    validateUsersAreRoommates,
    validateOutstandingBalance,
    validateNonEmptyList,
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
                name,
                location,
                gender,
                contact_type,
                dob,
                bio,
                contact,
            );
            return response.status(result.status).json({ message: result.message });
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
            } catch (error) {
                response.status(404).json({ message: error.message });
                return;
            }

            let result = await this.#profile_persistence.update_profile(
                user_id,
                name,
                location,
                gender,
                contact_type,
                dob,
                bio,
                contact,
            );
            return response.status(result.status).json({ message: result.message });
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

            let result = await this.#profile_persistence.get_profile(user_id);
            return response.status(result.status).json({ message: result.message });
        } catch (error) {
            return response.status(500).json({ message: error.message });
        }
    }
}

module.exports = ProfileHandler;
