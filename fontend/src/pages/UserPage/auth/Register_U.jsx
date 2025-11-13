import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Inputs = (props) => (
  <input
    {...props}
    className={`border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-[#e6b800] focus:ring-[#e6b800] transition
      ${props.disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300"
        : ""
      } ${props.className || ""}`}
  />
);

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

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("❌ Mật khẩu nhập lại không khớp!");
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
    <div className="p-4 max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
        <div className="w-full flex gap-4 mb-4">
          <div className="w-2/3">
            <h6>Họ và Tên</h6>
            <Inputs
              className="w-full"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-1/3">
            <h6>Ngày sinh</h6>
            <Inputs
              className="w-full"
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="w-full flex gap-4 mb-4">
          <div className="w-1/2">
            <h6>Số điện thoại</h6>
            <Inputs
              className="w-full"
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-1/2">
            <h6>Email</h6>
            <Inputs
              className="w-full"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full flex gap-4 mb-4">
          <div className="w-1/2">
            <h6>CMND / CCCD</h6>
            <Inputs
              className="w-full"
              type="text"
              name="card_id"
              value={formData.card_id}
              onChange={handleChange}
            />
          </div>
          <div className="w-1/2">
            <h6>Địa chỉ hiện tại</h6>
            <Inputs
              className="w-full"
              type="text"
              name="current_address"
              value={formData.current_address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full flex gap-4 mb-4">
          <div className="w-1/2">
            <h6>Địa chỉ thường trú</h6>
            <Inputs
              className="w-full"
              type="text"
              name="permanent_address"
              value={formData.permanent_address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full flex gap-4">
          <div className="w-1/2">
            <h6>Mật khẩu</h6>
            <Inputs
              className="w-full"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-1/2">
            <h6>Nhập lại mật khẩu</h6>
            <Inputs
              className="w-full"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`bg-[#e6b800] text-white cursor-pointer float-end px-4 py-2 rounded-md mt-8 hover:bg-[#ccac00] transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </button>
        </div>

        {message && (
          <p className={`mt-4 text-center text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register_U;
