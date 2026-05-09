import React from "react";
import { useAuth } from "../../context/authContext";

function Navbar() {
  const { user, logout } = useAuth();
  return (
   <div className="fixed top-0 left-0 md:left-64 right-0 z-50 flex flex-col md:flex-row items-center justify-between text-white h-12 bg-blue-500 px-4 md:px-8">
  <p className="text-sm md:text-base mt-2 md:mt-0"> 👋 Welcome, {user.name}</p>
  <button
    className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out cursor-pointer mt-2 md:mt-0"
    onClick={logout}
  >
    Logout
  </button>
</div>
  );
}

export default Navbar;
