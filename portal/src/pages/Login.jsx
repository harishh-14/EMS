import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/authContext";
import { AUTH } from "../constants/appConstants";
import { apiService } from "../services/apiService";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await apiService.post(
        AUTH.LOGIN,
        {
          email: data.email,
          password: data.password,
        },
        { skipAuth: true }
      );

      if (res.success) {
        login(res.user);
        localStorage.setItem("token", res.token);

        if (res.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/employee-dashboard");
        }
      }
    } catch (err) {
      setError(err.message || "Server error, please try again later");
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-gray-100 space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-black font-bold font-sevillana text-center leading-snug">
          EMS System
        </h2>

        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center">
            Login
          </h2>

          {error && (
            <p className="text-red-600 bg-red-100 border border-red-400 px-3 sm:px-4 py-2 rounded text-xs sm:text-sm">
              {error}
            </p>
          )}

          <form
            className="space-y-4 sm:space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-xs sm:text-sm text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className={`border rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-xs sm:text-sm text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                className={`border rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm sm:text-base ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-200 text-sm sm:text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
