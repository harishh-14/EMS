import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import {
  FaBuilding,
  FaCheckCircle,
  FaFileAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiService";
import { SUMMARY } from "../../constants/appConstants";

const COLORS = ["#4ade80", "#f87171", "#60a5fa" , "#fbbf24"]; // Present, Absent, Leave

function AdminSummary() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiService.get(SUMMARY.GET);
        const data = res;
        setSummary(data);

        // ✅ Safe check before setting charts
        const present = data?.attendance?.present || 0;
        const absent = data?.attendance?.absent || 0;
        const leave = data?.attendance?.leave || 0;

        // Prepare Pie Chart data
        setAttendanceData([
          { name: "Present", value: present },
          { name: "Absent", value: absent },
          { name: "Leave", value: leave },
          { name: "Weekend", value: data.attendance.weekend }, // new category
        ]);

        // Set Weekly Trend
        setWeeklyTrend(data.weeklyTrend);
      } catch (error) {
        console.error("Error fetching summary:", error);
        alert(
          error?.message ||
            error?.error ||
            "Something went wrong while fetching summary"
        );
      }
    };
    fetchSummary();
  }, []);

  if (!summary) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Welcome + Date */}
      <div className="bg-white rounded-xl px-6 py-3 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Welcome, <span className="text-blue-600">{user.name}</span>
        </h2>
        <p className="text-gray-500 mt-1">
          📅 Date: {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* <h3 className="text-2xl font-bold mt-5">Dashboard Overview</h3> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <SummaryCard
          icon={<FaUsers />}
          text="Total Employee"
          number={summary.totalEmployees}
          color="bg-blue-500"
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Deparrments"
          number={summary.totalDepartments}
          color="bg-yellow-500"
        />
      </div>

      <div className="mt-5">
        {/* <h4 className="text-center text-2xl font-bold">Leave Details</h4> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <SummaryCard
            icon={<FaFileAlt />}
            text="Leave Applied"
            number={summary.leaveApplied}
            color="bg-blue-500"
            onClick={() => navigate("/admin-dashboard/leaves")} // <-- Navigate to your target page
            className="cursor-pointer"
          />
          <SummaryCard
            icon={<FaCheckCircle />}
            text="Leave Approved"
            number={summary.leaveApproved}
            color="bg-green-500"
          />
          <SummaryCard
            icon={<FaHourglassHalf />}
            text="Leave Pending"
            number={summary.leavePending}
            color="bg-yellow-500"
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summary.leaveRejected}
            color="bg-red-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Pie Chart */}
        <div className="mt-12 bg-white shadow-md">
          <h4 className="text-center text-2xl font-bold">Attendance Status</h4>
          <div className="flex justify-between mt-2">
            <p className="text-gray-500 ml-2">
              📅 Date: {new Date().toLocaleDateString()}
            </p>
            <div className="flex justify-center gap-6 text-sm font-medium mr-3">
              <div className="flex items-center gap-1 text-green-500">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1 text-blue-500">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span>Leave</span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span>Absent</span>
              </div>
            </div>
          </div>
          <div className="w-full h-64 mt-6">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  // labelLine={true}
                  label={({ name, value }) =>
                    value > 0 ? `${name}: ${value}` : ""
                  }
                >
                  {attendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="mt-12 bg-white shadow-md">
          <h4 className="text-center text-2xl font-bold">
            Weekly Attendance Trend
          </h4>
          <div className="w-full h-64 mt-6 ">
            <ResponsiveContainer>
              <LineChart
                data={weeklyTrend}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  stroke="#4ade80"
                  strokeWidth={2}
                  dot
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  stroke="#f87171"
                  strokeWidth={2}
                  dot
                />
                <Line
                  type="monotone"
                  dataKey="leave"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  dot
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSummary;
