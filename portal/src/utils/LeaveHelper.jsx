import { useNavigate } from "react-router-dom";
import { MdOutlineVisibility } from "react-icons/md";

export const columns = [
  {
    name: "S no",
    selector: (row) => row.sno,
    width: "70px",
  },
{
  name: "Employee",
  selector:(row) => (
    <div>
      <div>{row.name}</div>
      <div className="italic">{row.employeeId}</div>
    </div>
  ),
  width:"115px",
    center: true,
},
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    width: "180px",
    center: true,
  },
  {
    id: "appliedDate",
    name: "Applied Date",
    selector: (row) => new Date(row.appliedAt).getTime(),
    sortable: true,
    cell: (row) => new Date(row.appliedAt).toLocaleDateString(),
  },
  {
    name: "Start Date",
    selector: (row) => row.startDate,
    width: "150px",
    center: true,
  },
  {
    name: "Last Date",
    selector: (row) => row.endDate,
    width: "150px",
    center: true,
  },
  {
    name: "Days",
    selector: (row) => row.days,
    width: "100px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    width: "100px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

export  const customStyles = {
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

export const LeaveButtons = ({ Id }) => {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/admin-dashboard/leaves/${id}`);
  };

  return (
    <button
      className=" flex items-center gap-2 px-4 py-2 bg-blue-500 rounded-b-md text-white rounded-lg cursor-pointer hover:bg-blue-600 transition font-medium shadow-md"
      onClick={() => handleView(Id)}
    >
      <MdOutlineVisibility className="w-4 h-4" />
      <span>View</span>
    </button>
  );
};
