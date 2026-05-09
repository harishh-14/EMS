import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { apiService } from "../../services/apiService";
import { TASK } from "../../constants/appConstants";
import { FaTasks } from "react-icons/fa";
import dayjs from "dayjs";

export default function TaskReportOfAll() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await apiService.get(TASK.GET_ALL); // /api/task
      console.log("Tasks order before table:", res.tasks.map(t => t.date));
      setTasks(res.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const columns = [
     {
      name: "Name",
      selector: (row) => row.userId.name,
      sortable: false,
      width: "250px",
    },
    {
      name: "Date",
       selector: (row) => dayjs(row.date).format("DD-MM-YYYY"),
      sortable: false,
      width: "250px",
    },
   {
    name: "Task",
    selector: (row) => row.task,
    wrap: true, // ✅ important to enable row wrapping
    grow: 2,
    cell: (row) => (
      <div className="flex items-start gap-2">
        <FaTasks className="text-blue-500 mt-1"  size={13}/>
        <span className="flex-1 break-words">{row.task}</span>
      </div>
    ),
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
         whiteSpace: "normal", // ✅ allows wrapping
      wordBreak: "break-word", // ✅ breaks long words
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tasks Report</h2>
      <DataTable
        columns={columns}
        data={tasks}
        progressPending={loading}
        customStyles={customStyles}
        pagination
        highlightOnHover
        responsive
        // defaultSortFieldId={1}
      />
    </div>
  );
}
