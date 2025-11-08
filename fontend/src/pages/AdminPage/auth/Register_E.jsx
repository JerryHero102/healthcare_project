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
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        if (!phone || !password) {
            setMessage('Vui lòng nhập số điện thoại và mật khẩu');
            return;
        }

        // Nếu employeeId không nhập, dùng phone làm employee_id để test API
        const payload = {
            employee_id: employeeId || phone,
            password,
        };

        try {
            const res = await axios.post('http://localhost:5001/api/employee/register', payload);
            if (res.status === 201 || res.data) {
                setMessage('Đăng ký thành công — chuyển về trang đăng nhập...');
                setTimeout(() => navigate('/Admin/auth/login'), 1000);
            }   else {
                setMessage('Đăng ký thất bại');
            }
        } catch (err) {
            setMessage(err.response?.data?.error || 'Lỗi khi gọi API');
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
          <Input id="employee_id" name="employee_id" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="Nếu để trống sẽ dùng số điện thoại" />
        </div>

        <div className="mt-4">
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input id="phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912345678" required />
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