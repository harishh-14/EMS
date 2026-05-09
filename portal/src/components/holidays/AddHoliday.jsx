import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HOLIDAY } from "../../constants/appConstants";
import { apiService } from "../../services/apiService";
import { toast } from "react-toastify";

function AddHoliday() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const dateRef = useRef(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.post(HOLIDAY.ADD, { name, date });

      if (res.success) {
        console.log(res.success)
        navigate("/admin-dashboard/holidays"); // ✅ success ke baad redirect
        toast.success("Holiday Added Successfully! ✅", {
          position: "top-right",
          autoClose: 3000,
          style: { backgroundColor: "white", color: "blue" }, // blue background, white text
        });
      }
    } catch (error) {
      if (!error.success) {
        alert(error.message || error.error);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleDivClick = (inputRef) => {
    if (inputRef.current) {
      // Modern browsers
      inputRef.current.showPicker?.() || inputRef.current.focus();
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-4 mr-12 mt-8">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Add New Holiday
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Holiday Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">
              Holiday Name
            </label>
            <input
              type="text"
              placeholder="Enter holiday name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Holiday Date */}
          <div
            className="flex flex-col"
            onClick={() => handleDivClick(dateRef)}
          >
            <label className="text-gray-700 font-medium mb-1">
              Holiday Date
            </label>
            <input
              type="date"
              value={date}
              ref={dateRef}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard/holidays")}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition"
            >
              Save Holiday
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddHoliday;
