import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useEffect } from "react";
import { apiService } from "../../services/apiService";
import { ATTENDANCE, TASK } from "../../constants/appConstants";

function AttendanceActions({ setTodaysStatus }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [attendance, setAttendance] = useState({
    checkInTime: null,
    checkOutTime: null,
    totalHours: null,
    checkInLocation: null,
    checkOutLocation: null,
  });

  // ✅ New state for task modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [task, setTask] = useState("");

  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const res = await apiService.get(ATTENDANCE.GET_TODAY);
        if (res.attendance) {
          setAttendance(res.attendance);
        }
      } catch (err) {
        console.error("Failed to fetch attendance:", err.message);
      }
    };

    if (user) fetchTodayAttendance();
  }, [user]);

  const formatTime = (time) => {
    if (!time) return "--";
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // ✅ function to get browser location
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const accuracy = pos.coords.accuracy;

            // ✅ call geocoding API for human-readable address
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );

            const address = res.data.display_name || `Lat: ${lat}, Lng: ${lng}`;

            resolve({
              lat,
              lng,
              accuracy,
              address, // proper readable address
            });
          } catch (err) {
            console.error("Error fetching address:", err);
            resolve({
              lat,
              lng,
              accuracy,
              address: `Lat: ${lat}, Lng: ${lng}`, // fallback if API fails
            });
          }
        },
        (err) => {
          reject(err.message || "Location permission denied");
        }
      );
    });
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);

      // ✅ get location before check-in
      const location = await getLocation();

      const res = await apiService.post(
        ATTENDANCE.CHECKIN,
        { location } //send location
      );

      // Update attendance state with check-in time from response
      setAttendance((prev) => ({
        ...prev,
        checkInTime: res.checkInTime, // make sure backend returns checkInTime
        checkInLocation: res.checkInLocation,
      }));

      // ✅ Instantly update today's status in parent
      if (setTodaysStatus) {
        setTodaysStatus("Checked In");
      }

      setMessage(res.message || "Checked in successfully");
    } catch (err) {
      setMessage(err.message || err.error || "Error occurred during check-in");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Open modal instead of checkout directly
  const handleCheckOutClick = () => {
    setShowTaskModal(true);
  };

  // const handleCheckOut = async () => {
  //   try {
  //     setLoading(true);

  //     // ✅ get location before check-out
  //     const location = await getLocation();

  //     const res = await apiService.post(ATTENDANCE.CHECKOUT, { location });

  //     // Update attendance state with check-out time and total hours from response
  //     setAttendance((prev) => ({
  //       ...prev,
  //       checkOutTime: res.checkOutTime, // make sure backend returns checkOutTime
  //       checkOutLocation: res.checkOutLocation,
  //       totalHours: res.totalHours, // and totalHours
  //     }));

  //     // ✅ Instantly update today's status in parent
  //     if (setTodaysStatus) {
  //       setTodaysStatus("Checked Out");
  //     }

  //     setMessage(res.message || "Checked out successfully");
  //   } catch (err) {
  //     setMessage(
  //       err?.message || err?.error || "Error occurred during check-out"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleTaskSubmit = async () => {

    if (!task || task === "<p><br></p>") {
      setMessage("Please write today’s task before submitting.");
      return;
    }

    try {
      setLoading(true);
      const location = await getLocation();

      // Save task
      await apiService.post(TASK.ADD, { task, date: new Date() });

      // Checkout attendance
      const res = await apiService.post(ATTENDANCE.CHECKOUT, { location });

      setAttendance((prev) => ({
        ...prev,
        checkOutTime: res.checkOutTime,
        checkOutLocation: res.checkOutLocation,
        totalHours: res.totalHours,
      }));

      if (setTodaysStatus) setTodaysStatus("Checked Out");

      setMessage(res.message || "Checked out successfully");
      setShowTaskModal(false);
      setTask(""); // reset editor
    } catch (err) {
      setMessage(err?.message || err?.error || "Error during checkout");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <p className="text-red-500">Please log in to mark attendance.</p>;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-6 p-8  bg-white rounded-3xl shadow-xl w-[360px] mx-auto border border-gray-200 hover:shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 tracking-wide mb-2">
          Employee Attendance
        </h2>

        {message && (
          <p
            className={`text-sm font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleCheckIn}
            disabled={loading || attendance.checkInTime}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-2xl shadow-md w-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            {loading ? "Processing..." : "Check In"}
          </button>

          <button
            // onClick={handleCheckOut}
            onClick={handleCheckOutClick}
            disabled={
              loading || !attendance.checkInTime || attendance.checkOutTime
            }
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-2xl shadow-md w-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
          >
            {loading ? "Processing..." : "Check Out"}
          </button>
        </div>

        <div className="w-full bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 border border-gray-100 shadow-inner mt-4">
          <p className="mb-2">
            <span className="font-medium text-gray-800">Check-In:</span>{" "}
            {attendance.checkInTime ? formatTime(attendance.checkInTime) : "--"}
          </p>
          {attendance.checkInLocation && (
            <p className="mb-2 text-xs text-gray-600">
              📍{" "}
              {attendance.checkInLocation.address
                ? attendance.checkInLocation.address
                : `${attendance.checkInLocation.lat}, ${attendance.checkInLocation.lng}`}
            </p>
          )}

          <p className="mb-2">
            <span className="font-medium text-gray-800">Check-Out:</span>{" "}
            {attendance.checkOutTime
              ? formatTime(attendance.checkOutTime)
              : "--"}
          </p>
          {attendance.checkInLocation && (
            <p className="mb-2 text-xs text-gray-600">
              📍{" "}
              {attendance.checkOutLocation?.address
                ? attendance.checkOutLocation.address
                : `${attendance.checkOutLocation?.lat}, ${attendance.checkOutLocation?.lng}`}
            </p>
          )}

          <p>
            <span className="font-medium text-gray-800">Total Hours:</span>{" "}
            {attendance.totalHours ? `${attendance.totalHours} hrs` : "--"}
          </p>
        </div>
      </div>


      {showTaskModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
    <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-lg p-6 mx-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Enter Today’s Task
      </h3>

      {/* Normal textarea editor */}
      <textarea
      name="task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Write your task for today..."
        className="w-full h-44 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-6 bg-white/80 backdrop-blur-sm"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowTaskModal(false)}
          className="px-5 py-2 bg-gray-200 cursor-pointer text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleTaskSubmit}
          disabled={loading || !task.trim()}
          className="px-5 py-2 bg-green-600 cursor-pointer text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Submit & Checkout"}
        </button>
      </div>
    </div>
  </div>
)}


    </>
  );
}

export default AttendanceActions;
