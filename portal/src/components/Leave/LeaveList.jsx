import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import DataTable from "react-data-table-component";
import { apiService } from "../../services/apiService";
import { LEAVE } from "../../constants/appConstants";

function LeaveList() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [msg , setMsg] = useState(null)

  const { id } = useParams();

  const fetchLeaves = async () => {
    try {
      const response = await apiService.get(LEAVE.GET_BY_ID(id));
      if (response.success) {
        setLeaves(response.leaves);
      }
    } catch (error) {
      if (!error.success) {
        setMsg(error.message || error.error);
      }
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const columns = [
    {
      name: "S.No",
      selector: (row, index) => index + 1,
      width: "70px",
    },
    {
      name: "Leave Type",
      selector: (row) => row.leaveType,
      sortable: true,
    },
    {
      name: "From",
      selector: (row) => new Date(row.startDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "To",
      selector: (row) => new Date(row.endDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.reason || "--",
      wrap: true,
    },
    {
      id: "appliedDate",
      name: "Applied Date",
      selector: (row) => new Date(row.appliedAt).getTime(),
      sortable: true,
      cell: (row) => new Date(row.appliedAt).toLocaleDateString(),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`font-semibold ${
            row.status === "Approved"
              ? "text-green-600"
              : row.status === "Rejected"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        fontSize: "12px", // Row font size
      },
    },
    headCells: {
      style: {
        fontSize: "15px", // Header font size
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        fontSize: "14px", // Cell font size
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      {/* Title */}
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-800">Manage Leaves</h3>
      </div>

      {/* Search + Button Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full sm:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-10"
        />

        {/* Add New Leave Button */}
        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200 text-center mr-10"
          >
            Add New Leave
          </Link>
        )}
      </div>
      <div className="mt-10">
        <DataTable
          columns={columns}
          data={leaves}
          noHeader
          pagination
          customStyles={customStyles}
          highlightOnHover
          pointerOnHover
          responsive
          striped
          defaultSortField="appliedDate"
          defaultSortAsc={false}
          noDataComponent={
            <div className="text-center text-gray-500 py-4">
             {msg}
            </div>
          }
        />
      </div>
    </div>
  );
}

export default LeaveList;
