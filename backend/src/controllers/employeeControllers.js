import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

/*--------- 
 ADD INFOR EMPLOYEE
---------*/
export const addInforEmployee = async (req, res) => {
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
      error: "Lỗi máy chủ khi truy vấn thông tin nhân viên!"
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


/*--------- 
 GET LIST EMPLOYEE (TEST API SUCCESSFULL)
---------*/
export const getListAEmployee = async (req, res) => {
  try {
    const q = `
      SELECT 
        id,
        full_name,
        employee_id,
        card_id,
        phone_number,
        permanent_address,
        current_address
      FROM infor_users
      WHERE role_user = 'employee'
      ORDER BY full_name ASC
    `;
    const { rows, rowCount } = await db.query(q);
    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy khách hàng có số điện thoại này!"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows
    });

  } catch (err) {
    console.error("Lấy thông tin khách hàng không thành công:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi kết nối server!"
    });
  }
}





//-----------------//------------------- THÔNG TIN ĐĂNG NHẬP (AUTH_USES) -----------------\\-------------------\\


/*--------- 
 REGISTER EMPLOYEE (TEST API SUCCESSFULL)
---------*/
export const registerEmployee = async (req, res) => {
  const { username, password} = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin!" });
    }
    const checkExistQuery = `SELECT * FROM auth_users 
                              WHERE username = $1`;
    const existResult = await db.query(checkExistQuery, [username]);

    if (existResult.rowCount > 0) {
      return res.status(400).json({
        error: "Đã tồn tại!"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertAuthQuery = `
      INSERT INTO auth_users (username, password, role, created_date_auth)
      VALUES ($1, $2, 'employee', NOW())
      RETURNING * `;
    const authResult = await db.query(insertAuthQuery, [
      username,
      hashedPassword,
    ]);

    return res.status(201).json({
      message: "✅ Đăng ký nhân viên thành công!",
      user: authResult.rows[0]
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Đăng ký thất bại, lỗi hệ thống!" });
  }
};

/*--------- 
 LOGIN EMPLOYEE (TEST API SUCCESSFULL)
---------*/
export const loginEmployee = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM auth_users WHERE username = $1",
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ success: false, message: "Không tìm thấy tài khoản" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Sai mật khẩu" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { auth_id: user.auth_id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        auth_id: user.auth_id,
        username: user.username,
        phone_number: user.phone_number,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Đăng nhập thất bại" });
  }
};

/*--------- 
 UPDATE ACCOUNT EMPLOYEE - PASSWORD (TEST API SUCCESSFULL)
---------*/
export const updateAccountEmployee = async (req, res) => {
  const { auth_id } = req.params; // Lấy từ URL, middleware đã đảm bảo tồn tại
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: "Thiếu mật khẩu mới!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await db.query(
      "UPDATE auth_users SET password = $1 WHERE auth_id = $2 RETURNING *",
      [hashedPassword, auth_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    res.status(200).json({
      message: "Đổi mật khẩu thành công!",
      user: {
        auth_id: result.rows[0].auth_id,
        username: result.rows[0].username,
        role: result.rows[0].role
      }
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật mật khẩu!" });
  }
};


/*--------- 
 DELETE ACCOUNT EMPLOYEE (TEST API SUCCESSFULL)
---------*/
export const deleteAccountEmployee = async (req, res) => {
  const { auth_id } = req.params;

  try {
    const query = `
      DELETE FROM auth_users
      WHERE auth_id = $1 AND role = 'employee'
      RETURNING *
    `;
    
    const result = await db.query(query, [auth_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "Không tìm thấy tài khoản nhân viên"
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Xóa tài khoản nhân viên thành công!",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("Delete employee error:", err);
    return res.status(500).json({ 
      ok: false,
      error: "Xóa thất bại, lỗi server!" 
    });
  }
};


/*--------- 
 GET LIST ACCOUNT (TEST API SUCCESSFULL)
---------*/
export const getListAccountEmloyee = async(req, res) => {
  try {
    const q = `SELECT * FROM auth_users WHERE role = 'employee'`;
    const result = await db.query(q); // result.rows, result.rowCount
    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "Không tìm thấy tài khoản nhân viên"
      });
    }

    return res.status(200).json({
      ok: true,
      data: result.rows
    });
  } catch (error) {
    console.error("Lấy thông tin tài khoản nhân viên không thành công:", error);
    return res.status(500).json({
    ok: false,
    error: "Lỗi kết nối server!"
    });
  }
};

