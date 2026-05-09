import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoute from "./utils/PrivateRoute";
import RoleBaseRoute from "./utils/RoleBaseRoute";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/departments/DepartmentList";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import Summary from "./components/EmployeeDashboard/Summary";
import LeaveList from "./components/Leave/LeaveList";
import AddLeave from "./components/Leave/AddLeave";
import Setting from "./components/EmployeeDashboard/Setting";
import Table from "./components/Leave/Table";
import DetailLeave from "./components/Leave/DetailLeave";
import Attendance from "./components/attendance/Attendance";
import AttendanceReport from "./components/attendance/AttendanceReport";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AttendanceAdminSection from "./components/dashboard/AttendanceAdminSection";
import TaskReport from "./components/task/TaskReport";
import TaskReportOfAll from "./components/task/TaskReportOfAll";
import Holiday from "./components/holidays/Holiday";
import AddHoliday from "./components/holidays/AddHoliday";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin-dashboard" />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute>
                <RoleBaseRoute requiredRole={["admin"]}>
                  <AdminDashboard />
                </RoleBaseRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<AdminSummary />}></Route>
            <Route
              path="/admin-dashboard/departments"
              element={<DepartmentList />}
            ></Route>
            <Route
              path="/admin-dashboard/add-department"
              element={<AddDepartment />}
            ></Route>
            <Route
              path="/admin-dashboard/departments/:id"
              element={<EditDepartment />}
            ></Route>
            <Route path="/admin-dashboard/employees" element={<List />}></Route>
            <Route
              path="/admin-dashboard/add-employee"
              element={<Add />}
            ></Route>
            <Route
              path="/admin-dashboard/employees/:id"
              element={<View />}
            ></Route>
            <Route
              path="/admin-dashboard/employees/edit/:id"
              element={<Edit />}
            ></Route>
            <Route path="/admin-dashboard/leaves" element={<Table />}></Route>
            <Route
              path="/admin-dashboard/leaves/:id"
              element={<DetailLeave />}
            ></Route>
            <Route path="/admin-dashboard/attendances" element={<AttendanceAdminSection />}></Route>
            <Route path="/admin-dashboard/tasks" element={<TaskReportOfAll />}></Route>
            <Route
              path="/admin-dashboard/employees/leaves/:id"
              element={<LeaveList />}
            ></Route>
             <Route
              path="/admin-dashboard/holidays"
              element={<Holiday />}
            ></Route>
             <Route
              path="/admin-dashboard/add-holiday"
              element={<AddHoliday />}
            ></Route>
            <Route
              path="/admin-dashboard/setting"
              element={<Setting />}
            ></Route>
          </Route>
          <Route
            path="/employee-dashboard"
            element={
              <PrivateRoute>
                <RoleBaseRoute requiredRole={["admin", "employee"]}>
                  <EmployeeDashboard />
                </RoleBaseRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<Summary />}></Route>
            <Route
              path="/employee-dashboard/profile/:id"
              element={<View />}
            ></Route>
            <Route
              path="/employee-dashboard/leaves/:id"
              element={<LeaveList />}
            ></Route>
            <Route
              path="/employee-dashboard/add-leave"
              element={<AddLeave />}
            ></Route>
            <Route
              path="/employee-dashboard/setting"
              element={<Setting />}
            ></Route>
            <Route
              path="/employee-dashboard/attendance-report"
              element={<AttendanceReport />}
            ></Route>
              <Route
              path="/employee-dashboard/task-report"
              element={<TaskReport />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
