import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, customStyles, DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";
import { DEPARTMENT } from "../../constants/appConstants";
import { apiService } from "../../services/apiService";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const fetchDepartments = async () => {
    setDepLoading(true);
    try {
      const res = await apiService.get(DEPARTMENT.GET_ALL);

      if (res.success) {
        let sno = 1;
        const data = res.departments.map((dep) => ({
          _id: dep._id,
          sno: sno++,
          dep_name: dep.dep_name,
          action: (
            <DepartmentButtons
              _id={dep._id}
              onDepartmentDelete={onDepartmentDelete}
            />
          ),
        }));
        setDepartments(data);
        setFilteredDepartments(data);
      }
    } catch (error) {
      if (!error.success) {
        alert(error.message || error.error);
      }
    } finally {
      setDepLoading(false);
    }
  };

  const onDepartmentDelete = async (id) => {
    const data = departments.filter((dep) => dep._id !== id);
    setDepartments(data);
    fetchDepartments();
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filterDepartment = (e) => {
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredDepartments(records);
  };

  return (
    <>
      {depLoading ? (
        <div>Loading....</div>
      ) : (
        <div className="p-6 bg-white shadow rounded-lg">
          <div className="mb-4 text-center">
            <h3 className="text-2xl font-bold text-gray-800">
              Manage Departments
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <input
              type="text"
              onChange={filterDepartment}
              placeholder="Search dept by name"
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <Link
              to="/admin-dashboard/add-department"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200 text-center"
            >
              Add New Department
            </Link>
          </div>
          <div>
            <DataTable
              columns={columns}
              data={filteredDepartments}
              customStyles={customStyles}
              pagination
            />
          </div>
        </div>
      )}
    </>
  );
}

export default DepartmentList;
