
import Holiday from "../models/holiday.model.js"

const addHoliday = async (req, res) => {
  try {
    const { name, date } = req.body;

    // Validation
    if (!name || !date) {
      return res.status(400).json({
        success: false,
        message: "Holiday name and date are required",
      });
    }

    // Check if holiday already exists on this date
    const existingHoliday = await Holiday.findOne({ date });
    if (existingHoliday) {
      return res.status(400).json({
        success: false,
        message: "Holiday already exists on this date",
      });
    }

    // Create new holiday
    const holiday = await Holiday.create({
      name,
      date,
      createdBy: req.user?._id, // 🛑 req.user middleware se aayega (auth middleware me set karo)
    });

    res.status(201).json({
      success: true,
      message: "Holiday added successfully",
      holiday,
    });
  } catch (error) {
    console.error("Error adding holiday:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding holiday",
      error: error.message,
    });
  }
};

const getHoliday = async (req, res) => {
  try {

    // Create new holiday
    const holidays = await Holiday.find();

    res.status(201).json({
      success: true,
      message: "Holiday fetched successfully",
      holidays,
    });
  } catch (error) {
    console.error("Error adding holiday:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching holiday",
      error: error.message,
    });
  }
};


export { addHoliday , getHoliday};
