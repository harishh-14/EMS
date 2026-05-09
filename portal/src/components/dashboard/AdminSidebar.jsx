import React from 'react'
import {NavLink} from "react-router-dom"
import {FaBuilding, FaCalendarAlt, FaCog, FaClipboardList , FaUsers, FaTasks } from "react-icons/fa"
import { MdDashboard } from 'react-icons/md'
import { GiPalmTree } from "react-icons/gi";

function AdminSidebar() {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64 z-50">
  <div className="bg-blue-500 h-12 flex items-center justify-center">
    <h3 className="text-2xl text-center font-bold">Employee MS</h3>
  </div>
  <div className="mt-4 space-y-1">
    <NavLink
      to="/admin-dashboard"
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] ml-4"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
      end
    >
      <MdDashboard />
      <span>Dashboard</span>
    </NavLink>

    <NavLink
      to="/admin-dashboard/employees"
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200  w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <FaUsers />
      <span>Employee</span>
    </NavLink>

    <NavLink
      to="/admin-dashboard/departments"
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <FaBuilding />
      <span>Department</span>
    </NavLink>

     <NavLink
      to="/admin-dashboard/attendances"
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
       <FaClipboardList />
      <span>Attendances</span>
    </NavLink>

      <NavLink
      to="/admin-dashboard/tasks"
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
       <FaTasks />
      <span>Tasks</span>
    </NavLink>


    <NavLink
      to="/admin-dashboard/leaves"
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
      to="/admin-dashboard/holidays"
      className={({ isActive }) =>
        `flex items-center space-x-4 block py-2.5 px-4 rounded transition-colors duration-200 w-[85%] ml-4 ${
          isActive
            ? "bg-blue-500 text-white w-[85%] "
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        }`
      }
    >
      <GiPalmTree   />
      <span>Holidays</span>
    </NavLink>

    <NavLink
      to="/admin-dashboard/setting"
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

export default AdminSidebar


