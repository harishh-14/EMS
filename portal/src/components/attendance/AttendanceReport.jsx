import React from "react";
import { useAuth } from "../../context/authContext";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { apiService } from "../../services/apiService";
import { ATTENDANCE } from "../../constants/appConstants";

function Summary() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await apiService.get(ATTENDANCE.GET_ALL);
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) return <p>Loading...</p>;

  const columns = [
    {
      name: "Date",
      selector: (row) => formatDate(row.date),
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.userId.name,
    },
    {
      name: "Email",
      selector: (row) => row.userId.email,
    },
    {
      name: "Check-In",
      selector: (row) =>
        row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString() : "--",
    },
    {
      name: "Check-Out",
      selector: (row) =>
        row.checkOutTime
          ? new Date(row.checkOutTime).toLocaleTimeString()
          : "--",
    },
    {
      name: "Total Hours",
      selector: (row) => (row.totalHours ? `${row.totalHours} hrs` : "--"),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`font-semibold ${
            row.status === "Present"
              ? "text-green-600"
              : row.status === "Checked In"
              ? "text-yellow-600"
              : row.status === "Leave"
              ? "text-blue-600"
              : row.status === "Weekend"
              ? "text-purple-600"
              : "text-red-600" // Absent
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
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Attendance Records</h2>

      <DataTable
        columns={columns}
        data={records}
        progressPending={loading}
        customStyles={customStyles}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        striped
      />
    </div>
  );
}

export default Summary;
