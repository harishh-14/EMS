import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { apiService } from "../../services/apiService";
import { CHANGE_PASSWORD } from "../../constants/appConstants";
import { toast } from "react-toastify";

function Setting() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [setting, setSetting] = useState({
    userId: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setSetting({ ...setting, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (setting.newPassword !== setting.confirmPassword) {
      //   alert("New password and confirm password do not match");
      setError("Password not matched");
    } else {
      try {
        const response = await apiService.put(CHANGE_PASSWORD.UPDATE, setting);

        if (response.success) {
          navigate("/login");
           toast("Password Changed Successfully!.", {
                 position: "top-right",
                 autoClose: 3000,
                 style: { backgroundColor: "white", color: "blue" }, // blue background, white text
               });
          setError("");
        }
      } catch (error) {
        if (!error.success) {
          setError(error.message || error.error);
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 mr-130">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Change Password
      </h2>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Old Password */}
        <div>
          <label className="block text-gray-600 mb-1">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            // value={setting.oldPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your old password"
            required
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block text-gray-600 mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            // value={setting.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your new password"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-600 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            // value={setting.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Re-enter your new password"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default Setting;
