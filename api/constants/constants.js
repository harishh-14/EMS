const MESSAGES = {
  AUTH: {
    EMAIL_PASSWORD_REQUIRED: "Email and password are required.",
    EMAIL_REQUIRED: "Email is required",
    USER_NOT_FOUND: "User not found.",
    INVALID_CREDENTIALS: "Invalid credentials!",
    LOGIN_SUCCESS: "Login successful.",
    VERIFY_SUCCESS: "User verified successfully.",
    VERIFY_FAILED: "User verification failed.",

    // Forgot Password
    RESET_LINK_SENT: "Password reset link sent to your email.",
    RESET_FAILED: "Password reset request failed.",

    // Reset Password
    PASSWORD_REQUIRED: "Both new password and confirm password are required.",
    PASSWORD_MIN_LENGTH: "Password must be at least 6 characters.",
    PASSWORDS_NOT_MATCH: "Passwords do not match.",
    TOKEN_EXPIRED: "Reset link expired. Please request again.",
    TOKEN_INVALID: "Invalid token.",
    RESET_LINK_EXPIRED: "Reset link expired.",
    PASSWORD_RESET_SUCCESS: "Password reset successfully!",
    PASSWORD_RESET_FAILED: "Invalid or expired token.",

    TOKEN_VALID: "Token valid.",
    TOKEN_REQUIRED: "Token not provided.",
    UNAUTHORIZED: "Unauthorized access. Token expired or invalid.",
  },

  SUMMARY: {
    FETCH_SUCCESS: "Summary fetched successfully",
    FETCH_FAILED: "Unable to fetch summary",
  },

  DEPARTMENT: {
    NAME_REQUIRED: "Department name and description are required.",
    DUPLICATE: "Department with this name already exists.",
    ADD_SUCCESS: "Department added successfully.",
    ADD_FAILED: "Failed to add department.",
    FETCH_SUCCESS: "Departments fetched successfully.",
    FETCH_FAILED: "Failed to fetch departments.",
    GET_SUCCESS: "Department fetched successfully.",
    GET_FAILED: "Failed to fetch department.",
    NOT_FOUND: "Department not found.",
    UPDATE_SUCCESS: "Department updated successfully.",
    UPDATE_FAILED: "Failed to update department.",
    DELETE_SUCCESS: "Department deleted successfully.",
    DELETE_FAILED: "Failed to delete department.",
  },

  EMPLOYEE: {
    NAME_REQUIRED: "Name must be at least 3 characters",
    EMAIL_REQUIRED: "Valid email is required",
    EMPLOYEE_ID_REQUIRED: "Employee ID must be at least 6 characters",
    DESIGNATION_REQUIRED: "Designation is required",
    DEPARTMENT_REQUIRED: "Department is required",
    PASSWORD_REQUIRED: "Password must be at least 6 characters",
    ROLE_REQUIRED: "Role must be employee or admin",
    EMPLOYEE_ID_EXISTS: "Employee ID already exists",
    EMAIL_EXISTS: "User already registered",
    CREATED: "Employee created successfully",
    CREATED_EMAIL_FAIL: "Employee created but email could not be sent.",
    CREATE_FAILED: "Server error in adding employee",
    FETCH_SUCCESS: "Employees fetched successfully",
    FETCH_FAILED: "Server error in getting employees",
    GET_SUCCESS: "Employee fetched successfully",
    GET_FAILED: "Server error in getting employee",
    NOT_FOUND: "Employee not found",
    NOT_FOUND: "Employee not found",
    USER_NOT_FOUND: "User not found",
    UPDATE_SUCCESS: "Employee updated successfully",
    UPDATE_FAILED: "Failed to update employee",
    SERVER_ERROR: "Server error while updating employee",
  },

  USER: {
    NOT_FOUND: "User not found",
    OLD_PASSWORD_INCORRECT: "Old password is incorrect",
    PASSWORD_CHANGED: "Password changed successfully",
    SERVER_ERROR: "Server error while changing password",
  },

  ATTENDANCE: {
    ALREADY_CHECKED_IN: "You have already checked in today",
    SUCCESS: "Checked in successfully",
    ON_LEAVE: "You are on leave today. Cannot check in",
    SERVER_ERROR: "Server error in check-in",
    MUST_CHECKIN_FIRST: "You must check in first",
    ALREADY_CHECKED_OUT: "You have already checked out today",
    CHECKOUT_SUCCESS: "Checked out successfully",
    SERVER_ERROR_CHECKOUT: "Server error in check-out",
    FETCH_SUCCESS: "Attendance records fetched successfully",
    NO_RECORDS: "No attendance records found",
    SERVER_ERROR_FETCH: "Server error fetching attendance",
    TODAY_SUCCESS: "Today's attendance fetched successfully",
    SERVER_ERROR_TODAY: "Server error fetching today's attendance",
    SUMMARY_SUCCESS: "Attendance summary fetched successfully",
    SERVER_ERROR_SUMMARY: "Server error fetching attendance summary",
    EMPLOYEE_NOT_FOUND: "Employee not found for this userId",
    ALL_EMPLOYEES_FETCH_SUCCESS:
      "All employees attendance fetched successfully",
    ALL_EMPLOYEES_FETCH_ERROR:
      "Server error while fetching employees attendance",
  },

  LEAVE: {
    REQUIRED_FIELDS: "All required fields must be filled",
    EMPLOYEE_NOT_FOUND: "Employee not found for the given userId",
    DATE_INVALID: "Start date cannot be after end date",
    ADDED: "Leave request submitted successfully",
    SERVER_ERROR: "Server error while adding leave",
    FETCHED: "Leaves fetched successfully",
    FETCHED_ALL: "All leaves fetched successfully",
    DETAIL: "Leave detail fetched successfully",
    STATUS_UPDATED: "Leave status updated successfully",
    NOT_FOUND: "No leaves found for the given employee",
  },

  DECRYPT: {
    INVALID_ENCRYPTED: "Invalid encrypted request payload",
  },

  TASK_MESSAGES: {
    EMPTY_TASK: "Task content cannot be empty",
    ADD_SUCCESS: "Task added successfully",
    ADD_ERROR: "Server error while adding task",
    FETCH_SUCCESS: "Tasks fetched successfully",
    FETCH_ERROR: "Server error while fetching tasks",
  },

  GENERAL: {
    SERVER_ERROR: "Something went wrong. Please try again later.",
    VALIDATION_ERROR: "Validation failed. Check your inputs.",
    NOT_FOUND: "Resource not found.",
  },
};

export { MESSAGES };
