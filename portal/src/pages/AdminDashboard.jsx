import React from "react";
import { useAuth } from "../context/authContext";
import AdminSidebar from "../components/dashboard/AdminSidebar";
import Navbar from "../components/dashboard/Navbar";
import AdminSummary from "../components/dashboard/AdminSummary";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
    <div className="flex">
      {/* Sidebar */}
      <div className="hidden md:block fixed md:relative">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 bg-gray-100 min-h-screen">
        <Navbar />
       <div className="flex-1  pt-12 bg-gray-100 min-h-screen overflow-y-auto">
                 <Outlet />
               </div>
      </div>
    </div>
    </>
  );
}

export default AdminDashboard;
