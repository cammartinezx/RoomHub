const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient({});

app.get("/user", async (req, res) => {
    const params = {
        TableName: "User",
    };
    try {
        const data = await dynamoDB.scan(params).promise();
        res.json(data.Items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch data from DynamoDB" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
