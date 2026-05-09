import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { apiService } from "../../services/apiService";
import { EMPLOYEE } from "../../constants/appConstants";


function View() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await apiService.get(
          EMPLOYEE.GET_BY_ID(id),
        );
        if (response.success) {
          setEmployee(response.employee);
        }
      } catch (error) {
        if (!error.success) {
          alert(error.message || error.error);
        }
      }
    };
    fetchEmployee();
  }, []);

  return (
    <>
      {employee ? (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto mt-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Employee Details
          </h2>
          <button onClick={() => navigate(-1)} className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded-full flex items-center justify-center"> <FiArrowLeft size={20} /></button>

          <div className="flex gap-6 items-start">
            {/* Profile Image */}
            <div className="w-45 h-45 flex-shrink-0">
              <img
                src={`http://localhost:8000/${employee.userId.profileImage}`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow-md"
              />
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <p className="text-sm font-semibold text-gray-500">Name</p>
                <p className="text-lg font-medium text-gray-800">
                  {employee.userId.name}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Employee ID
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {employee.employeeId}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Date of Joining
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {new Date(employee.doj).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Gender</p>
                <p className="text-lg font-medium text-gray-800">
                  {employee.gender}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Department
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {employee.department?.dep_name}  
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Designation
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {employee.designation}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </>
  );
}

export default View;
