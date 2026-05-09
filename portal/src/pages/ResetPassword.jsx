import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { AUTH } from "../constants/appConstants";
import { apiService } from "../services/apiService";

export default function ResetPassword() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  // Token check on page load
  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await apiService.get(AUTH.CHECK_RESET_TOKEN(token));
        if (!res.success) {
          setIsExpired(true);
        }
      } catch (err) {
        setIsExpired(true);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match!");
      return;
    }

    try {
      const res = await apiService.post(AUTH.RESET_PASSWORD(token), {
        newPassword,
        confirmPassword,
      });
      if (res.success) {
        setMsg(res.message);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMsg(error.message || "Something went wrong");
    }
  };

  if (loading) return <p className="text-center">Checking reset link...</p>;

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-bold text-red-500">Link Expired!</h2>
        <p className="mt-2">Your password reset link has expired.</p>
        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Request New Link
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 border rounded mb-4"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">
          Reset Password
        </button>
      </form>
      {msg && <p className="mt-4 text-center text-sm">{msg}</p>}
    </div>
  );
}
