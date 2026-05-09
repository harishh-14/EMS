import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { DEPARTMENT } from "../../constants/appConstants";
import { apiService } from "../../services/apiService";

function AddDepartment() {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.post(DEPARTMENT.ADD, department);
      if (response.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error?.success === false) {
        alert(error.message || error.error || "Something went wrong");
      } else {
        console.error(error); // network/server error ya unexpected error
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-lg mx-auto mt-10">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800">Add Department</h3>
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer bg-gray-200 mb-3 hover:bg-gray-300 p-2 rounded-full flex items-center justify-center"
        >
          {" "}
          <FiArrowLeft size={20} />
        </button>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Department Name */}
        <div>
          <label
            htmlFor="dep_name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Department Name
          </label>
          <input
            type="text"
            value={department.dep_name}
            id="dep_name"
            name="dep_name"
            placeholder="Enter dept name"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-2"
          >
            Description
          </label>
          <textarea
            name="description"
            value={department.description}
            id="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Add Department
        </button>
      </form>
    </div>
  );
}

export default AddDepartment;
