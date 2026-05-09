import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import { MdOutlineVisibility } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/apiService";
import { DEPARTMENT } from "../constants/appConstants";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    center: true,
    width: "100px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    center: true,
    width: "180px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    center: true,
    width: "140px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    center: true,
    width: "200px",
  },
  {
    name: "DOJ",
    selector: (row) => row.doj,
    sortable: true,
    center: true,
    sortFunction: (a, b) => new Date(a.doj) - new Date(b.doj),
    width: "140px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
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

export const fetchDepartments = async () => {
  let departments;
  try {
    const res = await apiService.get(DEPARTMENT.GET_ALL);

    if (res.success) {
      departments = res.departments;
    }
  } catch (error) {
    if (!error.success) {
      alert(error.message || error.error);
    }
  }
  return departments;
};

export const EmployeeButtons = ({ _id }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      {/* View Button - Blue */}
      <button
        className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-100 transition cursor-pointer"
        onClick={() => navigate(`/admin-dashboard/employees/${_id}`)}
      >
        <MdOutlineVisibility className="w-4 h-4" />
        <span>View</span>
      </button>

      {/* Edit Button - Yellow */}
      <button 
        className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-md text-sm hover:bg-yellow-100 transition cursor-pointer" 
         onClick={() => navigate(`/admin-dashboard/employees/edit/${_id}`)}>
        <FaEdit className="w-4 h-4" />
        <span>Edit</span>
      </button>

      {/* Leave Button - Red */}
      <button onClick={() => navigate(`/admin-dashboard/employees/leaves/${_id}`)} className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm hover:bg-red-100 transition cursor-pointer">
        <BiCalendar className="w-4 h-4" />
        <span>Leave</span>
      </button>
    </div>
  );
};
