import React, { useState } from "react";
import axios from "axios";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AUTH } from "../constants/appConstants";
import { apiService } from "../services/apiService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.post(AUTH.FORGOT_PASSWORD,{ email } , { skipAuth: true } );

      if (res.success) {
        setMessage("Password reset link has been sent to your email.");
        setError("");
      } else {
        setError(res.error || "Something went wrong");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-600 to-gray-100 space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-black font-bold font-sevillana text-center leading-snug">
        EMS System
      </h2>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Forgot Password
        </h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
         <div className="flex gap-3">
           <button
            type="submit"
            className={`w-full h-10 cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3  font-medium transition-colors shadow-md hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading && <div className="spinner"></div>}
            {loading ? "" : "Send Reset Link"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className={`w-full h-10 cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white pl-2 px-6 py-3  font-medium transition-colors shadow-md hover:bg-blue-700 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
         </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
