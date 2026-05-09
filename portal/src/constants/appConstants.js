export const API_BASE_URL = "http://localhost:8000/api";
export const FILE_BASE_URL = "http://localhost:8000";

export const AUTH = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token) => `${API_BASE_URL}/auth/reset-password/${token}`,
  CHECK_RESET_TOKEN: (token) =>
    `${API_BASE_URL}/auth/check-reset-token/${token}`,
  VERIFY: `${API_BASE_URL}/auth/verify`,
};

export const DEPARTMENT = {
  ADD: `${API_BASE_URL}/department/add`,
  GET_ALL: `${API_BASE_URL}/department/`,
  GET_ONE: (id) => `${API_BASE_URL}/department/${id}`,
  UPDATE: (id) => `${API_BASE_URL}/department/${id}`,
  DELETE: (id) => `${API_BASE_URL}/department/${id}`,
};

export const EMPLOYEE = {
  GET_ALL: `${API_BASE_URL}/employee`,
  ADD: `${API_BASE_URL}/employee/add`,
  GET_BY_ID: (id) => `${API_BASE_URL}/employee/${id}`,
  UPDATE: (id) => `${API_BASE_URL}/employee/${id}`,
};

export const LEAVE = {
  ADD: `${API_BASE_URL}/leave/add`,
  GET_BY_ID: (id) => `${API_BASE_URL}/leave/${id}`,
  GET_DETAIL: (id) => `${API_BASE_URL}/leave/detail/${id}`,
  GET_ALL: `${API_BASE_URL}/leave`,
  UPDATE_STATUS: (id) => `${API_BASE_URL}/leave/${id}`,
};

export const TASK = {
  ADD: `${API_BASE_URL}/task/add`,
  GET_BY_ID: `${API_BASE_URL}/task/my-tasks`,
  GET_ALL: `${API_BASE_URL}/task`,
};

export const HOLIDAY = {
  ADD: `${API_BASE_URL}/holiday/add`,
  GET_ALL: `${API_BASE_URL}/holiday`,
};

export const ATTENDANCE = {
  CHECKIN: `${API_BASE_URL}/attendance/checkin`,
  CHECKOUT: `${API_BASE_URL}/attendance/checkout`,
  GET_ALL: `${API_BASE_URL}/attendance/all`,
  GET_TODAY: `${API_BASE_URL}/attendance/today`,
  GET_SUMMARY: `${API_BASE_URL}/attendance/summary`,
  GET_ALL_EMPLOYEES: `${API_BASE_URL}/attendance/attendanceofallemployees`,
};

export const CHANGE_PASSWORD = {
  UPDATE: `${API_BASE_URL}/setting/change-password`,
};

export const SUMMARY = {
  GET: `${API_BASE_URL}/dashboard/summary`,
};
