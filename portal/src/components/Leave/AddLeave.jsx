import React, { useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { apiService } from "../../services/apiService";
import { LEAVE } from "../../constants/appConstants";

function AddLeave() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leave, setLeave] = useState({
    userId: user._id,
  });

  const startRef = useRef(null);
  const endRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDivClick = (inputRef) => {
    if (inputRef.current) {
      // Modern browsers
      inputRef.current.showPicker?.() || inputRef.current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await apiService.post(LEAVE.ADD, leave);
      if (response.success) {
        navigate(`/employee-dashboard/leaves/${user._id}`);
      }
    } catch (error) {
      if (!error.success) {
        alert(error.message || error.error);
      }
    }
    // TODO: send leaveData to backend
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10 mr-100">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Request for Leave
      </h2>
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer bg-gray-200 mb-3 hover:bg-gray-300 p-2 rounded-full flex items-center justify-center"
      >
        {" "}
        <FiArrowLeft size={20} />
      </button>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Leave Type */}
        <div>
          <label className="block mb-1 font-medium">Leave Type</label>
          <select
            name="leaveType"
            // value={leaveData.leaveType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
        </div>

        {/* From Date */}
        <div className="flex gap-4">
          <div className="w-1/2" onClick={() => handleDivClick(startRef)}>
            <label className="block mb-1 font-medium">From Date</label>
            <input
              type="date"
              name="startDate"
              ref={startRef}
              //   value={leaveData.fromDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* To Date */}
          <div className="w-1/2" onClick={() => handleDivClick(endRef)}>
            <label className="block mb-1 font-medium">To Date</label>
            <input
              type="date"
              name="endDate"
              ref={endRef}
              //   value={leaveData.toDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              min={leave.startDate}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="reason"
            // value={leaveData.description}
            onChange={handleChange}
            placeholder="Enter reason for leave..."
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="3"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLeave;
