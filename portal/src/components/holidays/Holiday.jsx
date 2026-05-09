import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiService";
import { HOLIDAY } from "../../constants/appConstants";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Holiday() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch holidays from API
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await apiService.get(HOLIDAY.GET_ALL);
        if (res.success) {
          setHolidays(res.holidays || []);
        }
      } catch (error) {
        if (!error?.success) {
          alert(error.message || error.error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  // ✅ Columns for DataTable
  const columns = [
    {
      name: "S. no.",
      selector: (row, index) => index + 1,
      width: "100px",
    },
    {
      name: "Date",
      selector: (row) => dayjs(row.date).format("DD MMM YYYY"),
      sortable: true,
    },
    {
      name: "Holiday Name",
      selector: (row) => row.name,
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
      <ToastContainer />
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-800">Manage Holidays</h3>
      </div>

      <div className="flex justify-end mb-2">
        <Link
          to="/admin-dashboard/add-holiday"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 w-50 transition duration-200 text-center"
        >
          Add Holiday
        </Link>
      </div>

      {/* ✅ DataTable */}
      <DataTable
        columns={columns}
        data={holidays}
        progressPending={loading}
        pagination
        highlightOnHover
        customStyles={customStyles}
        striped
        responsive
      />
    </div>
  );
}

export default Holiday;
