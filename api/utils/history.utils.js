import History from "../models/history.model.js";

export const saveHistory = async ({
  module,
  action,
  performedBy,
  targetModule,
  targetId,
  oldValue = null,
  newValue = null,
  description = "",
}) => {
  try {
    await History.create({
      module,
      action,
      performedBy,
      targetModule,
      targetId,
      oldValue,
      newValue,
      description,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Failed to save history:", error);
  }
};