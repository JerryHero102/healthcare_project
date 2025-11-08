import Typography from '@/components/ui/Typography.jsx';
import Label from '@/components/ui/label.jsx';
import Input from '@/components/ui/input.jsx';
import Button from '@/components/ui/button.jsx';
import { useNavigate } from 'react-router-dom'; // Sử dụng để điều hướng sau khi đăng nhập

const Login_E = () => {
    const navigate = useNavigate(); // Khởi tạo hook điều hướng
    const handleSubmit = (event) => {
        // NGĂN CHẶN tải lại trang
        event.preventDefault(); 
        
        // LOGIC ĐIỀU HƯỚNG TĨNH SAU KHI "ĐĂNG NHẬP"
        // Trong chế độ tĩnh, bạn chuyển ngay đến Dashboard
        navigate('/Admin/Dashboard', { replace: true });
        
        // Gợi ý: Ở đây, bạn sẽ gọi API đăng nhập thực tế
        // const username = event.target.elements[0].value;
        // console.log("Đã thử đăng nhập với:", username);
    };

  return (
    <div>
        <div className="min-h-screen flex items-center justify-center bg-bg-basic">
            <form className="w-80 border border-border-base rounded-md p-2.5">
               {/* Sử dụng H1: Tiêu đề lớn nhất */}
                <Typography variant="h1" className="flex item-center justify-center">Đăng nhập</Typography>
                {/* MÃ nhân viên */}
                <div className='mt-4'>
                    <Label 
                        htmlFor="employee_id">
                        Mã nhân viên *
                    </Label>

                    <Input type="text" 
                        id="employee_id" 
                        name="employee_id" 
                        placeholder="0205060710"
                    ></Input>

                </div>
                {/* Mật khẩu */}
                <div className='mt-4'>
                    <Label 
                        htmlFor="password"
                        >Mật khẩu *
                    </Label>
                    
                    <Input 
                    type="password" 
                    id="password" 
                    name="password"></Input>

                </div>
                <div className='flex item-center justify-center mt-4 hove'>
                    
                    <Button 
                        type="submit" 
                        onClick={handleSubmit}
                        className='w-full hover:bg-purple-400'>
                        Đăng nhập
                    </Button>
                    
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login_E