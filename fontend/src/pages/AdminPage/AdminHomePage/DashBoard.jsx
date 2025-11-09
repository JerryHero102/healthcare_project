import { useState } from "react";
import axios from "axios";
import DS_BN_ChuaKham from "../QLBenhNhan/DS_BN_ChuaKham";
import DS_BN from "../QLBenhNhan/DS_BN";
import Them_BN from "../QLBenhNhan/Them_BN";
import DS_BS from "../QL_NhanVien/DS_BS";
import DS_YTa from "../QL_NhanVien/DS_YTa";
import PhongKham from "../QL_HeThong/PhongKham";
import HeThong from "../QL_HeThong/HeThong";
import DS_KTV from "../QL_NhanVien/DS_KTV";
import QL_Quy from "../QL_DoanhThu/QL_Quy";
//ĐĂNG NHẬP/ĐĂNG KÝ
import Login_E from "../auth/Login_E"; 
import Register_E from "../auth/Register_E"; 
import Profile_E from "../auth/Profile_E";
import Sidebar from './sidebar';
import UserInfoToolbar from './toolbar';

    const renderAuthScreen = (props) => (
        <div className="flex items-center justify-center h-screen bg-[#f5f5f5]">
            {/*HIỂN THỊ COMPONENT ĐĂNG NHẬP HOẶC ĐĂNG KÝ */}
            {props.context === "Đăng nhập" && <Login_E setContext={props.setContext} />}
            {props.context === "Đăng ký" && <Register_E setContext={props.setContext} />}
        </div>
    );

const DashBoard = () => {
    //Mặc định
    const [context, setContext] = useState("Thông tin Nhân Viên");
    const getNavClasses = (navItem) => {
        // Classes mặc định
        const defaultClasses = "text-[12px] text-black my-1 cursor-pointer px-3 py-2 rounded transition w-full truncate hover:bg-[#FFC419]";
        const activeClasses = "bg-[#FFC419] font-bold text-black"; 
    
            if (context === navItem) {
            return `${defaultClasses} ${activeClasses}`;
        }
            return defaultClasses;
    };

    //ĐỐI TƯỢNG CHỨA CÁC PROPS CẦN
    const dashboardProps = { context, setContext, getNavClasses };

    return (
        <div className="flex h-screen">
            <Sidebar getNavClasses={getNavClasses} setContext={setContext} />

            <div className="flex flex-col flex-1 h-screen">
                <UserInfoToolbar
                    userName="Nguyễn Thị Bích"
                    role="Tiếp Tân (Receptionist)"
                    onClick={() => setContext("Thông tin Nhân Viên")}
                />

                <main className="flex-1 bg-[#f5f5f5] overflow-y-auto">
                    {/* PROFILE EMPLOYEE */}
                    {context === "Thông tin Nhân Viên" && <Profile_E setContext={setContext} />}

                    {/*Bệnh Nhân */}
                    {context === "Thêm BN mới" && <Them_BN setContext={setContext} />}
                    {/*DS bệnh nhân chưa khám */}
                    {context === "Danh sách BN chưa khám bệnh" && <DS_BN_ChuaKham setContext={setContext} />}
                    {/*DS bệnh nhân đã khám */}
                    {context === "Danh sách BN đã khám bệnh" && <DS_BN setContext={setContext} />}
                    
                    {/*QL Bác sĩ */}
                    {context === "Quản lý Bác sĩ" && <DS_BS setContext={setContext} />}
                    {/*QL Y Tá */}
                    {context === "Quản lý Y tá" && <DS_YTa setContext={setContext} />}
                    {/*QL KTV Y tế */}
                    {context === "Quản lý KTV Y tế" && <DS_KTV setContext={setContext} />}

                    {/*QL Phòng Khám */}
                    {context === "Quản lý Phòng khám" && <PhongKham setContext={setContext} />}
                    {/*QL Hệ Thống*/}
                    {context === "Quản lý Hệ thống PK" && <HeThong setContext={setContext} />}

                    {/* QL DOANH THU */}
                    {context === "DT Khám & Chữa Bệnh" && <div>DT Khám & Chữa Bệnh</div>}
                    {context === "Chi Phí HĐ" && <div>Chi Phí HĐ</div>}
                    {context === "QL TT Bảo Hiểm" && <div>QL TT Bảo Hiểm</div>}
                    {context === "TT Công nợ & Lương" && <div>TT Công nợ & Lương</div>}
                    {context === "QL Quỹ" && <QL_Quy setContext={setContext} />}
                </main>
            </div>
        </div>
    );
};
export default DashBoard;