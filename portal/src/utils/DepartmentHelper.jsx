export const columns = [
  {
    name: "S No",
    // center: true,
    selector: (row) => row.sno,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
    // sortable:true
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center:true
  },
];
export const customStyles = {
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

import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DEPARTMENT } from "../constants/appConstants";
import { apiService } from "../services/apiService";

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (_id) => {
    const confirm = window.confirm("Are you sure you want to delete this department?");
    if (confirm) {
      try {
        const res = await apiService.delete(DEPARTMENT.DELETE(_id));

        if (res.success) {
          onDepartmentDelete(_id);
        }
      } catch (error) {
        if (!error.success) {
          alert(error.message || error.error);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-100 transition cursor-pointer"
        onClick={() => navigate(`/admin-dashboard/departments/${_id}`)}
      >
        <FaEdit className="w-4 h-4" />
        <span>Edit</span>
      </button>

      <button
        className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100 transition cursor-pointer"
        onClick={() => handleDelete(_id)}
      >
        <FaTrash className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
};
