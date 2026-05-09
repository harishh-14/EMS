import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { apiService } from "../../services/apiService";
import { FILE_BASE_URL, LEAVE } from "../../constants/appConstants";

function DetailLeave() {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await apiService.get(LEAVE.GET_DETAIL(id));
        if (response.success) {
          setLeave(response.leave);
        }
      } catch (error) {
        if (!error.success) {
          alert(error.message || error.error);
        }
      }
    };
    fetchLeave();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      const response = await apiService.put(LEAVE.UPDATE_STATUS(id), {
        status,
      });
      if (response.success) {
        navigate("/admin-dashboard/leaves");
      }
    } catch (error) {
      if (!error.success) {
        alert(error.message || error.error);
      }
    }
  };

  return (
    <>
      {leave ? (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto mt-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
            Leave Details
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded-full flex items-center justify-center"
          >
            {" "}
            <FiArrowLeft size={20} />
          </button>

          <div className="flex gap-6 items-start">
            {/* Profile Image */}
            <div className="w-45 h-45 flex-shrink-0">
              <img
                src={`${FILE_BASE_URL}/${
                  leave.employeeId?.userId?.profileImage ||
                  "default-profile.png"
                }`}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-gray-300 shadow-md"
              />
            </div>

            {/* Employee Info */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <p className="text-sm font-semibold text-gray-500">Name</p>
                <p className="text-lg font-medium text-gray-800">
                  {leave.employeeId?.userId?.name || "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Employee ID
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {leave.employeeId?.employeeId || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Leave Type
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {leave.leaveType}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">Reason</p>
                <p className="text-lg font-medium text-gray-800">
                  {leave.reason}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Start Date
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {new Date(leave.startDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">End Date</p>
                <p className="text-lg font-medium text-gray-800">
                  {new Date(leave.endDate).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Department
                </p>
                <p className="text-lg font-medium text-gray-800">
                  {leave.employeeId?.department?.dep_name || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">
                  {leave.status === "Pending" ? "Action" : "Status"}
                </p>

                {leave.status === "Pending" ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => changeStatus(leave._id, "Approved")}
                      className="flex items-center justify-center gap-2 cursor-pointer px-5 py-2 rounded-lg bg-green-500 text-white font-medium text-sm shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200 ease-in-out"
                    >
                      <FaCheck className="text-lg" /> Approve
                    </button>
                    <button
                      onClick={() => changeStatus(leave._id, "Rejected")}
                      className="flex items-center justify-center gap-2 cursor-pointer px-5 py-2 rounded-lg bg-red-500 text-white font-medium text-sm shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200 ease-in-out"
                    >
                      <FaTimes className="text-lg" /> Reject
                    </button>
                  </div>
                ) : (
                  <p
                    className={`text-lg font-medium ${
                      leave.status === "Approved"
                        ? "text-green-600"
                        : leave.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {leave.status}
                  </p>
                )}
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

export default DetailLeave;
