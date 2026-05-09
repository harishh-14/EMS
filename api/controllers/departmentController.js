import { MESSAGES } from "../constants/constants.js";
import Department from "../models/department.model.js";
import logger from "../utils/logger.js";

const addDepartment = async (req, res) => {
  const apiName = "ADD_DEPARTMENT_API";
  try {
    const { dep_name, description } = req.body;
    logger.info("Add Department request received", { api: apiName, dep_name });

    // Basic validation
    if (!dep_name) {
      logger.warn("Department name is missing", {
        api: apiName,
        body: req.body,
      });
      return res.status(400).json({
        success: false,
        message: MESSAGES.DEPARTMENT.NAME_REQUIRED,
      });
    }

    // Check for duplicate department
    const existingDep = await Department.findOne({ dep_name: dep_name.trim() });
    if (existingDep) {
      logger.warn("Duplicate department detected", { api: apiName, dep_name });
      return res.status(400).json({
        success: false,
        message: MESSAGES.DEPARTMENT.DUPLICATE,
      });
    }

    const newDep = new Department({
      dep_name,
      description,
    });
    await newDep.save();

    logger.info("Department added successfully", {
      api: apiName,
      departmentId: newDep._id,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.DEPARTMENT.ADD_SUCCESS,
      newRecordId: newDep._id, // For history middleware
      description: `${req.user.name} added a new department "${dep_name}"`,
      department: newDep,
    });
  } catch (error) {
    logger.error("Add Department failed", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: MESSAGES.DEPARTMENT.ADD_FAILED,
      error: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

const getDepartments = async (req, res) => {
  const apiName = "GET_DEPARTMENTS_API";
  try {
    logger.info("Get Departments request received", { api: apiName });

    const data = await Department.find();

    logger.info(`Fetched ${data.length} departments successfully`, {
      api: apiName,
    });
    return res.status(200).json({
      success: true,
      message: MESSAGES.DEPARTMENT.FETCH_SUCCESS,
      departments: data,
    });
  } catch (error) {
    logger.error("Error fetching departments", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("Error in getDepartments:", error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.DEPARTMENT.FETCH_FAILED,
      error: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

const getDepartment = async (req, res) => {
  const apiName = "GET_DEPARTMENT_API";
  try {
    const { id } = req.params;
    logger.info("Get single department request received", {
      api: apiName,
      departmentId: id,
    });

    const department = await Department.findById({ _id: id });

    if (!department) {
      logger.warn("Department not found", { api: apiName, departmentId: id });
      return res.status(404).json({
        success: false,
        message: MESSAGES.DEPARTMENT.NOT_FOUND,
      });
    }

    logger.info("Department fetched successfully", {
      api: apiName,
      departmentId: department._id,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.DEPARTMENT.GET_SUCCESS,
      department,
    });
  } catch (error) {
    logger.error("Error fetching department", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: MESSAGES.DEPARTMENT.GET_FAILED,
      error: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

const updateDepartment = async (req, res) => {
  const apiName = "UPDATE_DEPARTMENT";
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    logger.info("Update Department request received", {
      api: apiName,
      departmentId: id,
      body: req.body,
    });

    const oldDepartment = await Department.findById(id);
    if (!oldDepartment) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.DEPARTMENT.NOT_FOUND,
      });
    }

    const updateDep = await Department.findByIdAndUpdate(
      { _id: id },
      {
        dep_name,
        description,
      }
    );

    if (!updateDep) {
      logger.warn("Department not found for update", {
        api: apiName,
        departmentId: id,
      });
      return res.status(404).json({
        success: false,
        message: MESSAGES.DEPARTMENT.NOT_FOUND,
      });
    }

    logger.info("Department updated successfully", {
      api: apiName,
      departmentId: updateDep._id,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.DEPARTMENT.UPDATE_SUCCESS,
      newRecordId: updateDep._id,
      description: `${req.user.name} updated department "${oldDepartment.dep_name}" to "${updateDep.dep_name}"`,
      oldValue: oldDepartment.dep_name,
      newValue: updateDep.dep_name,
      updateDep,
    });
  } catch (error) {
    logger.error("Error updating department", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      message: MESSAGES.DEPARTMENT.UPDATE_FAILED,
      error: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

const deleteDepartment = async (req, res) => {
  const apiName = "DELETE_DEPARTMENT_API";
  try {
    const { id } = req.params;
    logger.info("Delete Department request received", {
      api: apiName,
      departmentId: id,
    });

    const deletedDep = await Department.findByIdAndDelete({ _id: id });

    logger.info("Department deleted successfully", {
      api: apiName,
      departmentId: deletedDep._id,
    });
    return res.status(200).json({
      success: true,
      deletedDep,
      newRecordId: id,
      description: `${req.user.name} deleted department "${deletedDep}"`,
      message: MESSAGES.DEPARTMENT.DELETE_SUCCESS,
    });
  } catch (error) {
    logger.error("Error deleting department", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.log(error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.DEPARTMENT.DELETE_FAILED,
      error: MESSAGES.GENERAL.SERVER_ERROR,
    });
  }
};

export {
  addDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
