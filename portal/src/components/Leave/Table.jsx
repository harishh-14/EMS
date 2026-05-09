import React, { useEffect, useState } from "react";
import { columns, customStyles, LeaveButtons } from "../../utils/LeaveHelper";
import DataTable from "react-data-table-component";
import axios from "axios";
import { apiService } from "../../services/apiService";
import { LEAVE } from "../../constants/appConstants";

function Table() {
  const [leaves, setLeaves] = useState(null);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [activeStatus, setActiveStatus] = useState("All"); // Track active segment

  const fetchLeaves = async () => {
    try {
      const res = await apiService.get(LEAVE.GET_ALL);

      if (res.success) {
        let sno = 1;
        const data = res.leaves.map((leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          return {
            _id: leave._id,
            sno: sno++,
            employeeId: leave.employeeId?.employeeId || "NA",
            name: leave.employeeId?.userId?.name || "unknown",
            leaveType: leave.leaveType,
            appliedAt: leave.appliedAt,
            // department: leave.employeeId?.department?.dep_name || "unknown",
            startDate: new Date(leave.startDate).toLocaleDateString("en-GB"), // dd/mm/yyyy
            endDate: new Date(leave.endDate).toLocaleDateString("en-GB"),
            days: days,
            status: leave.status,
            action: <LeaveButtons Id={leave._id} />,
          };
        });
        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      if (!error.success) {
        alert(error.message || error.error);
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filterByInput = (e) => {
    const value = e.target.value.toLowerCase();

    const records = leaves.filter(
      (leave) => leave.name && leave.name.toLowerCase().includes(value)
    );
    setFilteredLeaves(records);
  };

  const filterByStatus = (status) => {
    setActiveStatus(status);
    if (status === "All") {
      setFilteredLeaves(leaves);
    } else {
      const records = leaves.filter(
        (leave) =>
          leave.status && leave.status.toLowerCase() === status.toLowerCase()
      );
      setFilteredLeaves(records);
    }
  };

  const segmentButtons = ["All", "Pending", "Approved", "Rejected"];

  return (
    <>
      {filteredLeaves ? (
        <div className="p-6 bg-white shadow rounded-lg">
          <div className="mb-4 text-center">
            <h3 className="text-2xl font-bold text-gray-800">Manage Leaves</h3>
          </div>

          {/* Search + Button Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by emp name..."
              onChange={filterByInput}
              className="w-full sm:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
            />

            {/* Segment Buttons */}
            <div className="flex gap-0 -mt-2 mr-15">
              {segmentButtons.map((status, index) => (
                <button
                  key={status}
                  onClick={() => filterByStatus(status)}
                  className={`
        px-4 py-2 border cursor-pointer
         transition-all duration-300 ease-in-out
        ${index === 0 ? "rounded-l-lg" : ""}
        ${index === segmentButtons.length - 1 ? "rounded-r-lg" : ""}
        ${
          activeStatus === status
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white text-blue-500 border-blue-500"
        }
        hover:${activeStatus === status ? "bg-blue-600" : "bg-blue-100"}
      `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <DataTable
            className="mt-5"
            columns={columns}
            data={filteredLeaves}
            pagination
            defaultSortField="appliedDate"
            customStyles={customStyles}
            defaultSortAsc={false}
          />
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </>
  );
}

export default Table;
