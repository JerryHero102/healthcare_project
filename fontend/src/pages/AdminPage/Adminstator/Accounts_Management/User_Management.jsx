import React, { useEffect, useState } from "react";
import axios from "axios";

export default function User_Management() {
  const [customers, setCustomers] = useState([]);
  useEffect(() => {axios
    .get("http://localhost:5001/api/users/users")
    .then((res) => setCustomers(Array.isArray(res.data.data) ? res.data.data : []))
    .catch(() => console.error("Không thể tải danh sách Khách hàng"));
    }, []); // dependency array rỗng = chỉ chạy 1 lần khi mount

  // // Xem chi tiết khách hàng
  // const handleView = async (user_id) => {
  //   try {
  //     const res = await axios.get(`/api/users/users/get-id/${user_id}`);
  //     alert(
  //       `Thông tin khách hàng:\nHọ và tên: ${res.data.data.full_name}\nSĐT: ${res.data.data.phone_number}\nĐịa chỉ: ${res.data.data.current_address}`
  //     );
  //   } catch (err) {
  //     console.error("Lỗi khi xem chi tiết khách hàng", err);
  //   }
  // };

  // // Xóa khách hàng
  // const handleDelete = async (user_id) => {
  //   if (!window.confirm("Bạn có chắc muốn xóa khách hàng này không?")) return;

  //   try {
  //     await axios.delete(`/api/users/users/delete/${user_id}`);
  //     setCustomers(customers.filter((c) => c.infor_users_id !== user_id));
  //     alert("Xóa khách hàng thành công!");
  //   } catch (err) {
  //     console.error("Lỗi khi xóa khách hàng", err);
  //   }
  // };

  // if (loading) return <p>Đang tải danh sách khách hàng...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Danh sách khách hàng</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="text-left bg-gray-50">
            <th className="px-4 py-2">Mã KH</th>
            <th className="px-4 py-2">Họ và Tên</th>
            <th className="px-4 py-2">Số điện thoại</th>
            <th className="px-4 py-2">Ngày tạo</th>
            <th className="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
        {!Array.isArray(customers) || customers.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-4">
              Không có khách hàng nào
            </td>
          </tr>
        ) : (
          customers.map((row) => (
            <tr key={row.infor_users_id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{row.infor_users_id}</td>
              <td className="px-4 py-2">{row.full_name || "-"}</td>
              <td className="px-4 py-2">{row.phone_number || "-"}</td>
              <td className="px-4 py-2">{row.created_at || "-"}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(row.infor_users_id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Xem
                  </button>
                  <button
                    onClick={() => alert("Tính năng sửa chưa triển khai")}
                    className="px-2 py-1 bg-yellow-400 text-black rounded text-sm"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(row.infor_users_id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
      </table>
    </div>
  );
}
