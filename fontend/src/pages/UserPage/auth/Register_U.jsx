import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import Input from '@/components/ui/input.jsx';
import Label from '@/components/ui/label.jsx';
import Button from '@/components/ui/button.jsx';
import { User, Mail, Phone, Calendar, MapPin, Lock, CreditCard, Home, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const Register_U = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    phone_number: "",
    card_id: "",
    email: "",
    permanent_address: "",
    current_address: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Vui lòng nhập họ và tên";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Vui lòng chọn ngày sinh";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        phone_number: formData.phone_number,
        password: formData.password,
        card_id: formData.card_id,
        full_name: formData.full_name,
        date_of_birth: formData.date_of_birth,
        email: formData.email,
        permanent_address: formData.permanent_address,
        current_address: formData.current_address,
      };

      const res = await axios.post(
        "http://localhost:5001/api/users/auth/register",
        payload
      );

      if (res.data?.ok) {

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem('phone_number', res.data.user.phone_number);
        }

        setMessage("✅ Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => {
          navigate("/User/Login");
        }, 1500);
      } else {
        setMessage(res.data?.message || "❌ Đăng ký thất bại!");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setMessage(err.response?.data?.message || "❌ Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3FFF8] via-[#EDFFFA] to-[#F0F9FF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        {/* Nút Trở lại */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#2C3E50] hover:text-[#FFC419] transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Trở về trang chủ</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">Đăng ký tài khoản</h1>
          <p className="text-gray-600">Tạo tài khoản để sử dụng dịch vụ chăm sóc sức khỏe</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Thông tin cơ bản */}
            <div>
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#FFC419]" />
                Thông tin cá nhân
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Họ và Tên */}
                <div className="md:col-span-2">
                  <Label htmlFor="full_name">
                    Họ và Tên <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên đầy đủ"
                      className={`pl-10 ${errors.full_name ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                  )}
                </div>

                {/* Ngày sinh */}
                <div>
                  <Label htmlFor="date_of_birth">
                    Ngày sinh <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                      className={`pl-10 ${errors.date_of_birth ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div>
                  <Label htmlFor="phone_number">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="2005"
                      className={`pl-10 ${errors.phone_number ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="abc@xyz.com"
                      className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* CMND/CCCD */}
                <div>
                  <Label htmlFor="card_id">CMND / CCCD</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="card_id"
                      name="card_id"
                      type="text"
                      value={formData.card_id}
                      onChange={handleChange}
                      placeholder="Nhập số CMND/CCCD"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Địa chỉ */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FFC419]" />
                Địa chỉ
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Địa chỉ hiện tại */}
                <div>
                  <Label htmlFor="current_address">Địa chỉ hiện tại</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="current_address"
                      name="current_address"
                      type="text"
                      value={formData.current_address}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ hiện tại"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Địa chỉ thường trú */}
                <div>
                  <Label htmlFor="permanent_address">Địa chỉ thường trú</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="permanent_address"
                      name="permanent_address"
                      type="text"
                      value={formData.permanent_address}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ thường trú"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Mật khẩu */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-[#2C3E50] mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#FFC419]" />
                Mật khẩu
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mật khẩu */}
                <div>
                  <Label htmlFor="password">
                    Mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Tối thiểu 6 ký tự"
                      className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Nhập lại mật khẩu */}
                <div>
                  <Label htmlFor="confirmPassword">
                    Nhập lại mật khẩu <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu"
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <Link
                to="/User/Login"
                className="text-[#1E90FF] hover:text-[#0066CC] font-medium transition-colors"
              >
                Đã có tài khoản? 
              </Link>
              <Button
                type="submit"
                className="bg-[#FFC419] hover:bg-[#E6AE14] text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all w-full sm:w-auto"
              >
                Đăng ký tài khoản
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register_U;
