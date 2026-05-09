import React from 'react'
import {NavLink} from "react-router-dom"
import { FaCalendarAlt, FaCog , FaClipboardList, FaTasks } from "react-icons/fa"
import { MdPerson } from "react-icons/md";
import { useAuth } from '../../context/authContext';
import { MdDashboard } from "react-icons/md"

function Sidebar() {

const {user} = useAuth();

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
  <div className="bg-blue-500 h-12 flex items-center justify-center">
    <h3 className="text-2xl text-center font-bold">Employee MS</h3>
  </div>
  <div className="mt-4 space-y-1">
    <NavLink
      to="/employee-dashboard"
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] ml-4"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
      end
    >
      <MdDashboard  />
      <span>Dashboard</span>
    </NavLink>

    <NavLink
      to={`/employee-dashboard/profile/${user._id}`}
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200  w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <MdPerson size={20} />
      <span>My Profile</span>
    </NavLink>

      <NavLink
      to={"/employee-dashboard/attendance-report"}
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <FaClipboardList   />
      <span>Attendance Report</span>
    </NavLink>

     <NavLink
      to={"/employee-dashboard/task-report"}
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <FaTasks  />
      <span>Task Report</span>
    </NavLink>

    <NavLink
      to={`/employee-dashboard/leaves/${user._id}`}
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <FaCalendarAlt />
      <span>Leaves</span>
    </NavLink>

    <NavLink
      to="/employee-dashboard/setting"
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <FaCog />
      <span>Settings</span>
    </NavLink>
  </div>
</div>
  )
}

export default Sidebar