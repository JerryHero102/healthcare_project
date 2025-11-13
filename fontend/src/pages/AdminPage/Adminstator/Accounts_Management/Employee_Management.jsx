import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Employee_Management() {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {axios
    .get("http://localhost:5001/api/employee/employee-list") // thêm full URL nếu frontend và backend khác port
    .then((res) => setEmployees(Array.isArray(res.data.data) ? res.data.data : []))
    .catch(() => console.error("Không thể tải danh sách nhân viên"));
    }, []); // dependency array rỗng = chỉ chạy 1 lần khi mount

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Danh sách nhân viên</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Mã NV</th>
            <th className="border px-4 py-2">Tên đầy đủ</th>
            <th className="border px-4 py-2">Phòng ban</th>
            <th className="border px-4 py-2">Chức vụ</th>
            <th className="border px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
        {employees && employees.length > 0 ? (
            employees.map((e) => (
            <tr key={e.infor_auth_employee_id || e.infor_employee_id}>
                <td className="border px-4 py-2">{e.infor_employee_id}</td>
                <td className="border px-4 py-2">{e.full_name}</td>
                <td className="border px-4 py-2">{e.department_name}</td>
                <td className="border px-4 py-2">{e.position_name}</td>
                <td className="border px-4 py-2">{e.status_employee}</td>
            </tr>

            ))
        ) : (
            <tr>
            <td colSpan="5" className="text-center py-4">
                Không có dữ liệu nhân viên
            </td>
            </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}
