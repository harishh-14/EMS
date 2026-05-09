import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useAuth } from "../../context/authContext";
import { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import AttendanceActions from "../attendance/Attendance";
import { ATTENDANCE } from "../../constants/appConstants";
import { motion } from "framer-motion";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6" , "#a855f7"];

export default function Summary() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [todaysStatus, setTodaysStatus] = useState("Not Yet Checked In");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiService.get(ATTENDANCE.GET_SUMMARY);
        setSummary(res);
        if (res.todaysStatus) {
          setTodaysStatus(res.todaysStatus.statusText);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-3 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!summary?.success) {
    return (
      <p className="p-6 text-red-500 text-center">⚠️ Failed to load data</p>
    );
  }

  const { lastLogin, quickSummary, overview } = summary;

  const data = [
    { name: "Present", value: overview.present || 0 },
    { name: "Absent", value: overview.absent || 0 },
    { name: "Leave", value: overview.leave || 0 },
    // { name: "Weekend", value: overview.weekend || 0 }, 
  ];

  return (
    <div className="p-6 space-y-8">

      {/* Attendance + Chart in same card */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-md rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">📝 Attendance & Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Attendance Actions */}
          <div className="flex justify-center">
            <AttendanceActions setTodaysStatus={setTodaysStatus} />
          </div>

          {/* Pie Chart */}
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Last Login */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-md rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold mb-2">🕒 Last Login</h2>
            <p className="text-gray-700 font-medium">
              {lastLogin
                ? new Date(lastLogin).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "No login record"}
            </p>
          </motion.div>

          {/* Today's Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-md rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold mb-2">📌 Today's Status</h2>
            <p
              className={`text-xl font-bold ${
                todaysStatus === "Checked In"
                  ? "text-green-600"
                  : todaysStatus === "Checked Out"
                  ? "text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {todaysStatus}
            </p>
          </motion.div>
        </div>

        {/* Quick Summary */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">⚡ Quick Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition">
              <p className="text-gray-600 text-sm">Attendance</p>
              <h3 className="text-2xl font-bold text-green-600">
                {quickSummary.attendancePercent}%
              </h3>
            </div>
            <div className="bg-red-50 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition">
              <p className="text-gray-600 text-sm">Absent Days</p>
              <h3 className="text-2xl font-bold text-red-600">
                {quickSummary.absentDays}
              </h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 shadow-sm text-center hover:shadow-md transition">
              <p className="text-gray-600 text-sm">Leaves</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {quickSummary.leaves}
              </h3>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
