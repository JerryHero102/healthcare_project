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
  const { employee_id, password, phone, card_id } = req.body;

  try {
    if (!password || !phone || !card_id) {
      return res.status(400).json({ error: "⚠️ Vui lòng nhập đầy đủ thông tin!" });
    }

    const isNumeric = /^\d+$/; // chỉ chấp nhận ký tự số

    // Kiểm tra employee_id nếu có
    if (employee_id) {
      if (!isNumeric.test(employee_id) || employee_id.length !== 10) {
        return res.status(400).json({ error: "❌ Mã nhân viên phải gồm đúng 10 chữ số!" });
      }
    }

    // Kiểm tra phone & card_id
    if (!isNumeric.test(phone) || phone.length !== 10) {
      return res.status(400).json({ error: "❌ Số điện thoại phải gồm đúng 10 chữ số!" });
    }
    if (!isNumeric.test(card_id) || card_id.length !== 12) {
      return res.status(400).json({ error: "❌ Số thẻ (card_id) phải gồm đúng 12 chữ số!" });
    }

    // Kiểm tra trùng
    if ((employee_id && (employee_id === phone || employee_id === card_id)) || phone === card_id) {
      return res.status(400).json({
        error: "❌ Mã nhân viên, Số điện thoại và Căn cước công dân không được trùng nhau!"
      });
    }

    // Kiểm tra trùng trong DB
    const checkExistQuery = `
      SELECT * FROM infor_users
      WHERE (employee_id IS NOT NULL AND employee_id = $1)
        OR phone_number = $2
        OR card_id = $3
    `;
    const existResult = await db.query(checkExistQuery, [
      employee_id || null, // quan trọng: undefined -> null
      phone,
      card_id
    ]);

    if (existResult.rowCount > 0) {
      return res.status(400).json({
        error: "⚠️ Mã nhân viên, Số điện thoại và Căn cước công dân không được trùng nhau!"
      });
    }

    // Băm password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Xác định role dựa vào employee_id
    const role_user = employee_id ? 'employee' : 'users';

    // Thêm mới
    const insertAuthQuery = `
      INSERT INTO infor_users (employee_id, password, phone_number, card_id, role_user)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const authResult = await db.query(insertAuthQuery, [
      employee_id || null,
      hashedPassword,
      phone,
      card_id,
      role_user
    ]);

    return res.status(201).json({
      message: "✅ Đăng ký thành công!",
      user: authResult.rows[0]
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "❌ Đăng ký thất bại, lỗi hệ thống!" });
  }
};




/*--------- 
 LOGIN EMPLOYEE
---------*/
export const loginEmployee = async (req, res) => {
  const { employee_id, password } = req.body;

  try {
    // Truy vấn người dùng theo employee_id (đồng nhất với khi đăng ký)
    const result = await db.query("SELECT * FROM infor_users WHERE employee_id = $1", [employee_id]);
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
    //Câu truy vấn lấy đầy đủ thông tin nhân viên theo employee_id
    const q = `
      SELECT 
        id,
        employee_id,
        phone_number,
        card_id,
        full_name,
        date_of_birth,
        permanent_address,
        current_address,
        position, 
        department,
        started_date,
        salary,
        status_employee
      FROM infor_users
      WHERE employee_id = $1 
        AND role_user = 'employee'
      LIMIT 1;
    `;

    const { rows, rowCount } = await db.query(q, [employee_id]);

    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy nhân viên có ID này!"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows[0]
    });

  } catch (err) {
    console.error("Lấy ID Nhân viên không thành công:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi kết nối server!"
    });
  }
};

/*--------- 
 GET USER BY ID
---------*/
export const getUserById = async (req, res) => {
  const { phone_number } = req.params; //Dùng số điện thoại để đăng nhập

  try {
    const q = `
      SELECT 
        id,
        employee_id,
        phone_number,
        card_id,
        full_name,
        date_of_birth,
        permanent_address,
        current_address
      FROM infor_users
      WHERE phone_number = $1 
        AND role_user = 'users'
      LIMIT 1;
    `;

    const { rows, rowCount } = await db.query(q, [phone_number]);

    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy khách hàng có số điện thoại này!"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows[0]
    });

  } catch (err) {
    console.error("Lấy thông tin khách hàng không thành công:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi kết nối server!"
    });
  }
};

