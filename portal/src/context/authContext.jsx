import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AUTH } from "../constants/appConstants";
import { apiService } from "../services/apiService";

const userContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await apiService.get(AUTH.VERIFY);
          if (res.success) {
            setUser(res.user);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        if (!error?.error) {
          console.log(error?.message || error?.error || "Something went wrong");
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, []);

  const login = (user) => {
    setUser(user);
  };
  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      setUser(null);
      localStorage.removeItem("token");
      toast("You have successfully logged out.", {
        position: "top-right",
        autoClose: 3000,
        style: { backgroundColor: "white", color: "blue" }, // blue background, white text
      });
    }
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </userContext.Provider>
  );
}

export const useAuth = () => useContext(userContext);
export default AuthContext;
