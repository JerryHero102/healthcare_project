import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Đã import Axios
import { useNavigate } from 'react-router-dom';

const Profile_E = ({ employeeData }) => {
    const [data, setData] = useState(employeeData || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5001';

    useEffect(() => {
      const fetchData = async () => {
        if (employeeData) return;

        const token = localStorage.getItem('token'); // token phải có
        if (!token) {
          setError('Vui lòng đăng nhập lại.');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        setLoading(true);
        try {
          const res = await axios.get(`${API_BASE}/api/employee/infor/profile`, config);

          if (!res.data?.ok) {
            setError(res.data.message || 'Không lấy được dữ liệu');
            return;
          }

          const emp = res.data.data;

          setData({
            hoTen: emp.full_name,
            ngaySinh: emp.date_of_birth,
            gioiTinh: emp.gender,
            sdt: emp.phone_number,
            email: emp.email,
            diaChi: emp.current_address || emp.permanent_address,
            chucVu: emp.position_name,
            maNV: emp.employee_id,
            ngayVaoLam: emp.started_date,
            phongBan: emp.department_name,
            luongCoBan: emp.salary?.toLocaleString('vi-VN') + ' VND',
            tinhTrang: emp.status_employee === 'active'
              ? 'Đang hoạt động'
              : emp.status_employee === 'on_leave'
              ? 'Đang nghỉ phép'
              : 'Ngừng làm việc'
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Lỗi server');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [employeeData]);

    const display = data || {};

    const handleEdit = async () => {
        const token = localStorage.getItem('token');
        const authId = localStorage.getItem('auth_id');

        const newName = window.prompt('Họ và tên', display.hoTen || '');
        if (newName === null) return;

        const newPhone = window.prompt('Số điện thoại', display.sdt || '');
        if (newPhone === null) return;

        if (!/^\d{10}$/.test(newPhone)) {
            setError('Số điện thoại phải 10 chữ số');
            return;
        }

        try {
            setLoading(true);

            const res = await axios.put(
                `${API_BASE}/api/employee/infor/${authId}`,
                { full_name: newName, phone_number: newPhone },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!res.data?.ok) {
                setError(res.data.message || 'Cập nhật thất bại');
                return;
            }

            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi server');
        } finally {
            setLoading(false);
        }
    };

    const DetailRow = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-100">
            <p className="font-medium text-gray-600">{label}:</p>
            <p className="text-right font-semibold text-gray-800">{value || '-'}</p>
        </div>
    );

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

                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                type="button"
                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                onClick={handleEdit}
                            >
                                Chỉnh Sửa
                            </button>
                            <button
                                type="button"
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                onClick={() => {
                                    if (!window.confirm('Bạn có chắc muốn đăng xuất?')) return;
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('employeeId');
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