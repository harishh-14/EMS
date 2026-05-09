import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import DataTable from "react-data-table-component";
import Select from "react-select";
import { apiService } from "../../services/apiService";
import { ATTENDANCE, EMPLOYEE } from "../../constants/appConstants";

function AttendanceAdminSection() {
  const [records, setRecords] = useState([]);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await apiService.get(EMPLOYEE.GET_ALL);
        setEmployees(res.employees || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Fetch attendance when date changes
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await apiService.get(ATTENDANCE.GET_ALL_EMPLOYEES, {
          from: dayjs(fromDate).format("YYYY-MM-DD"),
          to: dayjs(toDate).format("YYYY-MM-DD"),
          employeeId: selectedEmployee || undefined,
        });
        setRecords(res.data || []);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [fromDate, toDate, selectedEmployee]);

  // ✅ Define columns for DataTable
  const columns = [
    {
      name: "S. No.",
      selector: (row, index) => index + 1, // use index + 1 for serial number
      width: "90px", // optional: fixed width
    },
    {
      name: "Employee",
      selector: (row) => row.userId?.name || "Unknown",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.userId?.email || "Unknown",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString("en-GB"),
      sortable: true,
    },
    {
      name: "Check In",
      selector: (row) => (
        <div>
          <div>
            {row.checkInTime
              ? new Date(row.checkInTime).toLocaleTimeString()
              : "-"}
          </div>
          {row.checkInLocation && (
            <div>
              <a
                href={`https://www.google.com/maps?q=${row.checkInLocation.lat},${row.checkInLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View on Location
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Check Out",
      selector: (row) => (
        <div>
          <div>
            {row.checkOutTime
              ? new Date(row.checkOutTime).toLocaleTimeString()
              : "-"}
          </div>
          {row.checkOutLocation && (
            <div>
              <a
                href={`https://www.google.com/maps?q=${row.checkOutLocation.lat},${row.checkOutLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View on Location
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Total Hours",
      selector: (row) => row.totalHours || "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        let colorClass = "";
        switch (row.status) {
          case "Present":
            colorClass =
              "bg-green-100 text-green-700 px-2 py-1 rounded border border-green-400";
            break;
          case "Absent":
            colorClass =
              "bg-red-100 text-red-700 px-2 py-1 rounded border border-red-400";
            break;
          case "Leave":
            colorClass =
              "bg-yellow-100 text-yellow-700 px-2 py-1 rounded border border-yellow-400";
            break;
            case "Weekend":
            colorClass =
              "bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-400";
            break;
          default:
            colorClass =
              "bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-400";
        }

        return <span className={colorClass}>{row.status}</span>;
      },
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

  const handleDivClick = (inputRef) => {
    if (inputRef.current) {
      // Modern browsers
      inputRef.current.showPicker?.() || inputRef.current.focus();
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Attendance Records</h2>

      {/* From–To Date Filter */}
      <div className="flex gap-4 mb-4">
        <div onClick={() => handleDivClick(fromRef)}>
          <label className="font-medium mr-2">From: </label>
          <input
            type="date"
            ref={fromRef}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div onClick={() => handleDivClick(toRef)}>
          <label className="font-medium mr-2">To: </label>
          <input
            type="date"
            ref={toRef}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        {/* ✅ Employee Dropdown (Searchable) */}
        <div className="flex gap-4">
          <label className="font-medium mr-2">Employee: </label>
          <div className="w-80">
            <Select
              value={
                selectedEmployee
                  ? employees
                      .map((emp) => ({
                        value: emp.userId?._id,
                        label: emp.userId?.name || "Unknown",
                      }))
                      .find((opt) => opt.value === selectedEmployee)
                  : null
              }
              onChange={(option) =>
                setSelectedEmployee(option ? option.value : "")
              }
              options={[
                { value: "", label: "All Employees" },
                ...employees.map((emp) => ({
                  value: emp.userId?._id,
                  label: emp.userId?.name || "Unknown",
                })),
              ]}
              placeholder="Select employee..."
              isSearchable
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "white",
                  borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // blue border on focus
                  boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
                  borderRadius: "0.5rem", // Tailwind rounded-lg
                  minHeight: "2.5rem",
                  cursor: "pointer",
                  border: "1.5px solid black",
                  marginTop: "-0.3rem",
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: "0.5rem",
                  zIndex: 9999,
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#bfdbfe" : "white",
                  color: "#1f2937", // text-gray-800
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#1f2937",
                }),
                input: (base) => ({
                  ...base,
                  color: "#1f2937",
                }),
              }}
            />
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={records}
        customStyles={customStyles}
        pagination
      />
    </div>
  );
}

export default AttendanceAdminSection;
