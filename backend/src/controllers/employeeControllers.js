import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";



//-----------------//------------------- THÔNG TIN NHÂN VIÊN (INFOR_USERS && INFOR_WORKS) -----------------\\-------------------\\
/*--------- 
 ADD INFOR EMPLOYEE
---------*/
export const addInforEmployee = async (req, res) => {
  const {
    full_name,
    phone_number,
    card_id,
    date_of_birth,
    gender,
    permanent_address,
    current_address
  } = req.body;

  try {
    if (!phone_number || !full_name) {
      return res.status(400).json({ error: 'Vui lòng cung cấp ít nhất `phone_number` và `full_name`' });
    }

    // basic numeric checks
    const isNumeric = /^\d+$/;
    if (!isNumeric.test(phone_number) || phone_number.length !== 10) {
      return res.status(400).json({ error: 'Số điện thoại phải gồm đúng 10 chữ số' });
    }
    if (card_id && (!isNumeric.test(card_id) || card_id.length !== 12)) {
      return res.status(400).json({ error: 'Căn cước công dân (card_id) phải gồm đúng 12 chữ số' });
    }

    // Kiểm tra trùng trong DB
    const checkExistQuery = `SELECT * FROM infor_users WHERE phone_number = $1 OR card_id = $2`;
    const existResult = await db.query(checkExistQuery, [phone_number, card_id || null]);
    if (existResult.rowCount > 0) {
      return res.status(400).json({ error: 'Số điện thoại hoặc Căn cước công dân đã tồn tại' });
    }

    const insertQuery = `
      INSERT INTO infor_users (phone_number, card_id, full_name, date_of_birth, gender, permanent_address, current_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING infor_users_id, phone_number, card_id, full_name
    `;

    const insertResult = await db.query(insertQuery, [
      phone_number,
      card_id || null,
      full_name,
      date_of_birth || null,
      typeof gender !== 'undefined' ? gender : null,
      permanent_address || null,
      current_address || null
    ]);

    return res.status(201).json({
      ok: true,
      message: 'Thêm thông tin nhân viên thành công',
      data: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Thêm thông tin nhân viên lỗi:', err);
    return res.status(500).json({ ok: false, error: 'Lỗi server khi thêm thông tin nhân viên' });
  }
};

/*--------- 
 GET INFOR EMPLOYEE BY ID (infor_users_id)
---------*/
export const getEmployeeById = async (req, res) => {
  const { infor_users_id } = req.params;

  try {
    if (!infor_users_id) return res.status(400).json({ ok: false, message: 'Thiếu infor_users_id' });

    const q = `
      SELECT
        infor_users_id,
        full_name,
        card_id,
        phone_number,
        date_of_birth,
        gender,
        permanent_address,
        current_address
      FROM infor_users
      WHERE infor_users_id = $1
      LIMIT 1;
    `;

    const { rows, rowCount } = await db.query(q, [infor_users_id]);
    if (rowCount === 0) {
      return res.status(404).json({ ok: false, message: 'Không tìm thấy thông tin nhân viên' });
    }

    return res.status(200).json({ ok: true, data: rows[0] });
  } catch (err) {
    console.error('Lỗi khi lấy thông tin nhân viên:', err);
    return res.status(500).json({ ok: false, error: 'Lỗi server' });
  }
};

/*--------- 
 UPDATE INFOR EMPLOYEE BY infor_users_id (có kiểm tra token)
---------*/
export const updateEmployee = async (req, res) => {
  const { infor_users_id } = req.params;
  const updates = req.body;

  try {
    if (!infor_users_id) return res.status(400).json({ message: 'Thiếu infor_users_id' });

    if (!req.user) return res.status(401).json({ message: 'Chưa xác thực' });

    // Lấy bản ghi đích để kiểm tra quyền sở hữu
    const targetQ = `SELECT * FROM infor_users WHERE infor_users_id = $1 LIMIT 1`;
    const targetRes = await db.query(targetQ, [infor_users_id]);
    if (targetRes.rowCount === 0) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

    const target = targetRes.rows[0];

    // Nếu không phải admin và không phải chủ sở hữu (so sánh auth_id nếu có), chặn
    if (req.user.role !== 'admin') {
      // Nếu infor_users có cột auth_id, so sánh
      if (target.auth_id && String(req.user.auth_id) !== String(target.auth_id)) {
        return res.status(403).json({ message: 'Không có quyền cập nhật' });
      }
    }

    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) return res.status(400).json({ message: 'Không có dữ liệu để cập nhật' });

    // Validate phone/card uniqueness if thay đổi
    if (updates.phone_number) {
      const q = `SELECT infor_users_id FROM infor_users WHERE phone_number = $1 AND infor_users_id <> $2`;
      const r = await db.query(q, [updates.phone_number, infor_users_id]);
      if (r.rowCount > 0) return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
    }
    if (updates.card_id) {
      const q = `SELECT infor_users_id FROM infor_users WHERE card_id = $1 AND infor_users_id <> $2`;
      const r = await db.query(q, [updates.card_id, infor_users_id]);
      if (r.rowCount > 0) return res.status(400).json({ message: 'Căn cước công dân đã tồn tại' });
    }

    const setQuery = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const query = `UPDATE infor_users SET ${setQuery} WHERE infor_users_id = $${fields.length + 1} RETURNING *`;

    const result = await db.query(query, [...values, infor_users_id]);
    return res.status(200).json({ message: 'Cập nhật thành công', data: result.rows[0] });
  } catch (err) {
    console.error('Lỗi cập nhật thông tin nhân viên:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

/*--------- 
 DELETE INFOR EMPLOYEE BY infor_users_id (có kiểm tra token)
---------*/
export const deleteEmployee = async (req, res) => {
  const { infor_users_id } = req.params;
  try {
    if (!infor_users_id) return res.status(400).json({ message: 'Thiếu infor_users_id' });
    if (!req.user) return res.status(401).json({ message: 'Chưa xác thực' });

    const targetQ = `SELECT * FROM infor_users WHERE infor_users_id = $1 LIMIT 1`;
    const targetRes = await db.query(targetQ, [infor_users_id]);
    if (targetRes.rowCount === 0) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });

    const target = targetRes.rows[0];
    if (req.user.role !== 'admin') {
      if (target.auth_id && String(req.user.auth_id) !== String(target.auth_id)) {
        return res.status(403).json({ message: 'Không có quyền xóa' });
      }
    }

    const delQ = `DELETE FROM infor_users WHERE infor_users_id = $1 RETURNING *`;
    const delRes = await db.query(delQ, [infor_users_id]);
    return res.status(200).json({ ok: true, message: 'Xóa thông tin nhân viên thành công', data: delRes.rows[0] });
  } catch (err) {
    console.error('Lỗi khi xóa thông tin nhân viên:', err);
    return res.status(500).json({ ok: false, message: 'Lỗi server' });
  }
};

/*--------- 
 GET LIST INFOR EMPLOYEE
---------*/
export const getListAEmployee = async (req, res) => {
  try {
    const q = `
      SELECT
        infor_users_id,
        full_name,
        card_id,
        phone_number,
        permanent_address,
        current_address
      FROM infor_users
      ORDER BY full_name ASC
    `;
    const { rows, rowCount } = await db.query(q);
    if (rowCount === 0) {
      return res.status(404).json({ ok: false, message: 'Không tìm thấy nhân viên' });
    }

    return res.status(200).json({ ok: true, data: rows });
  } catch (err) {
    console.error('Lấy danh sách nhân viên không thành công:', err);
    return res.status(500).json({ ok: false, error: 'Lỗi kết nối server' });
  }
};





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

