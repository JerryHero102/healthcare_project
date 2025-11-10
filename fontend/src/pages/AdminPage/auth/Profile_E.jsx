import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile_E = ({ employeeData }) => {
  const [data, setData] = useState(employeeData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Nếu đã có prop employeeData thì không cần gọi API
      if (employeeData) return;

      const employeeId = localStorage.getItem('employeeId');
      if (!employeeId) {
        setError('Thiếu thông tin đăng nhập. Vui lòng đăng nhập lại.');
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5001/api/employee/${encodeURIComponent(employeeId)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (res.data?.ok) {
          const emp = res.data.data;

          // Map dữ liệu backend -> dữ liệu hiển thị
          setData({
            hoTen: emp.full_name || '',
            ngaySinh: emp.date_of_birth || '',
            gioiTinh: emp.gender || '-', // Nếu chưa có cột gender trong DB thì để trống
            sdt: emp.phone_number || '',
            email: emp.email || '',
            diaChi: emp.current_address || emp.permanent_address || '',
            chucVu: emp.position || '',
            maNV: emp.employee_id || employeeId,
            ngayVaoLam: emp.started_date || '',
            phongBan: emp.department || '',
            luongCoBan: emp.salary ? emp.salary.toLocaleString('vi-VN') + ' VND' : '',
            tinhTrang: emp.status_employee === 'active'
              ? 'Đang hoạt động'
              : emp.status_employee === 'on_leave'
              ? 'Đang nghỉ phép'
              : 'Ngừng làm việc'
          });
        } else {
          setError(res.data?.message || 'Không lấy được dữ liệu nhân viên.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi kết nối đến máy chủ.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeData]);

  // Dữ liệu mặc định hiển thị nếu không có dữ liệu API
  const defaultData = {
    hoTen: 'Nguyễn Thị Bích',
    ngaySinh: '01/01/1990',
    gioiTinh: 'Nữ',
    sdt: '0123456789',
    email: 'bich.nt@healthcare.vn',
    diaChi: '123 Đường A, Quận B, TP HCM',
    chucVu: 'Tiếp Tân (Receptionist)',
    maNV: 'NV001',
    ngayVaoLam: '15/10/2022',
    phongBan: 'Lễ Tân',
    luongCoBan: '12,000,000 VND',
    tinhTrang: 'Đang hoạt động'
  };

  const display = data || defaultData;

  // Component hiển thị từng dòng
  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <p className="font-medium text-gray-600">{label}:</p>
      <p className="text-right font-semibold text-gray-800">{value || '-'}</p>
    </div>
  );

  // ----------
  // UI
  // ----------
  return (
    <div className="p-8 bg-[#f5f5f5] h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân & công việc</h1>

      {loading ? (
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex gap-8">
          {/* THÔNG TIN CÁ NHÂN */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-700">Thông tin Cá nhân</h3>
            <div className="flex flex-col space-y-1">
              <DetailRow label="Họ và tên" value={display.hoTen} />
              <DetailRow label="Ngày sinh" value={display.ngaySinh} />
              <DetailRow label="Giới tính" value={display.gioiTinh} />
              <DetailRow label="Số điện thoại" value={display.sdt} />
              <DetailRow label="Email" value={display.email} />
              <DetailRow label="Địa chỉ" value={display.diaChi} />
            </div>
          </div>

          {/* THÔNG TIN NHÂN VIÊN */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 border-b pb-2 text-green-700">Thông tin Nhân viên</h3>
            <div className="flex flex-col space-y-1">
              <DetailRow label="Mã Nhân viên" value={display.maNV} />
              <DetailRow label="Phòng ban" value={display.phongBan} />
              <DetailRow label="Chức vụ" value={display.chucVu} />
              <DetailRow label="Ngày vào làm" value={display.ngayVaoLam} />
              <DetailRow label="Lương cơ bản" value={display.luongCoBan} />
              <DetailRow label="Tình trạng HĐ" value={display.tinhTrang} />
            </div>

            {/* Nút hành động */}
            <div className="mt-8 flex justify-end gap-3">
              <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Chỉnh Sửa</button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => {
                  if (!window.confirm('Bạn có chắc muốn đăng xuất?')) return;
                  try {
                    localStorage.removeItem('token');
                    localStorage.removeItem('employeeId');
                  } catch (e) {}
                  setData(null);
                  navigate('/Admin/auth/Login', { replace: true });
                }}
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile_E;
