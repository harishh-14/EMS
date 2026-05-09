import path from "path";
import Employee from "../models/employee.model.js";
import Department from "../models/department.model.js";
import User from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt";
import multer from "multer";
import { sendWelcomeEmail } from "../utils/email.js";
import { MESSAGES } from "../constants/constants.js";
import logger from "../utils/logger.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
  const apiName = "ADD_EMPLOYEE_API";
  try {
    const {
      name,
      email,
      employeeId,
      doj,
      gender,
      designation,
      department,
      password,
      role,
    } = req.body;

    logger.info("Add Employee request received", {
      api: apiName,
      body: req.body,
    });

    if (!name || name.trim().length < 3) {
      logger.warn("Name validation failed", { api: apiName });
      return res
        .status(400)
        .json({ success: false, message: MESSAGES.EMPLOYEE.NAME_REQUIRED });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      logger.warn("Email validation failed", { api: apiName });
      return res
        .status(400)
        .json({ success: false, message: MESSAGES.EMPLOYEE.EMAIL_REQUIRED });
    }
    if (!employeeId || employeeId.trim().length < 3) {
      logger.warn("Employee ID validation failed", { api: apiName });
      return res.status(400).json({
        success: false,
        message: MESSAGES.EMPLOYEE.EMPLOYEE_ID_REQUIRED,
      });
    }

    if (!designation || designation.trim().length < 2) {
      logger.warn("Designation validation failed", { api: apiName });
      return res.status(400).json({
        success: false,
        message: MESSAGES.EMPLOYEE.DESIGNATION_REQUIRED,
      });
    }
    if (!department || department.trim().length < 2) {
      logger.warn("Department validation failed", { api: apiName });
      return res.status(400).json({
        success: false,
        message: MESSAGES.EMPLOYEE.DEPARTMENT_REQUIRED,
      });
    }
    if (!password || password.length < 6) {
      logger.warn("Password validation failed", { api: apiName });
      return res.status(400).json({
        success: false,
        message: MESSAGES.EMPLOYEE.PASSWORD_REQUIRED,
      });
    }
    if (!["employee", "admin"].includes(role)) {
      logger.warn("Role validation failed", { api: apiName });
      return res
        .status(400)
        .json({ success: false, message: MESSAGES.EMPLOYEE.ROLE_REQUIRED });
    }

    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      logger.warn("Employee ID already exists", { api: apiName, employeeId });
      return res.status(400).json({
        success: false,
        message: MESSAGES.EMPLOYEE.EMPLOYEE_ID_EXISTS,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      logger.warn("Email already exists", { api: apiName, email });
      return res
        .status(400)
        .json({ success: false, message: MESSAGES.EMPLOYEE.EMAIL_EXISTS });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });
    const savedUser = await newUser.save();

    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      doj,
      gender,
      designation,
      department,
    });
    await newEmployee.save();

    logger.info("Employee saved successfully", {
      api: apiName,
      employeeId: newEmployee._id,
      userId: savedUser._id,
    });

    // ✅ Send Email
    const emailResponse = await sendWelcomeEmail({ name, email, password });

    if (!emailResponse.success) {
      logger.warn("Welcome email failed", {
        api: apiName,
        email,
        error: emailResponse.error,
      });
      return res.status(200).json({
        success: true,
        message: MESSAGES.EMPLOYEE.CREATED_EMAIL_FAIL,
        emailError: emailResponse.error,
      });
    }

    logger.info("Employee created and welcome email sent successfully", {
      api: apiName,
      employeeId: newEmployee._id,
      email,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.EMPLOYEE.CREATED,
      newRecordId: newEmployee._id,
      newValue: newEmployee,
    });
  } catch (error) {
    logger.error("Add Employee failed", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    console.error("❌ Add Employee Error:", error);
    return res
      .status(500)
      .json({ success: false, message: MESSAGES.EMPLOYEE.CREATE_FAILED });
  }
};

const getEmployees = async (req, res) => {
  const apiName = "GET_EMPLOYEES_API";
  try {
    logger.info("Get Employees request received", { api: apiName });
    const employees = await Employee.find()
      .populate("userId", { password: 0 })
      .populate("department");

    logger.info(`Fetched ${employees.length} employees successfully`, {
      api: apiName,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.EMPLOYEE.FETCH_SUCCESS,
      employees,
    });
  } catch (error) {
    logger.error("Error fetching employees", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ success: false, message: MESSAGES.EMPLOYEE.FETCH_FAILED });
  }
};

const getEmployee = async (req, res) => {
  const apiName = "GET_EMPLOYEE_API";
  try {
    const { id } = req.params;
    logger.info("Get Employee request received", { api: apiName, id });

    let employee;
    employee = await Employee.findById({ _id: id })
      .populate("userId", { password: 0 })
      .populate("department");

    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", { password: 0 })
        .populate("department");
    }
    logger.info("Employee fetched successfully", {
      api: apiName,
      employeeId: employee._id,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.EMPLOYEE.GET_SUCCESS,
      employee,
    });
  } catch (error) {
    logger.error("Error fetching employee", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ success: false, message: MESSAGES.EMPLOYEE.GET_FAILED });
  }
};

const updateEmployee = async (req, res) => {
  const apiName = "UPDATE_EMPLOYEE_API";
  try {
    const { id } = req.params;
    const { name, email, designation, department, doj, role } = req.body;
    logger.info("Update Employee request received", {
      api: apiName,
      employeeId: id,
      body: req.body,
    });

    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      logger.warn("Employee not found", { api: apiName, employeeId: id });
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.EMPLOYEE.NOT_FOUND });
    }

    const user = await User.findById({ _id: employee.userId });

    if (!user) {
      logger.warn("User linked to employee not found", {
        api: apiName,
        userId: employee.userId,
      });
      return res
        .status(404)
        .json({ success: false, message: MESSAGES.EMPLOYEE.USER_NOT_FOUND });
    }

    const updateUser = await User.findByIdAndUpdate(
      { _id: employee.userId },
      { name, email, role },
      { new: true }
    );
    const updateEmployee = await Employee.findByIdAndUpdate(
      { _id: id },
      {
        designation,
        department,
        doj,
      },
      { new: true }
    );

    if (!updateEmployee || !updateUser) {
      logger.warn("Employee or user update failed", {
        api: apiName,
        employeeId: id,
      });
      return res.status(404).json({
        success: false,
        message: MESSAGES.EMPLOYEE.UPDATE_FAILED,
      });
    }

    logger.info("Employee updated successfully", {
      api: apiName,
      employeeId: id,
      userId: updateUser._id,
    });

    return res.status(200).json({
      success: true,
      message: MESSAGES.EMPLOYEE.UPDATE_SUCCESS,
      newRecordId: updateEmployee._id,
      oldValue: employee,
      newValue: updateEmployee,
      employee: updateEmployee,
      user: updateUser,
    });
  } catch (error) {
    logger.error("Error updating employee", {
      api: apiName,
      message: error.message,
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ success: false, message: MESSAGES.EMPLOYEE.SERVER_ERROR });
  }
};

export { addEmployee, upload, getEmployees, getEmployee, updateEmployee };
