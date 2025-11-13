import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
// import {Toaster} from "sonner";
// USER PAGES
import Header from './pages/UserPage/Home/Header';
import Body from './pages/UserPage/Home/Body';
import Footer from './pages/UserPage/Home/Footer';
import Home from './pages/UserPage/Home/Home.jsx';
import Profile_u from './pages/UserPage/auth/Profile_U.jsx';
import HomePage from './pages/UserPage/HomePage.jsx';
import HeaderUser from './pages/UserPage/HeaderUser.jsx';
import ChuyenKhoa from './pages/UserPage/ChuyenKhoa/ChuyenKhoa';
import ChuyenGia from './pages/UserPage/ChuyenGia/ChuyenGia';
import DichVu from './pages/UserPage/DichVu/DichVu';
import DatLichHen from './pages/UserPage/DatLichHen/DatLichHen';
import NoiKhoa from './pages/UserPage/ChuyenKhoa/NoiKhoa/NoiKhoa';
import TaiMuiHong from './pages/UserPage/ChuyenKhoa/TaiMuiHong/TaiMuiHong';
import MaySieuAm5D from './pages/UserPage/ThietBi/MaySieuAm5D';
import MayXetNghiemSinhHoa from './pages/UserPage/ThietBi/MayXetNghiemSinhHoa';
import MayNoiSoiTaiMuiHong from './pages/UserPage/ThietBi/MayNoiSoiTaiMuiHong';
import HeThongXQuangKyThuatSo from './pages/UserPage/ThietBi/HeThongXQuangKyThuatSo';
import XetNghiemSinhHoa from './pages/UserPage/ChuyenKhoa/XetNghiemSinhHoa/XetNghiemSinhHoa';
import ChanDoanHinhAnh from './pages/UserPage/ChuyenKhoa/ChanDoanHinhAnh/ChanDoanHinhAnh';
import ChamSocTaiNha from './pages/UserPage/DichVu/ChamSocTaiNha/ChamSocTaiNha';
import KhamTongQuat from './pages/UserPage/DichVu/KhamTongQuat/KhamTongQuat';
import TuVanDinhDuong from './pages/UserPage/DichVu/TuVanDinhDuong/TuVanDinhDuong';
import XetNghiemTaiNha from './pages/UserPage/DichVu/XetNghiem/XetNghiemTaiNha';
import PhucHoiChucNang from './pages/UserPage/DichVu/PhucHoiChucNang/PhucHoiChucNang';
import KhamBenhTrucTuyen from './pages/UserPage/DichVu/KhamBenhTrucTuyen/KhamBenhTrucTuyen';
// LOGIN PAGE
import Login from './pages/Login/login.jsx';
// USER LOGIN PAGE
import Login_U from './pages/UserPage/auth/Login_U';
// ADMIN PAGES
import DashBoard from './pages/AdminPage/AdminHomePage/DashBoard';
import Login_E from './pages/AdminPage/Auth/Login_E';
import Register_E from './pages/AdminPage/Auth/Register_E';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateProfile_E from './pages/AdminPage/Auth/UpdateProfile_E';
// NOT FOUND PAGE 
import NotFound from './pages/NotFound.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Trang hiển thị mặc định */}
          <Route path="/" element={<><Home /></>} />
          {/* Trang Đặt Lịch Hẹn */}
        <Route path="/User/HomePage/dat-lich-hen" element={<DatLichHen />} />

        {/* Trang Chuyên Khoa */}
        <Route path="/User/HomePage/chuyen-khoa" element={<ChuyenKhoa />} />

        {/* Trang Chuyên Gia */}
        <Route path="/User/HomePage/chuyen-gia" element={<ChuyenGia />} />

        {/* Trang Dịch Vụ */}
        <Route path="/User/HomePage/dich-vu" element={<DichVu />} />
        {/* Trang nội khoa */}
        <Route path="/User/HomePage/noi-khoa" element={<NoiKhoa />} />
        {/* Trang tai mũi hng */}
        <Route path="/User/HomePage/tai-mui-hong" element={<TaiMuiHong />} />
        {/* Trang chẩn đoán hình ảnh */}
        <Route path="/User/HomePage/chan-doan-hinh-anh" element={<ChanDoanHinhAnh />} />
        {/* Trang xét nghiệm sinh hóa */}
        <Route path="/User/HomePage/xet-nghiem-sinh-hoa" element={<XetNghiemSinhHoa />} />
ọ
        {/* Trang máy siêu âm */}
        <Route path="/User/HomePage/may-sieu-am-5d" element={<MaySieuAm5D />} />
        {/* Trang máy xét nghiệm sinh hóa */}
        <Route path="/User/HomePage/may-xet-nghiem-sinh-hoa" element={<MayXetNghiemSinhHoa />} />
        {/* Trang máy nội soi tai mũi họng */}
        <Route path="/User/HomePage/may-noi-soi-tai-mui-hong" element={<MayNoiSoiTaiMuiHong />} />
        {/* Trang hệ thống X-quang kỹ thuật số */}
        <Route path="/User/HomePage/he-thong-xquang-ky-thuat-so" element={<HeThongXQuangKyThuatSo />} />

        {/* Các trang dịch vụ */}
        <Route path="/User/HomePage/cham-soc-tai-nha" element={<ChamSocTaiNha />} />
        <Route path="/User/HomePage/kham-suc-khoe-tong-quat" element={<KhamTongQuat />} />
        <Route path="/User/HomePage/tu-van-dinh-duong" element={<TuVanDinhDuong />} />
        <Route path="/User/HomePage/xet-nghiem-tai-nha" element={<XetNghiemTaiNha />} />
        <Route path="/User/HomePage/phuc-hoi-chuc-nang" element={<PhucHoiChucNang />} />
        <Route path="/User/HomePage/kham-benh-truc-tuyen" element={<KhamBenhTrucTuyen />} />
        {/*Trang Home riêng */}
        <Route path="/User/HomePage" element={<HomePage />} />
        {/*Trang thông tin cá nhân */}
        <Route path="/User/HomePage/Profile_u" element={<><HeaderUser /><Profile_u/></>} />
        {/*Trang Login riêng */}
        <Route path='fontend/Login' element={<Login/>}/>
        

        {/*Trang Login cho User */}
        <Route path='/User/Login' element={<Login_U/>}/>

        {/*Trang Admin riêng */}
        <Route path="/Admin" element={<Navigate to="/Admin/Dashboard" replace />} />
        <Route path='/Admin/auth/Login' element={<Login_E/>}/>  
        <Route path='/Admin/auth/register' element={<Register_E/>}/>
        <Route path='/Admin/auth/update' element={<UpdateProfile_E/>}/>
        <Route path='/Admin/Dashboard' element={<ProtectedRoute><DashBoard /></ProtectedRoute>} /> 

        {/* NOT FOUND 404 */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* <Toaster position="top-right" richColors /> */}
    </>
  )
}

export default App
