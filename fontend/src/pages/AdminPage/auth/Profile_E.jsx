import React, { useEffect, useState } from 'react';
import Login_E from "./Login_E";
import axios from "axios";

const Profile_E = ({ employeeData }) => {
    const [data, setData] = useState(employeeData || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchData = async () => {
        // nếu đã có prop employeeData thì không cần fetch
        if (employeeData) return;
        const employeeId = localStorage.getItem('employeeId');
        if (!employeeId) {
          setError('Missing employeeId. Please login first.');
          return;
        }
        setLoading(true);
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:5001/api/employee/${encodeURIComponent(employeeId)}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          if (res.data?.ok) setData({
            hoTen: res.data.data.full_name || '',
            ngaySinh: res.data.data.date_of_birth || '',
            gioiTinh: res.data.data.gender || '',
            sdt: res.data.data.contact_phone || res.data.data.auth_phone || '',
            email: res.data.data.email || '',
            diaChi: res.data.data.current_address || res.data.data.permanent_address || '',
            chucVu: res.data.data.position || '',
            maNV: res.data.data.employee_id || employeeId,
            ngayVaoLam: res.data.data.hire_date || '',
            phongBan: res.data.data.department || '',
            luongCoBan: res.data.data.base_salary || ''
          });
          else setError(res.data?.message || 'Không lấy được dữ liệu');
        } catch (err) {
          setError(err.response?.data?.message || err.message || 'Lỗi khi gọi API');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [employeeData]);

    const defaultData = {
        hoTen: "Nguyễn Thị Bích",
        ngaySinh: "01/01/1990",
        gioiTinh: "Nữ",
        sdt: "0123456789",
        email: "bich.nt@healthcare.vn",
        diaChi: "123 Đường A, Quận B, TP HCM",
        chucVu: "Tiếp Tân (Receptionist)",
        maNV: "NV001",
        ngayVaoLam: "15/10/2022",
        phongBan: "Lễ Tân",
        luongCoBan: "12,000,000 VND"
    };
    const display = data || defaultData;
    
    // Component hiển thị một dòng Tiêu đề | Dữ liệu
    const DetailRow = ({ label, value }) => (
        <div className="flex justify-between py-2 border-b border-gray-100">
            <p className="font-medium text-gray-600">{label}:</p>
            <p className="text-right font-semibold text-gray-800">{value || '-'}</p>
        </div>
    );
    
    // ----------
    // UI
    // ----------//
    return (
        <div className="p-8 bg-[#f5f5f5] h-full overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6">Thông tin cá nhân & công việc</h1>
            
            {/* CONTAINER CHÍNH: CHIA THÀNH 2 CỘT LỚN (flex-1 để tận dụng không gian) */}
            <div className="flex gap-8"> 
                
                {/* 1. CỘT LỚN THỨ NHẤT: THÔNG TIN CÁ NHÂN (Chiếm nửa không gian) */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 text-blue-700">Thông tin Cá nhân</h3>
                    
                    {/* CONTAINER DỮ LIỆU CÁ NHÂN: Xếp chồng các dòng */}
                    <div className="flex flex-col space-y-1">
                        <DetailRow label="Họ và tên" value={display.hoTen} />
                        <DetailRow label="Ngày sinh" value={display.ngaySinh} />
                        <DetailRow label="Giới tính" value={display.gioiTinh} />
                        <DetailRow label="Số điện thoại" value={display.sdt} />
                        <DetailRow label="Email" value={display.email} />
                        <DetailRow label="Địa chỉ" value={display.diaChi} />
                    </div>
                </div>

                {/* 2. CỘT LỚN THỨ HAI: THÔNG TIN NHÂN VIÊN (Chiếm nửa không gian) */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2 text-green-700">Thông tin Nhân viên</h3>
                    
                    {/* CONTAINER DỮ LIỆU NHÂN VIÊN: Xếp chồng các dòng */}
                    <div className="flex flex-col space-y-1">
                        <DetailRow label="Mã Nhân viên" value={display.maNV} />
                        <DetailRow label="Phòng ban" value={display.phongBan} />
                        <DetailRow label="Chức vụ" value={display.chucVu} />
                        <DetailRow label="Ngày vào làm" value={display.ngayVaoLam} />
                        <DetailRow label="Lương cơ bản" value={display.luongCoBan} />
                        <DetailRow label="Tình trạng HĐ" value="Đang hoạt động" />
                    </div>
                    
                    {/* Nút Chỉnh sửa / Đăng xuất */}
                    <div className="mt-8 flex justify-end gap-3">
                        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Chỉnh Sửa</button>
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Đăng Xuất</button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile_E;