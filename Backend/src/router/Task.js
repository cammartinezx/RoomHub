/** Routes
 * @namespace Task
 * @description Routes related to tasks
 */
const express = require("express");
const router = express.Router();
const TaskHandler = require("../Handler/TaskHandler");

const task_handler = new TaskHandler();

/**
 * @memberof Task
 * @name Add a new Task
 * @path {POST} room/create-task
 * @query {String} rm The name of the new room to be created
 * @query {String} id The new users e-mail to be added to the database
 * @code {200} Successfully Created the new task
 * @code {400} Bad Request-Invalid Task Description
 * @code {400} Bad Request-Invalid date
 * @code {500} Error message from backend
 * @response {String} message See description of the different status codes
 */
router.post("/create-task", (req, res) => {
    task_handler.create_task(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Task paths" });
});

module.exports = router;
