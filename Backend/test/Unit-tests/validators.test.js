const {
    validateString,
    validatePositiveInteger,
    validateContributorsAreRoommates,
    validateOutstandingBalance,
} = require("../../src/Utility/validator");

const express = require("express");
const request = require("supertest");

describe("Unit test for validateString", () => {
    it("should not throw an error with a valid string", async () => {
        const testString = "test@gmail.com";
        const testStringType = "email";
        expect(() => validateString(testString, testStringType)).not.toThrow();
    });

    it("should throw an error with an invalid string", async () => {
        const testString = "";
        const testStringType = "email";
        expect(() => validateString(testString, testStringType)).toThrow(`Invalid ${testStringType}`);
    });

    it("should throw an error with an invalid string", async () => {
        const testString = 5;
        const testStringType = "roommate";
        expect(() => validateString(testString, testStringType)).toThrow(`Invalid ${testStringType}`);
    });
});

describe("Unit test for Validating positive integer", () => {
    it("should not throw an error with a valid positive integer", async () => {
        let testInteger = 10;
        let testIntegerType = "amount";
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).not.toThrow();

        testInteger = Number.MAX_SAFE_INTEGER;
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).not.toThrow();
    });

    it("should throw an error with a non positive integer", async () => {
        let testInteger = -23;
        const testIntegerType = "interest";
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).toThrow(
            `Invalid ${testIntegerType}- ${testIntegerType} must be a positive number`,
        );

        testInteger = Number.MIN_SAFE_INTEGER;
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).toThrow(
            `Invalid ${testIntegerType}- ${testIntegerType} must be a positive number`,
        );

        testInteger = 0;
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).toThrow(
            `Invalid ${testIntegerType}- ${testIntegerType} must be a positive number`,
        );

        testInteger = "10";
        expect(() => validatePositiveInteger(testInteger, testIntegerType)).toThrow(
            `Invalid ${testIntegerType}- ${testIntegerType} must be a positive number`,
        );
    });
});
