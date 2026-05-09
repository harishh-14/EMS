import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columns, EmployeeButtons , customStyles} from "../../utils/EmployeeHelper";
import DataTable from 'react-data-table-component';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiService } from "../../services/apiService";
import { EMPLOYEE } from "../../constants/appConstants";

function List() {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee , setFilteredEmployee] = useState([])

  const fetchEmployees = async () => {
    setEmpLoading(true);
    try {
      const res = await apiService.get(EMPLOYEE.GET_ALL);

      if (res.success) {
        let sno = 1;
        const data = res.employees.map((emp) => ({
          _id: emp._id,
          sno: sno++,
          dep_name: emp.department.dep_name,
          name: emp.userId.name,
          doj: new Date(emp.doj).toLocaleDateString(),
          profileImage: <img width={40} className="rounded-full" src={`http://localhost:8000/${emp.userId.profileImage}`} />,
          action: (<EmployeeButtons _id={emp._id}/>),
        }));
        setEmployees(data);
        setFilteredEmployee(data)
      }
    } catch (error) {
      if (!error?.success) {
        alert(error.message || error.error);
      }
    } finally {
      setEmpLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
      const value = e.target.value.toLowerCase();
    const records = employees.filter((emp) => (
      emp.name.toLowerCase().includes(value) || 
      emp.dep_name.toLowerCase().includes(value) 
    ))
    setFilteredEmployee(records)
  }

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <ToastContainer />
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-bold text-gray-800">Manage Emplyees</h3>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <input
          type="text"
          placeholder="Search dept by name"
          onChange={handleFilter}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Link
          to="/admin-dashboard/add-employee"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200 text-center"
        >
          Add New Employee
        </Link>
      </div>
      <div>
        <DataTable columns={columns} data={filteredEmployee} pagination customStyles={customStyles}/>
      </div>
    </div>
  );
}

export default List;
