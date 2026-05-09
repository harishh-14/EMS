
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js'
import employeeRouter from './routes/employee.js'
import leaveRouter from "./routes/leave.js"
import settingRouter from "./routes/setting.js"
import dashboardRouter from "./routes/dashboard.js"
import attendanceRouter from "./routes/attendance.js"
import holidayRouter from "./routes/holiday.js"
import taskRouter from "./routes/task.js"
import connectToDatabase from "./db/db.js"
import { decryptRequest, encryptResponse } from './middleware/encryptionMiddleware.js';

connectToDatabase();
const app = express();

app.use(cors())
app.use(express.json());
app.use(decryptRequest);


app.use(express.static('public/uploads'))
app.use("/api/auth" , authRouter)
app.use("/api/department" , departmentRouter)
app.use("/api/employee" , employeeRouter)
app.use("/api/leave" , leaveRouter)
app.use("/api/setting" , settingRouter)
app.use("/api/dashboard" , dashboardRouter)
app.use("/api/attendance" , attendanceRouter)
app.use("/api/task",taskRouter)
app.use("/api/holiday",holidayRouter)

// 🔽 After routes, apply encrypt for outgoing responses
app.use(encryptResponse);


app.listen(process.env.PORT , ()=>{
    console.log(`server is running on ${process.env.PORT}`)
})