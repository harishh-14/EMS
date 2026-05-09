import React, { useEffect, useState } from "react";
import { fetchDepartments } from "../../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { apiService } from "../../services/apiService";
import { EMPLOYEE } from "../../constants/appConstants";

function Edit() {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    designation: "",
    department: "",
    doj: "",
    role: "",
  });
  const [departments, setDepartments] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getDepartments = async () => {
      const depList = await fetchDepartments();
      setDepartments(depList);
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await apiService.get(
          EMPLOYEE.GET_BY_ID(id),
        );
        if (res.success) {
          const employee = res.employee;
          setEmployee((prev) => ({
            ...prev,
            name: employee.userId.name,
            email: employee.userId.email,
            designation: employee.designation,
            department: employee.department,
            doj: employee.doj,
            role: employee.userId.role,
          }));
        }
      } catch (error) {
        if (!error.success) {
          alert(error.message || error.error);
        }
      }
    };
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiService.put(EMPLOYEE.UPDATE(id), employee);
      if (response.success) {
        navigate("/admin-dashboard/employees");
        toast.success("Updated Successfully! ✅", {
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
    }
  };

  return (
    <>
      {departments && employee ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-8">
          <h2 className="text-3xl font-semibold mb-5 text-gray-800 ">
            Edit Employee
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer bg-gray-200 mb-3 hover:bg-gray-300 p-2 rounded-full flex items-center justify-center"
          >
            {" "}
            <FiArrowLeft size={20} />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  placeholder="Insert Name"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  placeholder="Insert Email"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={employee.designation}
                  onChange={handleChange}
                  placeholder="Designation"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Department
                </label>
                <select
                  name="department"
                  onChange={handleChange}
                  value={employee.department}
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

              {/* DoJ */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  DOJ
                </label>
                <input
                  type="date"
                  name="doj"
                  value={employee.doj}
                  onChange={handleChange}
                  placeholder="DOJ"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={employee.role}
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

            {/* Full-width Submit Button */}
            <button
              type="submit"
              className="w-[40%] cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Update Employee
            </button>
          </form>
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </>
  );
}

export default Edit;
