import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

/*--------- 
 ADD INFOR EMPLOYEE
---------*/
<<<<<<< HEAD
export const addInforEmployee = async (req, res) => {
  const { employee_id, password, phone, card_id } = req.body;
=======
export const registerEmployee = async (req, res) => {
  const { full_name, phone_number, card_id, password } = req.body;

>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87
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

    //Thêm vào bảng infor_auth_employee
    const insertAuth = `INSERT INTO infor_auth_employee (password_employee) VALUES ($1) RETURNING infor_auth_employee_id`;
    const authResult = await db.query(insertAuth, [hashedPassword]);
    const authId = authResult.rows[0].infor_auth_employee_id;

    //Thêm vào bảng infor_users
    const insertUser = `INSERT INTO infor_users (phone_number, card_id, full_name) VALUES ($1, $2, $3) RETURNING infor_users_id`;
    const userResult = await db.query(insertUser, [phone_number, card_id, full_name]);
    const usersId = userResult.rows[0].infor_users_id;

    //Thêm vào bảng infor_employee
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
<<<<<<< HEAD
=======
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
>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87
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

<<<<<<< HEAD
=======
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
 UPDATE EMPLOYEE
---------*/
export const deleteEmployee = async (req,res) => {
  const {employee_id} = req.params;
  try {
    const query = `DELETE FROM infor_employee WHERE infor_employee_id = $1 RETURNING *`;
    const {rows, rowCount} = await db.query(query, [employee_id]);
    if (rowCount === 0) {
      return res.status(404).json({ok: false, message: "❌ Không tìm thấy id nhân viên"});
    }
    return res.json({ok: true, message: "✅ Xoá account nhân viên thành công!", user: rows[0]});
  } catch (err) {
    console.error("❌ Lỗi khi xoá account nhân viên:", err);
    return res.status(500).json({ ok: false, message: "❌ Lỗi hệ thống!" });
  }
};
>>>>>>> 8519796619d91bbf391e5f894299a50a66f70f87

/*--------- 
 GET LIST EMPLOYEE (TEST API SUCCESSFULL)
---------*/
export const getListAEmployee = async (req, res) => {
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

