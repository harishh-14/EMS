import dayjs from "dayjs";

export const isWeekend = (date) => {
  // Ensure it's a JS Date object
  const jsDate = dayjs(date).toDate();
  const day = jsDate.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6;
};