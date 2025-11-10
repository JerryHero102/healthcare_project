import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Label from '@/components/ui/label.jsx';
import Input from '@/components/ui/input.jsx';
import Button from '@/components/ui/button.jsx';
import Typography from '@/components/ui/Typography.jsx';

const Register_E = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cardId, setCardId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    // Kiểm tra bắt buộc
    if (!phone || !password || !cardId) {
      setMessage('⚠️ Vui lòng nhập đầy đủ Employee ID, SĐT, mật khẩu và CCCD.');
      return;
    }

    //Kiểm tra độ dài hợp lệ
    if (employeeId.length !== 10) {
      setMessage('⚠️ Mã nhân viên phải đủ 10 số.');
      return;
    }
    if (phone.length !== 10) {
      setMessage('⚠️ Số điện thoại phải đủ 10 số.');
      return;
    }
    if (cardId.length !== 12) {
      setMessage('⚠️ CCCD phải đủ 12 số.');
      return;
    }

    // Chuẩn bị dữ liệu gửi lên API
    const payload = {
      employee_id: employeeId,
      password,
      phone,
      card_id: cardId
    };

    try {
      const res = await axios.post('http://localhost:5001/api/employee/register', payload);

      if (res.status === 201 && res.data) {
        localStorage.setItem('employeeId', res.data.user.employee_id); // lưu ID
        localStorage.setItem('token', res.data.user.token); //Lưu token
        setMessage('✅ Đăng ký thành công — chuyển đến trang đăng nhập...');
        setTimeout(() => navigate('/Admin/auth/login'), 1000);
      } else {
        setMessage('❌ Đăng ký thất bại.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setMessage(err.response?.data?.error || '❌ Lỗi khi gọi API.');
    }
  };

    // ----------
    // UI
    // ----------//
    return (
    <div className="min-h-screen flex items-center justify-center bg-bg-basic">
      <form onSubmit={handleRegister} className="w-96 border border-border-base rounded-md p-4 bg-white">
        <Typography variant="h2" className="text-center">Đăng ký</Typography>

        <div className="mt-4">
          <Label htmlFor="employee_id">Mã nhân viên (tùy chọn)</Label>
          <Input id="employee_id" name="employee_id" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="10 số" />
        </div>

        <div className="mt-4">
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input id="phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10 số" required />
        </div>

         <div className="mt-4">
          <Label htmlFor="cccd">Căn cước công dân *</Label>
          <Input id="cccd" name="cccd" type="number" value={cardId} onChange={(e) => setCardId(e.target.value)} placeholder="12 số" required />
        </div>

        <div className="mt-4">
          <Label htmlFor="password">Mật khẩu *</Label>
          <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="mt-6 flex gap-2 justify-end">
          <Button type="button" className="bg-gray-200 text-black" onClick={() => navigate(-1)}>Quay lại</Button>
          <Button type="submit" className="bg-primary">Đăng ký</Button>
        </div>

        {message && <p className="mt-3 text-sm text-center text-red-600">{message}</p>}
      </form>
    </div>
    );
};

export default Register_E;