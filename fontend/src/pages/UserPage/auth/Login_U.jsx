import React, { useState } from "react";
import Typography from '@/components/ui/Typography.jsx';
import Label from '@/components/ui/label.jsx';
import Input from '@/components/ui/input.jsx';
import Button from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login_U = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone_number: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5001/api/users/auth/login", {
        phone: formData.phone_number,
        password: formData.password
      });

      if (res.data.ok) {
        const userData = {
          full_name: res.data.data.full_name
        };

        // Lưu vào localStorage
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user_id", res.data.data.user_id);
        localStorage.setItem("user", JSON.stringify(userData));

        // Phát sự kiện để Header tự refresh
        window.dispatchEvent(new Event("user-login"));

        setMessage("✅ Đăng nhập thành công!");
        navigate('/', { replace: true });
      } else {
        setMessage(res.data.message || "❌ Đăng nhập thất bại!");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "❌ Lỗi server!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => navigate('/User/Register');

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-basic">
      <form onSubmit={handleSubmit} className="w-80 border border-border-base rounded-md p-2.5">
        <Typography variant="h1" className="flex items-center justify-center">Đăng nhập</Typography>

        <div className='mt-4'>
          <Label htmlFor="phone_number">Số điện thoại *</Label>
          <Input
            type="text"
            id="phone_number"
            name="phone_number"
            placeholder="0987654321"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className='mt-4'>
          <Label htmlFor="password">Mật khẩu *</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className='flex items-center justify-center mt-4'>
          <Button type="submit" className='w-full hover:bg-purple-400' disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </div>

        {message && (
          <Typography variant="body2" className="text-center mt-2 text-red-600">
            {message}
          </Typography>
        )}

        <div className='flex items-center justify-center mt-3'>
          <Typography variant="body2">
            Chưa có tài khoản?{' '}
            <span onClick={handleRegister} className='text-purple-600 hover:text-purple-400 cursor-pointer font-medium'>
              Đăng ký ngay
            </span>
          </Typography>
        </div>
      </form>
    </div>
  );
};

export default Login_U;
