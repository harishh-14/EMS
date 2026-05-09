// historySaveMiddleware.js
import { saveHistory } from "../utils/history.utils.js";

export const logHistory = ({ module, action, targetModule , getDescription}) => {
  return async (req, res, next) => {
    // Wrap res.json to capture the response data
    const originalJson = res.json.bind(res);

    res.json = async (data) => {  // your controller must return the new task id
      // Call saveHistory AFTER the controller has run
      if (data.success && data.newRecordId) {
        let description = "";

        if (typeof getDescription === "function") {
          // Use custom description function if provided
          description = getDescription({ req, data });
        } else {
          // Default dynamic description based on module and action
          const actionText =
            {
              add: "added",
              update: "updated",
              delete: "deleted",
              approve: "approved",
              reject: "rejected",
            }[action] || action;

          description = `${req.user.name} ${actionText} ${module}`;
        }

        await saveHistory({
          module,
          action,
          performedBy: req.user._id,
          targetModule,
          targetId: data.newRecordId,
           oldValue: data.oldValue || null,
          newValue: data.newValue || data,
          description,
        });
      }

      return originalJson(data);
    };

    next();
  };
};
