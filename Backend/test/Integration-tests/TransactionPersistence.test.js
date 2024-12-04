require("dotenv").config(); // Load environment variables
const { populate_db, populate_balance } = require("./DbSetup");
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

describe("Transaction Persistence - Test getting user debt or credit amount", () => {
    let transaction_persistence;

    beforeAll(async () => {
        transaction_persistence = new TransactionPersistence();
        await populate_balance();
    });

    it("Should not throw an error -- return the correct debt amount", async () => {
        const amount = await transaction_persistence.get_amounts_by_role("testUser1", "debtor");
        expect(amount).toEqual([15]);
    });

    it("Should not throw an error -- return the correct credit amount", async () => {
        const amount = await transaction_persistence.get_amounts_by_role("testUser1", "creditor");
        expect(amount).toEqual([25]);
    });

    it("Should throw an error if the role is not either debtor or creditor", async () => {
        await expect(transaction_persistence.get_amounts_by_role("testUser1", "chimto")).rejects.toThrow(
            "Role must be either debtor or creditor",
        );
    });
});

describe("Transaction Persistence - Test getting user relationships", () => {
    let transaction_persistence;

    beforeAll(async () => {
        transaction_persistence = new TransactionPersistence();
        await populate_balance();
    });

    it("Should not throw an error -- return the correct relationship that you own someone", async () => {
        const response = await transaction_persistence.get_relationships_by_role("testUser1", "debtor");
        const message = `You owe ${response.Items[0].creditor} CAD ${response.Items[0].amount}`;
        expect(message).toEqual("You owe testUser2 CAD 15");
    });

    it("Should not throw an error -- return the correct relationship that someone own you", async () => {
        const response = await transaction_persistence.get_relationships_by_role("testUser1", "creditor");
        const message = `${response.Items[0].debtor} owes you CAD ${response.Items[0].amount}`;
        expect(message).toEqual("testUser2 owes you CAD 25");
    });

    it("Should throw an error if the role is not either debtor or creditor", async () => {
        await expect(transaction_persistence.get_relationships_by_role("testUser1", "chimto")).rejects.toThrow(
            "Role must be either debtor or creditor",
        );
    });
});

describe("Transaction Persistence - Test getting user transactions", () => {
    let transaction_persistence;
    let room_id;
    let transactionTests;

    beforeAll(async () => {
        room_id = "rm_11";
        transactionTests = [
            {
                creator: "test@gmail.com",
                owed_to_creator: 25,
                paid_by_creator: 25,
                transaction_amount: 50,
                transaction_date: "2024-10-10",
                transaction_name: "grocery",
                type: "expense",
            },
            {
                creator: "test2",
                owed_to_creator: "",
                paid_by_creator: "",
                transaction_amount: 10,
                transaction_date: "2024-02-14",
                transaction_name: "test2 paid test1 CAD 10",
                type: "settle-up",
            },
            {
                creator: "test2@gmail.com",
                owed_to_creator: 60,
                paid_by_creator: 30,
                transaction_amount: 90,
                transaction_date: "2024-01-14",
                transaction_name: "wifi bill",
                type: "expense",
            },
        ];
        transaction_persistence = new TransactionPersistence();
        await populate_db();
    });

    it("Should not throw an error -- return the correct list of transaction in specific room", async () => {
        const transactions = await transaction_persistence.get_transaction_details(room_id);
        expect(transactions).toEqual(transactionTests);
    });
});
