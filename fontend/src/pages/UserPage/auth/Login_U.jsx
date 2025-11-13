import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Label from '@/components/ui/label.jsx';
import Input from '@/components/ui/input.jsx';
import Button from '@/components/ui/button.jsx';
import { Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const Login_U = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone_number: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

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

        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "Vui lòng nhập số điện thoại";
        } else if (!/^[0-9]{10,11}$/.test(formData.phone_number)) {
            newErrors.phone_number = "Số điện thoại không hợp lệ";
        }

        if (!formData.password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  //       if (!validateForm()) {
  //           return;
  //       }

  //       // TODO: Gọi API xác thực user
  //       // const phone = formData.phone_number;
  //       // const password = formData.password;
  //       // console.log("Đăng nhập user:", phone, password);

  //       // TẠM THỜI ĐIỀU HƯỚNG TĨNH
  //       navigate('/', { replace: true });
  //   };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E3FFF8] via-[#EDFFFA] to-[#F0F9FF] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
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
                    <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">Đăng nhập</h1>
                    <p className="text-gray-600">Chào mừng bạn trở lại!</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Số điện thoại */}
                        <div>
                            <Label htmlFor="phone_number">
                                Số điện thoại <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="tel"
                                    id="phone_number"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    placeholder="0987654321"
                                    className={`pl-10 ${errors.phone_number ? 'border-red-500' : ''}`}
                                    required
                                />
                            </div>
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>
                            )}
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <Label htmlFor="password">
                                Mật khẩu <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Nhập mật khẩu"
                                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

                        {/* Quên mật khẩu */}
                        <div className="flex items-center justify-end">
                            <Link
                                to="#"
                                className="text-sm text-[#1E90FF] hover:text-[#0066CC] transition-colors"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>

                        {/* Nút đăng nhập */}
                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-[#FFC419] hover:bg-[#E6AE14] text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                            >
                                Đăng nhập
                            </Button>
                        </div>

                        {/* Liên kết đăng ký */}
                        <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600">
                                Chưa có tài khoản?{' '}
                                <Link
                                    to="/User/Register"
                                    className="text-[#1E90FF] hover:text-[#0066CC] font-medium transition-colors"
                                >
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
  };
export default Login_U;
