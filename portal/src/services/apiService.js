import axios from "axios";
import { API_BASE_URL } from "../constants/appConstants";
import CryptoJS from "crypto-js";

export const APP_FLAG_CONFIG = {
  ENCRYPTION_ENABLED: false, // 🔑 yahi flag se sab control hoga
};

const SECRET_KEY = "MY_SECRET_KEY_123"; // 🔑 ye backend me bhi same hona chahiye

// Axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor for Authorization
API.interceptors.request.use((config) => {
  // Agar headers me token explicitly false diya hai to skip
  if (config.skipAuth) return config;

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// ✅ Safe Decrypt Helper
const safeDecrypt = (res) => {
  if (APP_FLAG_CONFIG.ENCRYPTION_ENABLED && res?.data?.payload) {
    return decryptData(res.data.payload);
  }
  return res.data; // fallback plain response (errors, health-check etc.)
};

// Common API service
export const apiService = {
  get: async (url, params = {}) => {
    try {
      const res = await API.get(url, { params });
      return safeDecrypt(res); // 🔑 always use safeDecryp 🔑 backend se hamesha encrypted data aayega
    } catch (err) {
      throw err.response?.data || err;
    }
  },
  post: async (url, data) => {
    try {
      let body = data;
      if (APP_FLAG_CONFIG.ENCRYPTION_ENABLED) {
        body = { payload: encryptData(data) }; // encrypt only if flag true
      }
      const res = await API.post(url, body);
      return safeDecrypt(res);
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  put: async (url, data) => {
     try {
      let body = data;
      if (APP_FLAG_CONFIG.ENCRYPTION_ENABLED) {
        body = { payload: encryptData(data) };
      }
      const res = await API.put(url, body);
      return safeDecrypt(res);
    } catch (err) {
      throw err.response?.data || err;
    }
  },
  delete: async (url) => {
    try {
      const res = await API.delete(url);
      return safeDecrypt(res);
    } catch (err) {
      throw err.response?.data || err;
    }
  },
};
