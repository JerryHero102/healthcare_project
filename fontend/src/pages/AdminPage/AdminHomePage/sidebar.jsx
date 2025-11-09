import React from 'react';

const TextTittle = ({children}) => (
    <h6 className="text-[12px] text-gray-800 bg-gray-300 w-full py-1.5 px-2 mt-5">{children}</h6>
);

// Sidebar component expects getNavClasses(navItem) and setContext(fn)
const Sidebar = ({ getNavClasses, setContext }) => {
    return (
        <aside className="h-screen overflow-y-auto w-[200px] bg-white text-white flex flex-col items-start box-border shadow">
            <div className="bg-[#EDFFFA] text-[#FFC419] text-[22px] font-bold mb-5 px-3 py-1.5 rounded-md w-full text-center">HealthCare</div>

            {/* DÀNH CHO TIẾP TÂN */}
            <div className="w-full">
                <TextTittle>Quản lý Bệnh Nhân</TextTittle>
                <div className={getNavClasses("Thêm BN mới")} onClick={() => setContext("Thêm BN mới")}>Thêm BN mới</div>
                <div className={getNavClasses("Danh sách BN đã khám bệnh")} onClick={() => setContext("Danh sách BN đã khám bệnh")}>Danh sách BN</div>
                <div className={getNavClasses("Danh sách BN chưa khám bệnh")} onClick={() => setContext("Danh sách BN chưa khám bệnh")}>Danh sách BN chưa khám bệnh</div>
            </div>

            {/* DÀNH CHO QUẢN LÝ NHÂN VIÊN */}
            <div className="w-full">
                <TextTittle>QL Nhân viên</TextTittle>
                <div className={getNavClasses("Quản lý Bác sĩ")} onClick={() => setContext("Quản lý Bác sĩ")}>Quản lý Bác sĩ</div>
                <div className={getNavClasses("Quản lý Y tá")} onClick={() => setContext("Quản lý Y tá")}>Quản lý Y tá</div>
                <div className={getNavClasses("Quản lý KTV Y tế")} onClick={() => setContext("Quản lý KTV Y tế")}>Quản lý KTV Y tế</div>
            </div>

            {/* DÀNH CHO QUẢN LÝ PHÒNG KHÁM*/}
            <div className="w-full">
                <TextTittle>QL Phòng khám</TextTittle>
                <div className={getNavClasses("Quản lý Phòng khám")} onClick={() => setContext("Quản lý Phòng khám")}>Quản lý Phòng khám</div>
                <div className={getNavClasses("Quản lý Hệ thống PK")} onClick={() => setContext("Quản lý Hệ thống PK")}>Quản lý Hệ thống PK</div>
            </div>

            {/* DÀNH CHO KẾ TOÁN */}
            <div className="w-full">
                <TextTittle>QL Doanh thu</TextTittle>
                <div className={getNavClasses("DT Khám & Chữa Bệnh")} onClick={() => setContext("DT Khám & Chữa Bệnh")}>DT Khám & Chữa Bệnh</div>
                <div className={getNavClasses("Chi Phí HĐ")} onClick={() => setContext("Chi Phí HĐ")}>Chi Phí HĐ</div>
                <div className={getNavClasses("QL TT Bảo Hiểm")} onClick={() => setContext("QL TT Bảo Hiểm")}>QL TT Bảo Hiểm</div>
                <div className={getNavClasses("TT Công nợ & Lương")} onClick={() => setContext("TT Công nợ & Lương")}>TT Công nợ & Lương</div>
                <div className={getNavClasses("QL Quỹ")} onClick={() => setContext("QL Quỹ")}>QL Quỹ</div>
            </div>
        </aside>
    );
};

export default Sidebar;
