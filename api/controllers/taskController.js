import { MESSAGES } from "../constants/constants.js";
import Task from "../models/task.model.js"; // Make sure Task schema is created
import dayjs from "dayjs";
import logger from "../utils/logger.js";

const addTask = async (req, res) => {
  const apiName = "ADD_TASK"; // helpful to trace logs
  try {
    const userId = req.user._id;
    const { task, date } = req.body;

    logger.info("Add Task request received", {
      api: apiName,
      userId,
      body: req.body,
    });

    if (!task || task.trim() === "") {
      logger.warn("Task creation failed: Empty task provided", {
        api: apiName,
        userId,
      });

      return res.status(400).json({
        success: false,
        message: MESSAGES.TASK_MESSAGES.EMPTY_TASK,
      });
    }

    const taskDate = date
      ? dayjs(date).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");

    // Create a new task entry every time
    const newTask = await Task.create({
      userId,
      task,
      date: taskDate,
    });

    logger.info("Task created successfully", {
      api: apiName,
      taskId: newTask._id,
      userId,
      task: newTask.task,
      date: newTask.date,
    });

    return res.status(201).json({
      success: true,
      message: MESSAGES.TASK_MESSAGES.ADD_SUCCESS,
      newRecordId: newTask._id,
      task: newTask,
    });
  } catch (error) {
    logger.error("Error adding task", {
      api: apiName,
      userId: req.user?._id,
      message: error.message,
      stack: error.stack,
    });
    console.error("Error adding task:", error);
    res.status(500).json({
      success: false,
      message: MESSAGES.TASK_MESSAGES.ADD_ERROR,
      error: error.message,
    });
  }
};

const getTask = async (req, res) => {
  const apiName = "GET_TASKS";
  try {
    const userId = req.user._id;
    logger.info("Fetch tasks request received", {
      api: apiName,
      userId,
    });

    const tasks = await Task.find({ userId }).sort({ date: -1 }); // latest first

    logger.info("Tasks fetched successfully", {
      api: apiName,
      userId,
      taskCount: tasks.length,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.TASK_MESSAGES.FETCH_SUCCESS,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    logger.error("Error fetching tasks", {
      api: apiName,
      userId: req.user?._id,
      message: error.message,
      stack: error.stack,
    });
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.TASK_MESSAGES.FETCH_ERROR,
      error: error.message,
    });
  }
};

const getAllTask = async (req, res) => {
  const apiName = "GET_ALL_TASKS";
  try {
    logger.info("Fetch all tasks request received", {
      api: apiName,
      performedBy: req.user?._id, // admin or manager who called
    });

    const tasks = await Task.find()
      .populate("userId", "name")
      .sort({ date: -1 }); // latest first

    logger.info("All tasks fetched successfully", {
      api: apiName,
      performedBy: req.user?._id,
      totalTasks: tasks.length,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.TASK_MESSAGES.FETCH_SUCCESS,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    logger.error("Error fetching all tasks", {
      api: apiName,
      performedBy: req.user?._id,
      message: error.message,
      stack: error.stack,
    });
    
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.TASK_MESSAGES.FETCH_ERROR,
      error: error.message,
    });
  }
};

export { addTask, getTask, getAllTask };
