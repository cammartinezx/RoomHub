/** Routes
 * @namespace Task
 * @description Routes related to tasks
 */
const express = require("express");
const router = express.Router();
const TaskHandler = require("../Handler/TaskHandler");

const task_handler = new TaskHandler();

//CREATE A TASK

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

//EDIT TASK
router.post("/edit-task", (req, res) => {
    task_handler.edit_task(req, res);
});

//DELETE TASK
router.delete("/delete-task", (req, res) => {
    task_handler.delete_task(req, res);
});

//MARK AS COMPLETED
router.patch("/mark-completed", (req, res) => {
    task_handler.mark_completed(req, res);
});

//GET ALL COMPLETED TASKS

router.get("/:id/get-completed-tasks", (req, res) => {
    user_info_handler.get_completed_tasks(req, res);
});

//GET ALL PENDING TASKS

router.get("/:id/get-pending-tasks", (req, res) => {
    user_info_handler.get_pending_tasks(req, res);
});

router.use("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the Task paths" });
});

module.exports = router;
