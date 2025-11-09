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
    // Truy vấn người dùng theo employee_id (đồng nhất với khi đăng ký)
    const result = await db.query("SELECT * FROM auth_users WHERE employee_id = $1", [employee_id]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: "Không tìm thấy tài khoản" });

    const isMatch = await bcrypt.compare(password, user.password); // So sánh password nhập vào với password đã băm trong cơ sở dữ liệu
    if (!isMatch) return res.status(400).json({ error: "Sai mật khẩu" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "SECRET_KEY", { expiresIn: "1h" }); // Tạo JWT token
    // Trả về cấu trúc thống nhất
    res.json({ success: true, message: "Đăng nhập thành công", token });

  } catch (err) {

    res.status(500).json({ error: "Đăng nhập thất bại" });
  }
};


/*--------- 
 GET EMPLOYEE BY ID
---------*/
export const getEmployeeById = async (req, res) => {
  const { employee_id } = req.params;
  try {
    const q = `
      SELECT a.employee_id,
             a.phone_number AS auth_phone,
             i.full_name, i.email, i.phone_number AS contact_phone,
             i.card_id, i.date_of_birth, i.permanent_address, i.current_address
      FROM auth_users a
      LEFT JOIN information_user i ON a.phone_number = i.phone_number
      WHERE a.employee_id = $1
      LIMIT 1
    `;
  const { rows, rowCount } = await db.query(q, [employee_id]);
    if (rowCount === 0) return res.status(404).json({ ok: false, message: 'Not found' });
    return res.json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error('Lấy ID Nhân viên không thành công:', err);
    return res.status(500).json({ ok: false, error: 'Lỗi kết nối Server' });
  }
};