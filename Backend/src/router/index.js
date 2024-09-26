// const awsServerlessExpress = require("aws-severless-express");
const express = require("express");

// entrance into all other routes
const app = express();

app.use("/", async (req, res) => {
    res.status(200).json({ message: "Welcome to the api" });
});
