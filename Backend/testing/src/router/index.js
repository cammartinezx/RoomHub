const awsServerlessExpress = require("aws-serverless-express");
const express = require("express");
const User = require("./User");
require("dotenv").config(); // Load environment variables

// entrance into all other routes
const app = express();

app.use(express.json());
app.use("/user", User);

app.use("/", async (req, res) => {
    res.status(200).json({ message: "Welcome to the api" });
});

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
    awsServerlessExpress.proxy(server, event, context);
};

// module.exports = app;
