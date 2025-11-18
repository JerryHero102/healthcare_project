import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

/*--------- 
 REGISTER USER (PASS API)
---------*/
export const registerUser = async (req, res) => {
    const { phone, password, role} = req.body;
    try {
        // Kiểm tra nếu user đã tồn tại
        const existingUser = await db.query('SELECT * FROM auth_users WHERE phone_number = $1', [phone]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Người dùng đã tồn tại' });
        }
        // Băm mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAuth = await db.query(
            'INSERT INTO auth_users (phone_number, password, role, created_date_auth) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [phone, hashedPassword, role || 'customer']
        );
        res.status(201).json({ message: 'Tài khoản người dùng tạo thành công', auth: newAuth.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kết nối SERVER thất bại' });
    }
};

/*--------- 
 LOGIN USER (PASS API)
---------*/
export const loginUser = async (req, res) => {
    const { phone, password } = req.body;
    try {
        // Tìm người dùng theo số điện thoại    
        const userResult = await db.query('SELECT * FROM auth_users WHERE phone_number = $1', [phone]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
        }
        const user = userResult.rows[0];
        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
        }
        // Tạo JWT
        const token = jwt.sign(
            { auth_id: user.auth_id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'SECRET_KEY',
            { expiresIn: '1h' }
        );
        res.status(200).json({ message: 'Đăng nhập thành công', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kết nối SERVER thất bại' });
    }
};

/*--------- 
 DELETE USER
---------*/
export const deleteUser = async (req, res) => {};

/*--------- 
 UPDATE USER
---------*/
export const updateUser = async (req, res) => {};

/*--------- 
 GET USER BY ID
---------*/
export const getUserById = async (req, res) => {};

/*--------- 
 LIST ALL USER
---------*/
export const getListUser = async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM auth_users where role = $1', ['customer']);
        res.status(200).json(users.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kết nối SERVER thất bại' });
    }
};
