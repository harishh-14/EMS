import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiService } from "../../services/apiService";
import { EMPLOYEE } from "../../constants/appConstants";

function Add() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const depList = await fetchDepartments();
      setDepartments(depList);
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await apiService.post(EMPLOYEE.ADD, formDataObj);
      console.log(response.success);
      if (response.success) {
        navigate("/admin-dashboard/employees");
        toast.success("Employee Added Successfully! ✅", {
          position: "top-right",
          autoClose: 3000,
          style: { backgroundColor: "white", color: "blue" }, // blue background, white text
        });
      }
    } catch (error) {
      if (!error.success) {
        alert(error.message || error.error);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">
        Add New Employee
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Name*
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Insert Name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email*
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Insert Email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Employee ID*
            </label>
            <input
              type="text"
              name="employeeId"
              onChange={handleChange}
              placeholder="Insert Employee ID"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Date of Joining */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Date of Joining
            </label>
            <input
              type="date"
              name="doj"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Designation*
            </label>
            <input
              type="text"
              name="designation"
              onChange={handleChange}
              placeholder="Designation"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Department*
            </label>
            <select
              name="department"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.dep_name}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password*
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Enter Password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />
          </div>

          <div>
            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Role*
              </label>
              <select
                name="role"
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>

          {/* Upload Image - Full width */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition bg-white"
            />
          </div>
        </div>

        {/* Full-width Submit Button */}
        <button
          type="submit"
          className={`w-[40%] flex items-center justify-center gap-2 cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading && <div className="spinner"></div>}
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </form>
    </div>
  );
}

export default Add;
