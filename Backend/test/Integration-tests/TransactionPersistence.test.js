require("dotenv").config(); // Load environment variables
const { populate_balance } = require("./DbSetup");
const TransactionPersistence = require("../../src/Persistence/TransactionPersistence");

describe("Transaction Persistence- Test generating a new transaction", () => {
    let transaction_persistence;

    beforeAll(async () => {
        transaction_persistence = new TransactionPersistence();
        // await populate_db();
    });

    it("Should not throw any error-- Signifying that an expense transaction was properly created", async () => {
        await expect(
            transaction_persistence.generate_new_transaction(
                "test_expense_trans",
                "Testing",
                20,
                "test_room",
                "1999-11-10",
                "test_user",
                10,
                20,
                "expense",
            ),
        ).resolves.not.toThrow();
    });

    it("Should not throw any error-- Signifying that a settle up transaction was properly created", async () => {
        await expect(
            transaction_persistence.generate_new_transaction(
                "test_settleup_trans",
                "Testing",
                20,
                "test_room",
                "1999-11-10",
                "test_user",
                "settle-up",
            ),
        ).resolves.not.toThrow();
    });

    it("Should throw an error-- Signifying that a settle up transaction was not created(Same id as existing transaction)", async () => {
        await expect(
            transaction_persistence.generate_new_transaction(
                "test_settleup_trans",
                "Testing",
                20,
                "test_room",
                "1999-11-10",
                "test_user",
                "settle-up",
            ),
        ).rejects.toThrow();
    });
});
describe("Transaction Persistence- Test getting balance record between 2 users.", () => {
    let transaction_persistence;

    beforeAll(async () => {
        transaction_persistence = new TransactionPersistence();
        await populate_balance();
    });

    it("Should not throw any error-- Return the balanced record fetched", async () => {
        let result;
        const expected_result = { creditor: "testUser2", debtor: "testUser1", amount: 15 };
        result = await transaction_persistence.getBalanceRecord("testUser1", "testUser2");

        expect(result).toEqual(expected_result);
    });

    it("Should not throw any error-- Should return null which means no balanced record between the users", async () => {
        const expected_result = null;
        const result = await transaction_persistence.getBalanceRecord("testUser3", "testUser4");

        expect(result).toEqual(expected_result);
    });
});

describe("Transaction Persistence- Test updating balance record between 2 users", () => {
    let transaction_persistence;

    beforeAll(async () => {
        transaction_persistence = new TransactionPersistence();
        await populate_balance();
    });

    it("Should not throw an error-- Signify that an already existing balance record was updated", async () => {
        await expect(transaction_persistence.updateBalance("testUser1", "testUser2", 100)).resolves.not.toThrow();
    });

    it("Should not throw an error-- Signify that a new balance record was created", async () => {
        await expect(transaction_persistence.updateBalance("testUser3", "testUser4", 100)).resolves.not.toThrow();
    });
});
