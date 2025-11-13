import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

/*--------- 
 REGISTER EMPLOYEE
---------*/
export const registerEmployee = async (req, res) => {
  const { full_name, phone_number, card_id, password } = req.body;

  try {
    if (!full_name || !phone_number || !card_id || !password) {
      return res.status(400).json({ error: "⚠️ Vui lòng nhập đầy đủ thông tin!" });
    }

    // Kiểm tra trùng số điện thoại hoặc card_id
    const existQuery = `SELECT * FROM infor_users WHERE phone_number = $1 OR card_id = $2`;
    const existResult = await db.query(existQuery, [phone_number, card_id]);
    if (existResult.rowCount > 0) {
      return res.status(400).json({ error: "⚠️ Số điện thoại hoặc Căn cước công dân đã tồn tại!" });
    }

    // Băm password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Thêm vào bảng infor_auth_employee
    const insertAuth = `INSERT INTO infor_auth_employee (password_employee) VALUES ($1) RETURNING infor_auth_employee_id`;
    const authResult = await db.query(insertAuth, [hashedPassword]);
    const authId = authResult.rows[0].infor_auth_employee_id;

    // 2️⃣ Thêm vào bảng infor_users
    const insertUser = `INSERT INTO infor_users (phone_number, card_id, full_name) VALUES ($1, $2, $3) RETURNING infor_users_id`;
    const userResult = await db.query(insertUser, [phone_number, card_id, full_name]);
    const usersId = userResult.rows[0].infor_users_id;

    // 3️⃣ Thêm vào bảng infor_employee
    const insertEmp = `
      INSERT INTO infor_employee (infor_users_id, infor_auth_employee, status_employee)
      VALUES ($1, $2, 'active')
      RETURNING infor_employee_id
    `;
    const empResult = await db.query(insertEmp, [usersId, authId]);

    return res.status(201).json({
      success: true,
      message: "✅ Đăng ký nhân viên thành công!",
      employee_id: empResult.rows[0].infor_employee_id
    });

  } catch (err) {
    console.error("❌ registerEmployee error:", err);
    return res.status(500).json({ error: "❌ Đăng ký thất bại, lỗi hệ thống!" });
  }
};

/*--------- 
 LOGIN EMPLOYEE
---------*/
export const loginEmployee = async (req, res) => {
  const { infor_employee_id, password } = req.body;

  try {
    const query = `
      SELECT ie.infor_employee_id, iae.password_employee
      FROM infor_employee ie
      JOIN infor_auth_employee iae ON ie.infor_auth_employee = iae.infor_auth_employee_id
      WHERE ie.infor_employee_id = $1
      LIMIT 1
    `;
    const { rows, rowCount } = await db.query(query, [infor_employee_id]);

    if (rowCount === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });
    }

    const employee = rows[0];
    const match = await bcrypt.compare(password, employee.password_employee);

    if (!match) {
      return res.status(400).json({ success: false, message: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { infor_employee_id: employee.infor_employee_id },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      employee: { infor_employee_id: employee.infor_employee_id }
    });

  } catch (err) {
    console.error("❌ loginEmployee error:", err);
    return res.status(500).json({ success: false, message: "Đăng nhập thất bại" });
  }
};

/*--------- 
 GET EMPLOYEE BY ID
---------*/
export const getEmployeeById = async (req, res) => {
  const { employee_id } = req.params; // <-- lấy id từ URL

  try {
    const q = `
      SELECT 
        e.infor_employee_id,
        u.full_name,
        u.card_id,
        u.phone_number,
        u.date_of_birth,
        u.gender,
        u.permanent_address,
        u.current_address,
        p.position_name AS position,
        d.department_name AS department,
        e.business,
        e.started_date,
        e.salary,
        e.coefficient,
        e.attached,
        e.status_employee
      FROM infor_employee e
      JOIN infor_users u ON e.infor_users_id = u.infor_users_id
      LEFT JOIN list_position p ON e.position_id = p.position_id
      LEFT JOIN list_department d ON e.department_id = d.department_id
      WHERE e.infor_employee_id = $1
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
    console.error("❌ Lỗi khi lấy thông tin nhân viên:", err);
    return res.status(500).json({
      ok: false,
      error: "Lỗi kết nối server!"
    });
  }
};

/*--------- 
 UPDATE EMPLOYEE
---------*/
export const updateEmployee = async (req, res) => {
  const { employee_id } = req.params;
  const updates = req.body;

  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({ error: "⚠️ Không có dữ liệu để cập nhật!" });
    }

    // Tạo câu query động
    const setQuery = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE infor_users SET ${setQuery} WHERE employee_id = $${fields.length + 1} RETURNING *`;

    const { rows } = await db.query(query, [...values, employee_id]);

    return res.status(200).json({
      message: "✅ Cập nhật thành công!",
      user: rows[0]
    });
  } catch (err) {
    console.error("Cập nhật nhân viên thất bại:", err);
    return res.status(500).json({ error: "❌ Lỗi kết nối server!" });
  }
};

/*--------- 
 GET LIST EMPLOYEE
---------*/
export const getListEmployee = async (req, res) => {
  try {
    const q = `
      SELECT 
        iae.infor_auth_employee_id, 
        ie.infor_employee_id, 
        iu.full_name, --user
        ld.department_name, 
        pn.position_name,  
        iae.created_at,
        ie.status_employee 
      FROM infor_employee ie
      JOIN infor_users iu ON ie.infor_users_id = iu.infor_users_id
      LEFT JOIN infor_auth_employee iae on ie.infor_auth_employee = iae.infor_auth_employee_id
      LEFT JOIN list_department ld ON ie.department_id = ld.department_id
      LEFT JOIN list_position pn ON ie.position_id = pn.position_id
      ORDER BY iu.full_name ASC;

    `;
    const { rows, rowCount } = await db.query(q);
    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy toàn khoản nhân viên nào!"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows
    });

  } catch (err) {
    console.error("Lấy danh sách tin nhân viên không thành công:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi kết nối server!"
    });
  }
}
