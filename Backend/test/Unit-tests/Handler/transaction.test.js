const TransactionHandler = require("../../../src/Handler/TransactionHandler");
const { mockRequest, mockResponse } = require("mock-req-res");
const {
    validateString,
    validateUserExist,
    validatePositiveInteger,
    validateUsersAreRoommates,
    validateOutstandingBalance,
} = require("../../../src/Utility/validator");

jest.mock("../../../src/Utility/Services", () => ({
    get_user_persistence: () => ({
        get_room_id: jest.fn(),
    }),

    get_transaction_persistence: () => ({
        generate_new_transaction: jest.fn(),
        updateBalance: jest.fn(),
    }),

    get_room_persistence: () => ({}),

    get_notification_persistence: () => ({}),
}));

jest.mock("../../../src/Utility/validator", () => ({
    validateString: jest.fn(),
    validatePositiveInteger: jest.fn(),
    validateDate: jest.fn(),
    validateUserExist: jest.fn(),
    validateContributorsAreRoommates: jest.fn(),
    validateOutstandingBalance: jest.fn(),
    validateUsersAreRoommates: jest.fn(),
    validateNonEmptyList: jest.fn(),
}));
describe("Unit test for create_expense function", () => {
    let transactionHandler;
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        transactionHandler = new TransactionHandler();
        req = mockRequest();
        res = mockResponse();
        // expense body-- validators mocked such that they always pass.
        req.body = { name: "test", price: "test", payer: "test", contributors: "test", date: "test" };

        res.status = jest.fn().mockReturnValue(res); // Allows chaining like res.status(200).json()
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that the new expense was correctly created", async () => {
        // all validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        await transactionHandler.create_Expense(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Expense created successfully" });
    });

    it("Send a response signifying that there's an error from the request body-- Sync Validator Fail", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        // mock Validate string to throw error
        validateString.mockImplementation(() => {
            throw new Error("Invalid Transaction Name");
        });

        await transactionHandler.create_Expense(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Transaction Name" });
    });

    it("Send a response signifying that there's an error validating request body parameters-- Async Validator Fail", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called
        // mock Validate user exist function to throw error
        validateUserExist.mockImplementation(() => {
            throw new Error("User does not exist");
        });

        await transactionHandler.create_Expense(req, res);
        console.log(res.json);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    });

    it("Send a response signifying that there's a db error", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        // mock Validate user exist function to throw error
        transactionHandler.get_transaction_persistence().generate_new_transaction.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await transactionHandler.create_Expense(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});

describe("Unit test for Settle_debt function", () => {
    let transactionHandler;
    let req, res;

    beforeEach(() => {
        jest.resetAllMocks();
        transactionHandler = new TransactionHandler();
        req = mockRequest();
        // req built to pass all tests
        req.body = { debtor: "test", creditor: "test", amount: 100, date: "test" };
        res = mockResponse();

        res.status = jest.fn().mockReturnValue(res); // Allows chaining like res.status(200).json()
        res.json = jest.fn();
        jest.clearAllMocks();
    });

    it("Send a success response verifying that transaction was correctly created and balance with roommates updated", async () => {
        // all validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        // expense body-- validators mocked such that they always pass.

        await transactionHandler.settle_debt(req, res);

        // expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Transaction created successfully" });
    });

    it("Send a response signifying that there's an error from the request body-- Sync Validator Fail", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        // mock Validate string to throw error
        validatePositiveInteger.mockImplementation(() => {
            throw new Error("Invalid Settle Up amount");
        });

        // expense body-- validators mocked such that they always pass.

        await transactionHandler.settle_debt(req, res);

        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid Settle Up amount" });
    });

    it("Send a response signifying that there's an error validating request body parameters-- Async Validator Fail(409 Error)", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called
        // mock Validate user exist function to throw error
        validateOutstandingBalance.mockImplementation(() => {
            throw new Error("No outstanding balance to be settled");
        });

        // expense body-- validators mocked such that they always pass.

        await transactionHandler.settle_debt(req, res);
        console.log(res.json);
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: "No outstanding balance to be settled" });
    });

    it("Send a response signifying that there's an error validating request body parameters-- Async Validator Fail(404 Error)", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called
        // mock Validate user exist function to throw error
        validateUsersAreRoommates.mockImplementation(() => {
            throw new Error("Users are not roommates");
        });

        // expense body-- validators mocked such that they always pass.

        await transactionHandler.settle_debt(req, res);
        console.log(res.json);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Users are not roommates" });
    });

    it("Send a response signifying that there's a db error", async () => {
        // all other validators by default don't do any internal logic here.
        // all persistence functions by default don't do any internal logic and just return once they;re called

        // mock Validate user exist function to throw error
        transactionHandler.get_transaction_persistence().generate_new_transaction.mockImplementation(() => {
            throw new Error("You don't have access to this service.");
        });

        await transactionHandler.settle_debt(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "You don't have access to this service." });
    });
});
