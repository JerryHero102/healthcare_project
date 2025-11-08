import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


/*--------- 
 GET LIST EMPLOYEE
---------*/
export const getListEmployee = (request, response) => {
    response.status(200).send("OK");
}


/*--------- 
 REGISTER EMPLOYEE
---------*/
export const registerEmployee = async (req, res) => {
  const { employee_id, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Băm password trước khi lưu vào cơ sở dữ liệu
    const result = await db.query(  // Thêm RETURNING * để trả về user vừa tạo
      "INSERT INTO auth_users (employee_id, password) VALUES ($1, $2) RETURNING *",  
      [employee_id, hashedPassword] // Thêm hashedPassword thay vì password
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Đăng ký thất bại" });
  }
};


/*--------- 
 LOGIN EMPLOYEE
---------*/
export const loginEmployee = async (req, res) => {
  const { employee_id, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM auth_users WHERE username = $1", [employee_id]); // Truy vấn người dùng theo username
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: "Không tìm thấy tài khoản" });

    const isMatch = await bcrypt.compare(password, user.password); // So sánh password nhập vào với password đã băm trong cơ sở dữ liệu
    if (!isMatch) return res.status(400).json({ error: "Sai mật khẩu" });

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1h" }); // Tạo JWT token
    res.json({ message: "Đăng nhập thành công", token });

  } catch (err) {

    res.status(500).json({ error: "Đăng nhập thất bại" });
  }
};
