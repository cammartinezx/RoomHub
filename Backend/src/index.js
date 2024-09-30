const User = require("./router/User");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb"); // v3 DynamoDB client
// const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb"); // For DocumentClient equivalent

// Set up AWS DynamoDBClient configuration using environment variables
// const dynamoDBClient = new DynamoDBClient({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
// });

// DynamoDBDocumentClient wraps DynamoDBClient to simplify working with DynamoDB
// const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient); // DocumentClient equivalent in v3

app.use("/user", User);

app.get("/", async (req, res) => {
    // console.log(req);
    // console.log("We are cooking rn");
    console.log(req.body);
    res.status(200).json({ message: "we cooking rn" });
    // const params = {
    //     TableName: "User",
    // };
    // try {
    //     const data = await dynamoDB.scan(params).promise();
    //     res.json(data.Items);
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: "Failed to fetch data from DynamoDB" });
    // }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
