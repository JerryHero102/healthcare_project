import { useState } from "react";
import axios from "axios";
// TIẾP TÂN
import DS_BN from "../Receptionist/DS_BN";
import Them_BN from "../Receptionist/Them_BN";
// BÁC SĨ
import Individual_Patient_Management from "../Doctor/Individual_Patient_Management"; //Quản lý bệnh nhân của bác sĩ
import Test_Result from "../Doctor/Test_Result"; //Phiếu xét nghiệm
import Work_Schedule from "../Doctor/Work_Schedule"; //Lịch làm việc của bác sĩ
// BÁC SĨ XÉT NGHIỆM/ CHỤP PHIM....
import Laboratory_Test_Report from "../DoctorOther/Laboratory_Test_Report"
import Test_Result_Form from "../DoctorOther/Test_Result_Form"
// HỆ THỐNG
import Appointment_List from "../System/Appointment_List"; //Danh sách cuộc hẹn
import Patient_List_Details from "../System/Patient_List_Details"; //Danh sách chi tiết thông tin bệnh nhân
// KẾ TOÁN
import Found_Management from "../Accounting/Fund_Management";
import SalaryManagement from "../Accounting/SalaryManagement";
//ĐĂNG NHẬP/ĐĂNG KÝ
import Login_E from "../Auth/Login_E"; 
import Register_E from "../Auth/Register_E"; 
import Profile_E from "../Auth/Profile_E";
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

                    {/* TIẾP TÂN */}
                    {context === "Thêm BN mới" && <Them_BN setContext={setContext} />}
                    {context === "Danh sách BN" && <DS_BN setContext={setContext} />}
                    
                    {/* BÁC SĨ */}
                    {context === "Quản lý BN cá nhân" && <Individual_Patient_Management setContext={setContext} />}
                    {context === "Quản lý phiếu" && <Test_Result setContext={setContext} />}
                    {context === "Quản lý kết quả xét nghiệm" && <div>Quản lý kết quả xét nghiệm</div>}
                    {context === "Quản lý lịch làm việc" && <Work_Schedule setContext={setContext} />}

                    {/* BÁC SĨ XÉT NGHIỆM/ CHỤP PHIM.... */}
                    {context === "Kết quả xét nghiệm" && <Laboratory_Test_Report setContext={setContext} />}
                    {context === "Nhận phiếu xét nghiệm" && <Test_Result_Form setContext={setContext} />}

                    {/* KẾ TOÁN */}
                    {context === "Quản lý Quỹ" && <Found_Management setContext={setContext} />}
                    {context === "Quản lý Lương" && <SalaryManagement setContext={setContext} />}
                    {context === "DT Khám & Chữa Bệnh" && <div>DT Khám & Chữa Bệnh</div>}
                    {context === "Chi Phí HĐ" && <div>Chi Phí HĐ</div>}
                    {context === "QL TT Bảo Hiểm" && <div>QL TT Bảo Hiểm</div>}

                    {/* HỆ THỐNG */}
                    {context === "Danh sách lịch hẹn BN" && <Appointment_List setContext={setContext} />}
                    {context === "Danh sách chi tiết BN" && <Patient_List_Details setContext={setContext} />}
                </main>
            </div>
        </div>
    );
};
export default DashBoard;